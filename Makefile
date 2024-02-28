all:

start-api:
	./api/lib/api_server/api_server.py

start-nate:
	cd GUI-Nate ; python3 -m http.server 9000

reset-database:
	rm api/vending.sqlite || true
	./api/lib/util/manage.py migrate
	./api/lib/setup/setupWizard --superuser-username=root --superuser-password=root
	./api/lib/util/manage.py loaddata api/test_data.json

.PHONY:: all start-api start-date reset-database
