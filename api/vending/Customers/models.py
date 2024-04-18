from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from cinp.orm_django import DjangoCInP as CInP

cinp = CInP( 'Customers', '0.1' )


@cinp.model()
class CustomerGroup( models.Model ):
  name = models.CharField( max_length=200 )
  updated = models.DateTimeField( editable=False, auto_now=True )
  created = models.DateTimeField( editable=False, auto_now_add=True )

  @cinp.check_auth()
  @staticmethod
  def checkAuth( user, verb, id_list, action=None ):
    return cinp.basic_auth_check( user, verb, action, CustomerGroup )

  def clean( self, *args, **kwargs ):  # TODO: also need to make sure a Structure is in only one complex
    super().clean( *args, **kwargs )
    errors = {}

    if errors:
      raise ValidationError( errors )

  # class Meta:
  #   default_permissions = ()

  def __str__( self ):
    return 'CustomerGroup "{0}"'.format( self.name )

# allow negative ballence, alert partent to assign more chores
# optional pin
@cinp.model()
class Customer( models.Model ):
  name = models.CharField( max_length=200 )
  balance = models.IntegerField( editable=False, default=0 )
  groups = models.ManyToManyField( CustomerGroup )
  updated = models.DateTimeField( editable=False, auto_now=True )
  created = models.DateTimeField( editable=False, auto_now_add=True )

  @cinp.action( paramater_type_list=[ 'Integer' ] )
  def addFunds( self, amount ):
    self.balance += amount
    self.full_clean()
    self.save()

  @cinp.check_auth()
  @staticmethod
  def checkAuth( user, verb, id_list, action=None ):
    return cinp.basic_auth_check( user, verb, action, Customer )

  def clean( self, *args, **kwargs ):  # TODO: also need to make sure a Structure is in only one complex
    super().clean( *args, **kwargs )
    errors = {}

    if errors:
      raise ValidationError( errors )

  # class Meta:
  #   default_permissions = ()

  def __str__( self ):
    return 'Customer "{0}"'.format( self.name )