<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260819210532 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création des uploaders et association obligatoire aux fichiers';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE uploader (id BINARY(16) NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_636BC363989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE media_file ADD uploader_id BINARY(16) NOT NULL');
        $this->addSql('ALTER TABLE media_file ADD CONSTRAINT FK_4FD8E9C316678C77 FOREIGN KEY (uploader_id) REFERENCES uploader (id) ON DELETE RESTRICT');
        $this->addSql('CREATE INDEX IDX_4FD8E9C316678C77 ON media_file (uploader_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file DROP FOREIGN KEY FK_4FD8E9C316678C77');
        $this->addSql('DROP INDEX IDX_4FD8E9C316678C77 ON media_file');
        $this->addSql('ALTER TABLE media_file DROP uploader_id');
        $this->addSql('DROP TABLE uploader');
    }
}
