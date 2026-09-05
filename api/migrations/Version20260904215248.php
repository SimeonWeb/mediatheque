<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260904215248 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout des métadonnées associées aux fichiers média';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE media_file_meta (id BINARY(16) NOT NULL, title VARCHAR(255) NOT NULL, value LONGTEXT NOT NULL, media_file_id BINARY(16) NOT NULL, INDEX IDX_7B6ECFD5F21CFF25 (media_file_id), UNIQUE INDEX uniq_media_file_meta_title (media_file_id, title), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE media_file_meta ADD CONSTRAINT FK_7B6ECFD5F21CFF25 FOREIGN KEY (media_file_id) REFERENCES media_file (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file_meta DROP FOREIGN KEY FK_7B6ECFD5F21CFF25');
        $this->addSql('DROP TABLE media_file_meta');
    }
}
