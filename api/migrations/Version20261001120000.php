<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261001120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout des moments';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE moment (id INT AUTO_INCREMENT NOT NULL, starts_at DATETIME NOT NULL, label VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_358C88A2989D9B62 (slug), INDEX idx_moment_starts_at (starts_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE moment');
    }
}
