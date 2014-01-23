REPORTER = spec
MODS = should
UI = bdd

test:
	./node_modules/.bin/mocha --reporter $(REPORTER) \
		--require $(MODS) \
		--ui $(UI)

.PHONY: test
