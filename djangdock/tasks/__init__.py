"""Celery tasks."""
from ..celery import app


@app.task()
def add_numbers(a, b):
    """Add args for sample task."""
    print('Request: {}'.format(a + b))
    return a + b
