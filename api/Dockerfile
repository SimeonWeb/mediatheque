FROM php:8.4-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libjpeg62-turbo-dev libpng-dev libwebp-dev unzip \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install exif gd pdo_mysql \
    && a2enmod rewrite proxy proxy_http proxy_wstunnel \
    && printf 'upload_max_filesize=10M\npost_max_size=11M\n' > /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf

RUN printf 'ServerName localhost\n' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

WORKDIR /var/www/html
