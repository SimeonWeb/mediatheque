<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260820000200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout du chemin de la variante full des images';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file ADD full_relative_path VARCHAR(500) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_file DROP full_relative_path');
    }
}
