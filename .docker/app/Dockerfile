FROM python:3.7
ENV  PYTHONUNBUFFERED 1

# Set up project root.
RUN     mkdir app
WORKDIR /app

# Install packages before copy sources, for building cache.
COPY ./.docker/app/requirements.txt /app/.docker/app/requirements.txt
RUN  pip install -r /app/.docker/app/requirements.txt

# Copy source codes.
COPY . /app

# Run application servers.
#
# [celery] Job worker
# $ celery -A django_project worker --concurrency=1             # Attach mode.
# $ celery -A django_project worker --detach --pidfile="/path"  # Detach mode.
#
# [uwsgi] HTTP
# $ uwsgi --ini django.ini --master                      # Attach mode.
# $ uwsgi --ini django.ini --master -d /path/to/logfile  # Detach mode.
#
# [uvicorn] WebSocket
# $ uvicorn django_project.asgi:application --reload                      # Hot reload for dev.
# $ uvicorn django_project.asgi:application --host 127.0.0.1 --port 8000  # Attach mode.
# $ uvicorn django_project.asgi:application --uds /tmp/uvicorn.sock       # Using unix socket.
# $ uvicorn django_project.asgi:application --ssl-keyfile hoge.key --ssl-certfile hoge.pem  # SSL.

ARG CREDENTIAL
RUN mkdir -p /root/run/celery && rm -rf /root/run/celery/*
CMD celery -A djangdock worker --detach --pidfile="/root/run/celery/%n.pid" && \
    uwsgi --ini /app/.docker/app/django.ini --master -d /dev/stdout && \
    uvicorn djangdock.asgi:application --host 0.0.0.0 --port 443 --reload --proxy-headers --ssl-keyfile .credentials/${CREDENTIAL}.key --ssl-certfile .credentials/${CREDENTIAL}.crt
