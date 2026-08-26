<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260819205305 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table des métadonnées de fichiers';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE media_file (id BINARY(16) NOT NULL, original_name VARCHAR(255) NOT NULL, storage_name VARCHAR(255) NOT NULL, relative_path VARCHAR(500) NOT NULL, mime_type VARCHAR(255) NOT NULL, extension VARCHAR(20) DEFAULT NULL, size BIGINT NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_4FD8E9C3570EB513 (storage_name), INDEX idx_media_file_original_name (original_name), INDEX idx_media_file_mime_type (mime_type), INDEX idx_media_file_size (size), INDEX idx_media_file_created_at (created_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE media_file');
    }
}
