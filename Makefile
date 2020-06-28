NODE=14
IMAGE=apollo/api
TEST_IMAGE=apollo/test
UNIT_TEST := "tests/**/*.test.ts"
INTEGRATION_TEST := "tests/**/*.int-test.ts"
RUN_TESTS_WITH_LOGS=false

launch: down install network up

down:
	docker-compose down

up:
	docker-compose up

tag:
	docker build --no-cache -t $(IMAGE):latest .

run-prod:
	docker run -d -p 80:1337 $(IMAGE)

network:
	./bin/network.sh

install:
	docker run -i --rm --name install-apollo-api -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm install ${PCKG}

db-migrate:
	node node_modules/db-migrate/bin/db-migrate create ${NAME}

test: install unit_test integration-test

unit_test:
	docker run -i --rm -p "9199:9200" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
	--require ts-node/register \
	--require ./tests/testHelper.js \
	--require @babel/polyfill \
	$(UNIT_TEST) -R spec --color --verbose

integration-test:
	docker run -i --rm -p "9198:1337" \
	-e NODE_ENV=test \
	-e RUN_TESTS_WITH_LOGS=${RUN_TESTS_WITH_LOGS} \
	-v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
	--require ts-node/register \
	--require ./tests/testHelper.js \
	--require @babel/polyfill \
	./build/build.js $(INTEGRATION_TEST) -R spec --color --verbose --exit