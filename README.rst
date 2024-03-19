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
  apt install python3-dateutil python3-django python3-gunicorn python3-werkzeug
  cd api
  pip3 install -e .
  cd vending
  ln -s ../vending.conf.sample settings.py
  cd ..
  cd ..
  make reset-database
  cd admin
  npm install
  cd ..

Rebuild database
~~~~~~~~~~~~~~~~

NOTE: you will need to stop the api server while you do this

::

  make reset-database


Starting the API server
~~~~~~~~~~~~~~~~~~~~~~~

use ctl-c to shutdown the server

::

  make start-api

Starting Admin Site
~~~~~~~~~~~~~~~~~~~
First start the API server, then in a seperate terminal

::

  make start-admin


Build db migrations
~~~~~~~~~~~~~~~~~~~

::

  ./lib/util/manage.py makemigrations
