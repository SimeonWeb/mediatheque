<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260820000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout de la date d’upload distincte de la date de création du fichier';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file ADD uploaded_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE media_file SET uploaded_at = created_at');
        $this->addSql('ALTER TABLE media_file MODIFY uploaded_at DATETIME NOT NULL');
        $this->addSql('CREATE INDEX idx_media_file_uploaded_at ON media_file (uploaded_at)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_media_file_uploaded_at ON media_file');
        $this->addSql('ALTER TABLE media_file DROP uploaded_at');
    }
}
