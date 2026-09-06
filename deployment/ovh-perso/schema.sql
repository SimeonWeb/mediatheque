SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE uploader (
    id BIGINT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    UNIQUE INDEX UNIQ_636BC363989D9B62 (slug),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE media_file (
    id BIGINT AUTO_INCREMENT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_name VARCHAR(255) NOT NULL,
    relative_path VARCHAR(500) NOT NULL,
    thumbnail_relative_path VARCHAR(500) DEFAULT NULL,
    full_relative_path VARCHAR(500) DEFAULT NULL,
    medium_relative_path VARCHAR(500) DEFAULT NULL,
    mime_type VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    extension VARCHAR(20) DEFAULT NULL,
    size BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    uploaded_at DATETIME NOT NULL,
    uploader_id BIGINT NOT NULL,
    UNIQUE INDEX UNIQ_4FD8E9C3570EB513 (storage_name),
    INDEX IDX_4FD8E9C316678C77 (uploader_id),
    INDEX idx_media_file_original_name (original_name),
    INDEX idx_media_file_mime_type (mime_type),
    INDEX idx_media_file_type (type),
    INDEX idx_media_file_size (size),
    INDEX idx_media_file_created_at (created_at),
    INDEX idx_media_file_created_at_id (created_at, id),
    INDEX idx_media_file_uploaded_at (uploaded_at),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE media_file_meta (
    id BIGINT AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    value LONGTEXT NOT NULL,
    media_file_id BIGINT NOT NULL,
    INDEX IDX_7B6ECFD5F21CFF25 (media_file_id),
    UNIQUE INDEX uniq_media_file_meta_title (media_file_id, title),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

ALTER TABLE media_file
    ADD CONSTRAINT FK_4FD8E9C316678C77
    FOREIGN KEY (uploader_id) REFERENCES uploader (id) ON DELETE RESTRICT;

ALTER TABLE media_file_meta
    ADD CONSTRAINT FK_7B6ECFD5F21CFF25
    FOREIGN KEY (media_file_id) REFERENCES media_file (id) ON DELETE CASCADE;

CREATE TABLE doctrine_migration_versions (
    version VARCHAR(191) NOT NULL,
    executed_at DATETIME DEFAULT NULL,
    execution_time INT DEFAULT NULL,
    PRIMARY KEY (version)
) DEFAULT CHARACTER SET utf8mb4;

INSERT INTO doctrine_migration_versions (version, executed_at, execution_time)
VALUES ('DoctrineMigrations\\Version20260819205305', NOW(), 0);

SET FOREIGN_KEY_CHECKS = 1;
