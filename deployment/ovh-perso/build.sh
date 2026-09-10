#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
PROJECT_ROOT="$(CDPATH='' cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
BUILD_DIRECTORY="$PROJECT_ROOT/build/ovh-perso"

info() {
    printf '\n%s\n' "$1"
}

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        printf 'Commande requise introuvable : %s\n' "$1" >&2
        exit 1
    fi
}

require_file() {
    if [[ ! -f "$1" ]]; then
        printf 'Fichier requis introuvable : %s\n' "$1" >&2
        exit 1
    fi
}

require_directory() {
    if [[ ! -d "$1" ]]; then
        printf 'Dossier attendu introuvable après le build : %s\n' "$1" >&2
        exit 1
    fi
}

require_command docker
require_command rsync
docker compose version >/dev/null

require_file "$PROJECT_ROOT/api/.env.prod.local"
require_file "$SCRIPT_DIRECTORY/.ovhconfig"
require_file "$SCRIPT_DIRECTORY/public/.htaccess"
require_file "$SCRIPT_DIRECTORY/public/api.php"
require_file "$SCRIPT_DIRECTORY/public/uploads/.htaccess"

cd "$PROJECT_ROOT"

info 'Construction de l’image Docker de l’API…'
docker compose build api

info 'Installation des dépendances PHP de production…'
docker compose run --rm --no-deps -e APP_ENV=prod -e APP_DEBUG=0 api composer install --no-dev --optimize-autoloader

info 'Génération de la paire de clés JWT si nécessaire…'
docker compose run --rm --no-deps -e APP_ENV=prod -e APP_DEBUG=0 api php bin/console lexik:jwt:generate-keypair --skip-if-exists

info 'Installation des dépendances du front…'
docker compose run --rm front yarn install --frozen-lockfile

info 'Construction du front…'
docker compose run --rm front yarn build

require_directory "$PROJECT_ROOT/api/vendor"
require_directory "$PROJECT_ROOT/front/dist"

if [[ "$BUILD_DIRECTORY" != "$PROJECT_ROOT/build/ovh-perso" || "$BUILD_DIRECTORY" == "/" ]]; then
    printf 'Dossier de build invalide : %s\n' "$BUILD_DIRECTORY" >&2
    exit 1
fi

info 'Préparation du dossier de livraison OVHcloud…'
rm -rf -- "$BUILD_DIRECTORY"
mkdir -p \
    "$BUILD_DIRECTORY/app/var/cache" \
    "$BUILD_DIRECTORY/app/var/log" \
    "$BUILD_DIRECTORY/app/var/upload_chunks" \
    "$BUILD_DIRECTORY/public/uploads"

rsync -a "$PROJECT_ROOT/api/" "$BUILD_DIRECTORY/app/" \
    --exclude='.env.local' \
    --exclude='.env.prod.local' \
    --exclude='Dockerfile' \
    --exclude='docker/' \
    --exclude='public/' \
    --exclude='tests/' \
    --exclude='var/'

cp "$PROJECT_ROOT/api/.env.prod.local" "$BUILD_DIRECTORY/app/.env.local"
rsync -a "$PROJECT_ROOT/front/dist/" "$BUILD_DIRECTORY/public/"
cp "$SCRIPT_DIRECTORY/.ovhconfig" "$BUILD_DIRECTORY/.ovhconfig"
cp "$SCRIPT_DIRECTORY/public/.htaccess" "$BUILD_DIRECTORY/public/.htaccess"
cp "$SCRIPT_DIRECTORY/public/api.php" "$BUILD_DIRECTORY/public/api.php"
cp "$SCRIPT_DIRECTORY/public/uploads/.htaccess" "$BUILD_DIRECTORY/public/uploads/.htaccess"

info "Livraison prête dans $BUILD_DIRECTORY"
