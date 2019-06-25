import os
import base64
import logging
from django import template

register = template.Library()


@register.tag
def getenv(parser, token):
    key  = ''
    args = token.split_contents()
    if len(args) >= 1:
        key = args[1]

    return EnvironStringNode(key)

@register.tag
def getenv64(parser, token):
    key  = ''
    args = token.split_contents()
    if len(args) >= 1:
        key = args[1]

    return EnvironStringNode(key, True)

class EnvironStringNode(template.Node):
    def __init__(self, string, do_base64_encode=False):
        self.string           = string
        self.do_base64_encode = do_base64_encode

    def render(self, context):
        try:
            string = os.environ[self.string]
            if self.do_base64_encode == True:
                return base64.b64encode(string.encode('UTF-8')).decode('UTF-8')
            else:
                return string
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(e)
