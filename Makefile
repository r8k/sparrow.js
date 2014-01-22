REPORTER = spec
MODS = should
UI = bdd

test:
	mocha --reporter $(REPORTER) \
		--require $(MODS) \
		--ui $(UI)

.PHONY: test