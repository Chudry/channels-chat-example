channels-chat-example
===============

> posted: 2019.06.25
> author: yano3@alhino.jp

## OVERVIEW
> https://github.com/yano3nora/channels-chat-example

### Composition.
- back-end
  - nginx 1.15.6
  - postgres 11
  - redis 5.0.3
  - python 3.7
    - django 2.2.1
      - django/channels
      - django-celery-results
  - uwsgi
  - uvicorn
  - celery
- front-end
  - webpack 4
  - babel 7
  - react 16.8
    - react-redux 7.1
  - redux 4
    - redux-saga 1
    - redux-starter-kit 0.5
  - uikit 3

### Containers.
```
[redis]
  /data
[db]
  /var
    /lib
      /postgresql
        /data
[app]
  /app
    /static
    /djangdock (project)
    /chat      (app)
[web]
  /.credentials
  /var/log/nginx
  /etc
    /nginx
      /conf.d
        default.conf
      /uwsgi_params
  /static
```


------


## BUILD
> In the first time of build.

```sh
# Set up env.
$ cp .env.development .env
$ vi .env

# If building onto Linux, execute this.
$ sudo chown -R $USER:$USER .

# Build containers.
$ docker-compose build

# Migrations.
$ docker-compose run --rm app python manage.py migrate

# Install & build front-end sources by webpack.
$ npm ci
$ npm run build

# Deploy containers.
$ docker-compose up
```


------


## Deployment
```sh
$ docker-compose up     # Attach mode.
$ docker-compose up -d  # Detach mode.

# Accessing to docker-machine IP via 80 or 443 port by your browser.
# Retry after one moment please if you received 5xx response.

# Watch mode.
# Accessing to htts://localhost:3000
# Beforehand allow self-certificates on 192.168.99.100.
$ npm run watch
```

### Commands
```sh
# Launch bash.
$ docker-compose exec app bash

# Shutdown containers.
$ docker-compose down

# Re-setup Database.
$ docker-compose run --rm app python manage.py reset_db --noinput
$ docker-compose run --rm app python manage.py migrate

# Clear log / cache.
$ docker-compose exec app bash
$ python manage.py shell
> from django.core.cache import cache
> cache.clear()

# Add Packages.
$ vi .docker/app/requirements.txt
$ docker-compose build
```
