import base64
from django import template

register = template.Library()

@register.filter
def base64stringify(string):
    return base64.b64encode(string)
