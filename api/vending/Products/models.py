from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from vending.Customers.models import CustomerGroup

from cinp.orm_django import DjangoCInP as CInP

cinp = CInP( 'Products', '0.1' )

@cinp.model()
class ProductGroup( models.Model ):
  name = models.CharField( max_length=200 )
  time_of_day_start = models.IntegerField( default=0, help_text='0 to dislable time of day enabeling, hour of the day 0-24' )
  time_of_day_end = models.IntegerField( default=0, help_text='Ignored is time_of_day_start is 0, hour of the day 0-24' )
  count_per_day = models.IntegerField( default=0, help_text='0 for unlimited' )
  allowed_user_groups = models.ManyToManyField( CustomerGroup, help_text='blank for everyone' )
  updated = models.DateTimeField( editable=False, auto_now=True )
  created = models.DateTimeField( editable=False, auto_now_add=True )

  @cinp.check_auth()
  @staticmethod
  def checkAuth( user, verb, id_list, action=None ):
    return cinp.basic_auth_check( user, verb, action, ProductGroup )

  def clean( self, *args, **kwargs ):  # TODO: also need to make sure a Structure is in only one complex
    super().clean( *args, **kwargs )
    errors = {}

    if errors:
      raise ValidationError( errors )

  # class Meta:
  #   default_permissions = ()

  def __str__( self ):
    return 'Product Group "{0}"'.format( self.name )


@cinp.model()
class Product( models.Model ):
  name = models.CharField( max_length=200 )
  cost = models.IntegerField( help_text='in howe-bucks' )
  location = models.CharField( max_length=3, unique=True )
  available = models.IntegerField()
  groups = models.ManyToManyField( ProductGroup )
  updated = models.DateTimeField( editable=False, auto_now=True )
  created = models.DateTimeField( editable=False, auto_now_add=True )

  @cinp.action( paramater_type_list=[ 'String' ] )
  def buy( self, user ):
    if self.available < 1:
      raise ValueError( 'Product is Empty' )

    self.available -= 1
    self.save()

  @cinp.check_auth()
  @staticmethod
  def checkAuth( user, verb, id_list, action=None ):
    return cinp.basic_auth_check( user, verb, action, Product )

  def clean( self, *args, **kwargs ):  # TODO: also need to make sure a Structure is in only one complex
    super().clean( *args, **kwargs )
    errors = {}

    if self.cost is not None and self.cost < 0:
      errors[ 'cost' ] = 'Must be at least 0'

    if self.available is not None and self.available < 0:
      errors[ 'available' ] = 'Must be at least 0'

    if errors:
      raise ValidationError( errors )

  # class Meta:
  #   default_permissions = ()

  def __str__( self ):
    return 'Product "{0}"'.format( self.name )
