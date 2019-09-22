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
# $ celery -A django_project worker --concurrency=1 -l debug    # Attach mode.
# $ celery -A django_project worker --detach --pidfile="/path"  # Detach mode.

CMD celery -A djangdock worker -l debug
