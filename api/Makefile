VERSION := $(shell head -n 1 debian/changelog | awk '{match( $$0, /\(.+?\)/); print substr( $$0, RSTART+1, RLENGTH-2 ) }' | cut -d- -f1 )

all:
	./setup.py build

install:
	mkdir -p $(DESTDIR)/var/www/vending/api
	mkdir -p $(DESTDIR)/etc/apache2/sites-available
	mkdir -p $(DESTDIR)/etc/vending
	mkdir -p $(DESTDIR)/usr/lib/vending/cron
	mkdir -p $(DESTDIR)/usr/lib/vending/util
	mkdir -p $(DESTDIR)/usr/lib/vending/setup

	install -m 644 api/vending.wsgi $(DESTDIR)/var/www/vending/api
	install -m 644 apache.conf $(DESTDIR)/etc/apache2/sites-available/vending.conf
	install -m 644 vending.conf.sample $(DESTDIR)/etc
	install -m 755 lib/cron/* $(DESTDIR)/usr/lib/vending/cron
	install -m 755 lib/util/* $(DESTDIR)/usr/lib/vending/util
	install -m 755 lib/setup/* $(DESTDIR)/usr/lib/vending/setup

	./setup.py install --root=$(DESTDIR) --install-purelib=/usr/lib/python3/dist-packages/ --prefix=/usr --no-compile -O0

version:
	echo $(VERSION)

clean:
	./setup.py clean || true
	$(RM) -r build
	$(RM) dpkg
	$(RM) -r htmlcov
	dh_clean || true
	find -name *.pyc -delete
	find -name __pycache__ -delete

dist-clean: clean

.PHONY:: all install version clean dist-clean

test-blueprints:
	echo ubuntu-jammy-base

test-requires:
	echo flake8 python3-pip python3-django python3-psycopg2 python3-pymongo python3-parsimonious python3-jinja2 python3-pytest python3-pytest-cov python3-pytest-django python3-pytest-mock python3-pytest-timeout postgresql mongodb

test-setup:
	su postgres -c "echo \"CREATE ROLE vending WITH PASSWORD 'vending' NOSUPERUSER NOCREATEROLE CREATEDB LOGIN;\" | psql"
	pip3 install -e .
	cp vending.conf.sample vending/settings.py
	touch test-setup

lint:
	flake8 --ignore=E501,E201,E202,E111,E126,E114,E402,W503 --statistics --exclude=migrations,build .

test:
	py.test-3 -x --cov=vending --cov-report html --cov-report term --ds=vending.settings -vv vending

.PHONY:: test-blueprints test-requires lint test

dpkg-blueprints:
	echo ubuntu-jammy-base

dpkg-requires:
	echo dpkg-dev debhelper python3-dev python3-setuptools nodejs npm dh-python

dpkg-setup:
	dpkg-buildpackage -b -us -uc
	touch dpkg

dpkg-file:
	echo $(shell ls ../vending_*.deb):jammy

.PHONY:: dpkg-blueprints dpkg-requires dpkg dpkg-file
