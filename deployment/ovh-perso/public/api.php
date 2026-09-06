<?php

use App\Kernel;

$projectDir = dirname(__DIR__).'/app';
$uploadDir = __DIR__.'/uploads';

$_SERVER['UPLOAD_DIR'] ??= $uploadDir;
$_ENV['UPLOAD_DIR'] ??= $_SERVER['UPLOAD_DIR'];

require_once $projectDir.'/vendor/autoload_runtime.php';

return static function (array $context): Kernel {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
