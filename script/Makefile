all: types.ts ops.ts utils.ts lex.ts calc.ts
	cat types.ts ops.ts utils.ts lex.ts calc.ts > oktal.ts && tsc oktal.ts

test:
	./test.js

.PHONY: clean
clean:
	rm oktal.ts oktal.js