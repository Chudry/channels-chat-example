from djangdock.celery import app
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from chat.models import Message

@app.task(acks_late=True, reject_on_worker_lost=True)
def clear_room_messages(group, room):
    """Add args for sample task."""
    Message.objects.filter(room__exact=room).delete()
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(group, {
        'type':    'publish',
        'payload': {
            'type':  'app/fetchNotice',
            'payload': 'Clear process was succeeded.',
        },
    })
    async_to_sync(channel_layer.group_send)(group, {
        'type':    'publish',
        'payload': {
            'type': 'message/initRoom',
            'payload': room,
        },
    })
