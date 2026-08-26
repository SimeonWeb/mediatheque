<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260822000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout du type automatique des médias';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file ADD type VARCHAR(20) DEFAULT NULL');
        $this->addSql(<<<'SQL'
            UPDATE media_file
            SET type = CASE
                WHEN mime_type LIKE 'image/%' THEN 'image'
                WHEN mime_type LIKE 'video/%' THEN 'video'
                WHEN mime_type LIKE 'audio/%' THEN 'audio'
                WHEN mime_type LIKE 'text/%' OR mime_type IN ('application/pdf', 'application/json') THEN 'document'
                ELSE 'other'
            END
            SQL);
        $this->addSql('ALTER TABLE media_file MODIFY type VARCHAR(20) NOT NULL');
        $this->addSql('CREATE INDEX idx_media_file_type ON media_file (type)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_media_file_type ON media_file');
        $this->addSql('ALTER TABLE media_file DROP type');
    }
}
