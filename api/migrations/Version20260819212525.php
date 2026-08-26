<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260819212525 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout du chemin de miniature sur les fichiers';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file ADD thumbnail_relative_path VARCHAR(500) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file DROP thumbnail_relative_path');
    }
}
