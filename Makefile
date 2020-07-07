NODE=14
IMAGE=apollo/api
UNIT_TEST := "tests/**/*.test.ts"
INTEGRATION_TEST := "tests/**/*.int-test.ts"
RUN_TESTS_WITH_LOGS=false

clean:
	./bin/clean.sh

launch: clean down install network up

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

integration-test: test-db-down compile test-network-up test-db-up integration-test-run test-db-down

integration-test-run:
	docker run -i -v `pwd`:/usr/src/app -w /usr/src/app \
	--network=apollo-api_test \
	--entrypoint="./bin/wait-for-it.sh" \
	node:${NODE} apollo-test-db:3336 \
	--timeout=60 -- echo "Test DB available"
	
	docker exec -i `docker ps \
	--format "{{.Names}}" | grep apollo-test-db` \
	mysql -uroot -ppassword -P 3336 \
	-e "drop database if exists test;create database test;"

	docker run -i --rm -p "9198:1337" \
	--network=apollo-api_test \
	-e NODE_ENV=test \
	-e RUN_TESTS_WITH_LOGS=${RUN_TESTS_WITH_LOGS} \
	-e DB="test" \
	-e DB_PORT="3336" \
	-e DB_HOST=apollo-test-db \
    -e DB_USER="root" \
	-e DB_PASSWORD="password" \
    -e ENV="local" \
    -e JWT_PRIVATE="aGr5kq@TQ99ufybsbpvPQ^eK%x9BZbb2U9yF@AIbtmf4I*&B0X76427asdu" \
	-v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
	--require ts-node/register \
	--require ./tests/testHelper.js \
	--require @babel/polyfill \
	./build/build.js $(INTEGRATION_TEST) -R spec --color --verbose --exit

compile:
	docker run -i --rm --name compile-apollo-api -e NODE_ENV=test -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm run webpack
	
test-network-up:
	docker network create apollo-api_test || true

test-db-down:
	docker-compose -f docker-compose.test.yml down

test-db-up:
	docker-compose -f docker-compose.test.yml up -d

test-network-down:
	docker network rm apollo-api_test