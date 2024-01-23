import os
from django.conf import settings

from cinp.server_werkzeug import WerkzeugServer

from vending.Auth.models import getUser

def get_app( debug ):
  extras = {}
  if settings.UI_HOSTNAME is not None:
    extras[ 'cors_allow_origin' ] = settings.UI_HOSTNAME

  app = WerkzeugServer( root_path='/api/v1/', root_version='1.0', debug=debug, get_user=getUser, auth_header_list=[ 'AUTH-TOKEN', 'AUTH-ID' ], auth_cookie_list=[ 'SESSION' ], debug_dump_location=settings.DEBUG_DUMP_LOCATION, **extras )

  app.registerNamespace( '/', 'vending.Auth' )
  app.registerNamespace( '/', 'vending.Customers' )
  app.registerNamespace( '/', 'vending.Products' )
  app.validate()

  return app
