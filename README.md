# Médiathèque

Médiathèque en ligne composée d'une API Symfony/API Platform et d'un front React/Vite.

## Installation sur un hébergement mutualisé OVHcloud PERSO

### Compatibilité

Le projet peut fonctionner sur une offre PERSO, avec quelques contraintes :

- PHP 8.4 est requis par Symfony ; il doit être sélectionné dans la configuration OVHcloud ;
- l'offre PERSO ne fournit pas d'accès SSH : Composer, les migrations Doctrine et le build Vite doivent être exécutés en local ;
- le serveur doit disposer des extensions PHP `ctype`, `exif`, `gd`, `iconv` et `pdo_mysql` ;
- le front et l'API sont servis sur le même domaine, respectivement à `/` et `/api` ;
- les fichiers sont stockés sur l'espace disque de l'hébergement dans `/uploads` ;
- la limite applicative de 2 Go ne permet pas de dépasser les limites HTTP/PHP imposées par OVHcloud. Les envois sont toutefois découpés par le front en blocs de 5 Mo.

L'architecture de déploiement prévue est la suivante :

```text
mediatheque/
├── .ovhconfig
├── app/                    # Symfony, non accessible depuis le Web
│   ├── config/
│   ├── src/
│   ├── var/
│   ├── vendor/             # obligatoirement construit et envoyé
│   └── .env.local
└── public/                 # racine configurée pour le domaine OVHcloud
    ├── .htaccess
    ├── api.php             # contrôleur frontal Symfony
    ├── index.html          # build React
    ├── assets/
    └── uploads/
```

Les fichiers spécifiques à cette architecture se trouvent dans [`deployment/ovh-perso`](deployment/ovh-perso).

### 1. Prérequis locaux

La machine utilisée pour préparer la livraison doit disposer de :

- Docker avec Docker Compose, ou PHP 8.4 et Composer 2 ;
- Node.js 24 et Yarn ;
- un client FTP/FTPS, par exemple FileZilla.

Le build doit être fait depuis la racine du dépôt.

### 2. Créer la base de données OVHcloud

Dans l'espace client OVHcloud :

1. ouvrir `Web Cloud` > `Hébergements` > l'hébergement concerné > `Bases de données` ;
2. créer une base MySQL et conserver son serveur, son port, son nom, son utilisateur, son mot de passe et sa version ;
3. ouvrir phpMyAdmin depuis l'espace client ;
4. sélectionner la base puis importer [`deployment/ovh-perso/schema.sql`](deployment/ovh-perso/schema.sql).

Ce fichier correspond à la migration initiale actuelle et enregistre celle-ci dans la table Doctrine. Il doit être régénéré si de nouvelles migrations sont ajoutées avant une nouvelle installation.

### 3. Configurer la production

Copier [`deployment/ovh-perso/app.env.local.dist`](deployment/ovh-perso/app.env.local.dist) vers `api/.env.local`, puis remplacer toutes les valeurs `CHANGE_ME`.

```dotenv
APP_ENV=prod
APP_DEBUG=0
APP_SECRET=CHANGE_ME
APP_TIMEZONE=Europe/Paris
DEFAULT_URI=https://media.example.com

DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME?serverVersion=8.0&charset=utf8mb4"
CORS_ALLOW_ORIGIN='^https://media\.example\.com$'

UPLOAD_BEARER_TOKEN=CHANGE_ME
UPLOAD_ALL_BEARER_TOKEN=CHANGE_ME
READ_BEARER_TOKEN=CHANGE_ME
```

Adapter `serverVersion` à la version affichée par OVHcloud. Si le mot de passe de la base contient des caractères réservés dans une URL (`@`, `:`, `/`, `#`, etc.), il faut les encoder.

Générer quatre secrets différents en local :

```bash
openssl rand -hex 32
```

Utiliser le premier pour `APP_SECRET` et les trois autres pour les tokens d'accès. Affecter aussi une valeur différente à `JWT_PASSPHRASE`. Ne jamais versionner `api/.env.local`.

### 4. Construire l'API et le front

Installer les dépendances PHP de production :

```bash
docker compose build api
docker compose run --rm --no-deps api composer install --no-dev --optimize-autoloader
```

Le bundle JWT est actuellement chargé même si l'application utilise ses propres Bearer tokens. Générer sa paire de clés après l'installation de Composer :

```bash
docker compose run --rm --no-deps api php bin/console lexik:jwt:generate-keypair --skip-if-exists
```

Construire le front avec les URL de production, qui restent relatives puisque tout est servi sur le même domaine :

```bash
cd front
cp .env.dist .env.production.local
printf 'VITE_API_URL=/api\nVITE_UPLOADS_URL=/uploads\n' > .env.production.local
yarn install --frozen-lockfile
yarn build
cd ..
```

Le dossier `front/dist` et le dossier `api/vendor` doivent exister avant de poursuivre.

### 5. Préparer le dossier à envoyer

À partir de la racine du dépôt :

```bash
rm -rf build/ovh-perso
mkdir -p build/ovh-perso/app/var/cache build/ovh-perso/app/var/log build/ovh-perso/app/var/upload_chunks
mkdir -p build/ovh-perso/public/uploads

rsync -a api/ build/ovh-perso/app/ \
  --exclude='.env.local' \
  --exclude='Dockerfile' \
  --exclude='docker/' \
  --exclude='public/' \
  --exclude='tests/' \
  --exclude='var/'

cp api/.env.local build/ovh-perso/app/.env.local
rsync -a front/dist/ build/ovh-perso/public/
cp deployment/ovh-perso/.ovhconfig build/ovh-perso/.ovhconfig
cp deployment/ovh-perso/public/.htaccess build/ovh-perso/public/.htaccess
cp deployment/ovh-perso/public/api.php build/ovh-perso/public/api.php
cp deployment/ovh-perso/public/uploads/.htaccess build/ovh-perso/public/uploads/.htaccess
```

