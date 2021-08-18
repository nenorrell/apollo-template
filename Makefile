NODE=14
IMAGE=apollo/api
UNIT_TEST := "tests/**/*.test.ts"
INTEGRATION_TEST := "tests/**/*.int-test.ts"
RUN_TESTS_WITH_LOGS=false
ENVIRONMENT=local
LOCAL_ENV=local
GIT_HASH=$(shell git rev-parse --short HEAD)
VERSION=latest

clean:
	./bin/clean.sh

launch: clean version down install network up

down:
	docker-compose down

up:
	docker-compose up

network:
	./bin/network.sh

install:
	docker run -i --rm --name install-apollo-api -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm install ${PCKG}

test: install version unit_test integration-test

unit_test:
	docker run -i --rm -p "9199:9200" \
	-e JWT_PRIVATE="Test-private-key" \
	-v `pwd`:/usr/src/app \
	-w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
	--require ts-node/register \
	--require ./tests/testHelper.js \
	--require @babel/polyfill \
	$(UNIT_TEST) -R spec --color --verbose

integration-test: test-network-up integration-test-run

integration-test-run:
	docker run -i --rm -p "9198:1337" \
	--network=apollo-api_test \
	-e NODE_ENV=test \
	-e RUN_TESTS_WITH_LOGS=${RUN_TESTS_WITH_LOGS} \
	-e ENV="local" \
	-e JWT_PRIVATE="Test-private-key" \
	-v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
	--require ts-node/register \
	--require ./tests/testHelper.js \
	--require @babel/polyfill \
	$(INTEGRATION_TEST) -R spec --color --verbose --exit

compile:
	docker run -i --rm --name compile-apollo-api -e NODE_ENV=production -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm run webpack-prod

version:
	echo '{"version":"${GIT_HASH}"}' > ./src/api/version/BUILD-VERSION.json

push:
	docker push $(IMAGE):$(GIT_HASH)
	docker push $(IMAGE):latest

push-hotifix:
	docker push $(IMAGE):$(GIT_HASH)

build_image: compile
	docker build --no-cache -t $(IMAGE):$(GIT_HASH) .

tag: install version build_image
	docker tag $(IMAGE):$(GIT_HASH) $(IMAGE):latest

test-network-up:
	docker network create apollo-api_test || true

test-network-down:
	docker network rm apollo-api_test