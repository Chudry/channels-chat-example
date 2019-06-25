import json
from django.core import serializers
from django.utils.text import re_camel_case
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message, User
from chat.tasks import clear_room_messages

class ChatConsumer(AsyncWebsocketConsumer):
    """ChatConsumer Controller class as WebSocket API."""

    async def connect(self):
        """Handle opening WebSocket."""
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
        else:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % self.room_name
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        """Handle closing WebSocket."""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle event of received message."""
        action      = json.loads(text_data)
        action_type = re_camel_case.sub(r'_\1', action['type']).strip('_').lower().split('/')[-1]
        await self.channel_layer.send(self.channel_name, {
            'type':    action_type,        # Specify event type using callback.
            'payload': action['payload'],  # Set value for using callback.
        })

    async def publish(self, event):
        """Broadcast to channel group clients on WebSocket."""
        await self.send(text_data=json.dumps({
            'action': event['payload']['action'],
            'payload': event['payload']['payload'],
        }))

    async def init_room(self, event):
        """Send exists room messages to channel client on WebSocket."""
        messages = Message.objects.filter(room__exact=event['payload'])
        await self.send(text_data=json.dumps({
            'action': 'message/fetchMessages',
            'payload': json.loads(serializers.serialize('json', messages)),
        }))
        users = User.objects.all()
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'publish',
            'payload': {
                'action': 'user/fetchUsers',
                'payload': json.loads(serializers.serialize('json', users, fields=('username'))),
            },
        })

    async def send_message(self, event):
        """Generate & validate received sending message before publish."""
        message = Message(
            id      = event['payload']['pk'],
            text    = event['payload']['fields']['text'],
            room    = event['payload']['fields']['room'],
            user_id = self.user.id,
        )
        message.save()
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'publish',
            'payload': {
                'action': 'message/receiveMessage',
                'payload': json.loads(serializers.serialize('json', [message])),
            },
        })

    async def send_clear(self, event):
        """Queueing task of clear all message history in this room by celery."""
        clear_room_messages.apply_async(
            (self.room_group_name, event['payload']),
            countdown=5,  # sec.
            expires=60
        )
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'publish',
            'payload': {
                'action':  'app/fetchNotice',
                'payload': 'Please wait 5sec, room clearing requested by ' + self.user.username,
            },
        })
