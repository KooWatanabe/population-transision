export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash
bundle = dist/bundle.js

yarn:
	yarn

start:
	cp .env.local .env
	yarn build
	yarn start
