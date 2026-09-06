<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260906000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Remplacement des UUID MediaFile par des identifiants numériques';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file_meta DROP FOREIGN KEY FK_7B6ECFD5F21CFF25');
        $this->addSql('ALTER TABLE media_file ADD numeric_id BIGINT AUTO_INCREMENT NOT NULL, ADD UNIQUE INDEX UNIQ_MEDIA_FILE_NUMERIC_ID (numeric_id)');
        $this->addSql('ALTER TABLE media_file_meta ADD numeric_media_file_id BIGINT DEFAULT NULL');
        $this->addSql('UPDATE media_file_meta metadata INNER JOIN media_file media ON metadata.media_file_id = media.id SET metadata.numeric_media_file_id = media.numeric_id');
        $this->addSql('ALTER TABLE media_file_meta MODIFY numeric_media_file_id BIGINT NOT NULL');
        $this->addSql('ALTER TABLE media_file_meta DROP INDEX IDX_7B6ECFD5F21CFF25, DROP INDEX uniq_media_file_meta_title');
        $this->addSql('ALTER TABLE media_file_meta DROP media_file_id, CHANGE numeric_media_file_id media_file_id BIGINT NOT NULL');
        $this->addSql('ALTER TABLE media_file DROP PRIMARY KEY, DROP id, CHANGE numeric_id id BIGINT AUTO_INCREMENT NOT NULL, ADD PRIMARY KEY (id), DROP INDEX UNIQ_MEDIA_FILE_NUMERIC_ID');
        $this->addSql('ALTER TABLE media_file_meta ADD INDEX IDX_7B6ECFD5F21CFF25 (media_file_id), ADD UNIQUE INDEX uniq_media_file_meta_title (media_file_id, title)');
        $this->addSql('ALTER TABLE media_file_meta ADD CONSTRAINT FK_7B6ECFD5F21CFF25 FOREIGN KEY (media_file_id) REFERENCES media_file (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_media_file_created_at_id ON media_file (created_at, id)');
    }

    public function down(Schema $schema): void
    {
        $this->throwIrreversibleMigrationException('Les UUID MediaFile historiques ne peuvent pas être restaurés.');
    }
}
