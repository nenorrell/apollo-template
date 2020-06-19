NODE=14
IMAGE=apollo/api
UNIT_TEST := "tests/unit/**/*.test.js"
INTEGRATION_TEST := "tests/integration/**/*.test.js"

launch: down install network up

down:
	docker-compose down

up:
	docker-compose up

build:
	docker build --no-cache -t $(IMAGE):latest .

network:
	./bin/network.sh

install:
	docker run -i --rm --name install-apollo-api -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm install ${PCKG}

db-migrate:
	node node_modules/db-migrate/bin/db-migrate create ${NAME}

test: install unit_test

unit_test: 
	docker run -i --rm -p "9199:9200" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} node_modules/.bin/nyc node_modules/.bin/_mocha $(UNIT_TEST) -R spec --color --verbose