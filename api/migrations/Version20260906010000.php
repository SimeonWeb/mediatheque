<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260906010000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Remplacement des UUID Uploader et MediaFileMeta par des identifiants numériques';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file DROP FOREIGN KEY FK_4FD8E9C316678C77');
        $this->addSql('ALTER TABLE uploader ADD numeric_id BIGINT AUTO_INCREMENT NOT NULL, ADD UNIQUE INDEX UNIQ_UPLOADER_NUMERIC_ID (numeric_id)');
        $this->addSql('ALTER TABLE media_file ADD numeric_uploader_id BIGINT DEFAULT NULL');
        $this->addSql('UPDATE media_file media INNER JOIN uploader uploader ON media.uploader_id = uploader.id SET media.numeric_uploader_id = uploader.numeric_id');
        $this->addSql('ALTER TABLE media_file MODIFY numeric_uploader_id BIGINT NOT NULL');
        $this->addSql('ALTER TABLE media_file DROP INDEX IDX_4FD8E9C316678C77, DROP uploader_id, CHANGE numeric_uploader_id uploader_id BIGINT NOT NULL');
        $this->addSql('ALTER TABLE uploader DROP PRIMARY KEY, DROP id, CHANGE numeric_id id BIGINT AUTO_INCREMENT NOT NULL, ADD PRIMARY KEY (id), DROP INDEX UNIQ_UPLOADER_NUMERIC_ID');
        $this->addSql('ALTER TABLE media_file ADD INDEX IDX_4FD8E9C316678C77 (uploader_id)');
        $this->addSql('ALTER TABLE media_file ADD CONSTRAINT FK_4FD8E9C316678C77 FOREIGN KEY (uploader_id) REFERENCES uploader (id) ON DELETE RESTRICT');

        $this->addSql('ALTER TABLE media_file_meta ADD numeric_id BIGINT AUTO_INCREMENT NOT NULL, ADD UNIQUE INDEX UNIQ_MEDIA_FILE_META_NUMERIC_ID (numeric_id)');
        $this->addSql('ALTER TABLE media_file_meta DROP PRIMARY KEY, DROP id, CHANGE numeric_id id BIGINT AUTO_INCREMENT NOT NULL, ADD PRIMARY KEY (id), DROP INDEX UNIQ_MEDIA_FILE_META_NUMERIC_ID');
    }

    public function down(Schema $schema): void
    {
        $this->throwIrreversibleMigrationException('Les UUID Uploader et MediaFileMeta historiques ne peuvent pas être restaurés.');
    }
}
