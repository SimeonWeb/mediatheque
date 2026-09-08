<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260819205305 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création du schéma initial de la médiathèque';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE uploader (id BIGINT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_636BC363989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE media_file (id BIGINT AUTO_INCREMENT NOT NULL, original_name VARCHAR(255) NOT NULL, storage_name VARCHAR(255) NOT NULL, relative_path VARCHAR(500) NOT NULL, thumbnail_relative_path VARCHAR(500) DEFAULT NULL, full_relative_path VARCHAR(500) DEFAULT NULL, medium_relative_path VARCHAR(500) DEFAULT NULL, mime_type VARCHAR(255) NOT NULL, type VARCHAR(20) NOT NULL, extension VARCHAR(20) DEFAULT NULL, size BIGINT NOT NULL, created_at DATETIME NOT NULL, uploaded_at DATETIME NOT NULL, uploader_id BIGINT NOT NULL, UNIQUE INDEX UNIQ_4FD8E9C3570EB513 (storage_name), INDEX IDX_4FD8E9C316678C77 (uploader_id), INDEX idx_media_file_original_name (original_name), INDEX idx_media_file_mime_type (mime_type), INDEX idx_media_file_type (type), INDEX idx_media_file_size (size), INDEX idx_media_file_created_at (created_at), INDEX idx_media_file_created_at_id (created_at, id), INDEX idx_media_file_uploaded_at (uploaded_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE media_file_meta (id BIGINT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, value LONGTEXT NOT NULL, media_file_id BIGINT NOT NULL, INDEX IDX_7B6ECFD5F21CFF25 (media_file_id), UNIQUE INDEX uniq_media_file_meta_title (media_file_id, title), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE media_file ADD CONSTRAINT FK_4FD8E9C316678C77 FOREIGN KEY (uploader_id) REFERENCES uploader (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE media_file_meta ADD CONSTRAINT FK_7B6ECFD5F21CFF25 FOREIGN KEY (media_file_id) REFERENCES media_file (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE media_file_meta');
        $this->addSql('DROP TABLE media_file');
        $this->addSql('DROP TABLE uploader');
    }
}
