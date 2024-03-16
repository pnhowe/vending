from cinp.client import CInP

class API:
  def __init__( self ):
    self.client = CInP( 'http://localhost:8888', '/api/v1/' )
    token = self.client.call( '/api/v1/Auth/User(login)', { 'username': 'ui', 'password': 'ui' } )
    self.client.setAuth( 'ui', token )

  def getProducts( self ):
    return self.client.getFilteredObjects( '/api/v1/Products/Product' )

  def getUser( self ):
    return 'Jimmy'

  def getBalance( self ):
    return 12

  def buy( self, product ): # product looks like "'/api/v1/Products/Product:1:'"
    return self.client.call( product + '(buy)' )