FROM php:5.6.33-apache
COPY ./apache2.conf /etc/apache2/apache2.conf
COPY ./php-timezone.ini /usr/local/etc/php/conf.d/timezone.ini
COPY . /var/www/html

RUN docker-php-ext-install mysqli
RUN apt-get update && apt-get install -y \
    libmagickwand-dev --no-install-recommends \
    && pecl install imagick \
	&& docker-php-ext-enable imagick
