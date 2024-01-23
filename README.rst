Vending machine for family
==========================

Software for making a custom vending machine that uses face reconition

Project done for a Project at SUU Success Code Club

Made By::

  Nate Washburn: NateTheGreat1230
  Hyrum Schoonmaker: yoshis20apples
  Brighton Dutson:
  Jake: UserJK8
  Website: https://www.thecalculatorguy.net/Assignments/apewrite/Duck/duck.html


Setting up api server for development
-------------------------------------

First time setup
~~~~~~~~~~~~~~~~

::

  pip3 install cinp
  cd api
  pip3 install -e .
  ./lib/util/manage.py migrate
  ./lib/setup/setupWizard

Rebuild database
~~~~~~~~~~~~~~~~

::

  rm vending.sqlite
  ./lib/util/manage.py migrate
  ./lib/setup/setupWizard


Starting the API server
~~~~~~~~~~~~~~~~~~~~~~~

::

  ./lib/api_server/api_server.py


Build db migrations
~~~~~~~~~~~~~~~~~~~

::

  ./lib/util/manage.py makemigrations
