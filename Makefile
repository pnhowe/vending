all:

start-api:
	./api/lib/api_server/api_server.py

start-nate:
	cd GUI-Nate ; python3 -m http.server 9000

start-admin:
	cd admin ; npm start

reset-database:
	rm api/vending.sqlite || true
	./api/lib/util/manage.py migrate
	./api/lib/setup/setupWizard --superuser-username=root --superuser-password=root
	./api/lib/util/manage.py loaddata api/test_data.json

update-autogen-headers:
	../cinp/utils/cinp-codegen -l ts -s Vending http://localhost:8888/api/v1/ -d admin/src/Components/API

.PHONY:: all start-api start-date reset-database