Le contrôleur `api.php` configure automatiquement le stockage final dans le dossier public `uploads`. Les fragments temporaires restent dans `app/var/upload_chunks`.

### 6. Envoyer la livraison par FTPS

Se connecter au serveur avec les identifiants FTP fournis par OVHcloud et envoyer le contenu de `build/ovh-perso` dans un dossier `mediatheque` :

```text
/.ovhconfig
/mediatheque/app/...
/mediatheque/public/...
```

Vérifier après le transfert que les fichiers masqués `.ovhconfig`, `.env.local` et `.htaccess` ont bien été envoyés.

Le fichier `.ovhconfig` doit être déposé à la racine du serveur, il modifira la configuration php pour l'ensemble du serveur et des sites hébergés sur celui-ci.

Les dossiers suivants doivent être accessibles en écriture par PHP :

- `/mediatheque/app/var` ;
- `/mediatheque/public/uploads`.

Sur un hébergement OVHcloud standard, les fichiers envoyés par le compte FTP ont normalement les bons droits. En cas d'erreur d'écriture, utiliser les droits `705` pour les dossiers concernés ; ne pas utiliser `777`.

### 7. Configurer le domaine

Dans `Hébergements` > `Multisite` :

1. ajouter ou modifier le domaine destiné à la médiathèque ;
2. définir son dossier racine sur `mediatheque/public` ;
3. activer SSL ; laisser le pare-feu applicatif désactivé pour le premier test, puis le tester séparément si souhaité ;
4. attendre la génération du certificat puis activer la redirection HTTPS depuis l'espace client OVHcloud.

La racine ne doit jamais pointer vers `mediatheque` ou `mediatheque/app`, faute de quoi les secrets et le code de l'API pourraient devenir publics.

### 8. Vérifier l'installation

Tester l'API avec le token de lecture :

```bash
curl -i \
  -H 'Accept: application/ld+json' \
  -H 'Authorization: Bearer READ_BEARER_TOKEN' \
  https://media.example.com/api/media_files
```

Puis ouvrir l'interface en lui transmettant un token une première fois :

```text
https://media.example.com/?token=READ_BEARER_TOKEN
```

Le token est conservé par le navigateur puis retiré de l'URL. Utiliser :

- `READ_BEARER_TOKEN` pour la consultation ;
- `UPLOAD_BEARER_TOKEN` pour consulter et envoyer des fichiers ;
- `UPLOAD_ALL_BEARER_TOKEN` pour les opérations d'envoi étendues.

Vérifier enfin l'envoi d'une petite image, sa miniature et son accès sous `/uploads/...`.

## Déployer une mise à jour

Reconstruire `api/vendor` et `front/dist`, recréer `build/ovh-perso`, puis remplacer par FTPS les dossiers `app` et les fichiers statiques de `public`. Conserver :

- le fichier de production `app/.env.local` ;
- le contenu de `public/uploads` ;
- les éventuelles clés `app/config/jwt/*.pem`.

S'il existe une nouvelle migration, générer son SQL localement et l'exécuter dans phpMyAdmin avant de mettre le nouveau code en ligne. Faire une sauvegarde de la base et des uploads avant chaque mise à jour.

## Adaptations et limites connues

Les adaptations nécessaires à l'offre PERSO sont fournies dans `deployment/ovh-perso` : contrôleur frontal déporté, règles Apache, sélection de PHP 8.4, protection du dossier d'uploads et script SQL initial.

Il reste un point à traiter ou à surveiller :

**L'offre PERSO est adaptée à un usage modéré.** Le traitement GD de photos très grandes consomme beaucoup de mémoire et les limites PHP ne sont pas modifiables via `php.ini`. Tester avec les plus gros fichiers attendus. Si les traitements expirent ou manquent de mémoire, il faudra réduire `MAX_SOURCE_PIXELS`/les tailles générées, ou passer à un hébergement avec davantage de contrôle (Pro, VPS, Public Cloud ou stockage objet).

La séparation front/API ne demande pas de modification supplémentaire du code : les URL relatives déjà utilisées (`/api` et `/uploads`) correspondent au routage fourni.

## Références OVHcloud

- [Configurer la version de PHP avec `.ovhconfig`](https://docs.ovhcloud.com/fr/guides/web-cloud/web-hosting/configure-your-web-hosting)
- [Versions et environnements disponibles](https://docs.ovhcloud.com/en/guides/web-cloud/web-hosting/web-hosting-main-info)
- [Utiliser l'accès SSH sur un hébergement Web](https://docs.ovhcloud.com/fr/guides/web-cloud/web-hosting/ssh-on-webhosting)
- [Réécrire les URL avec `.htaccess`](https://help.ovhcloud.com/csm/en-gb-web-hosting-htaccess-url-rewriting?id=kb_article_view&sysparm_article=KB0052853)
- [Spécificités techniques des hébergements Web](https://docs.ovhcloud.com/en/guides/web-cloud/web-hosting/hosting-technical-specificities)

## Développement local

```bash
docker compose up --build
```

Le front est alors disponible sur <http://localhost> et l'API sous <http://localhost/api>.
