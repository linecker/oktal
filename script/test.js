#!/usr/bin/env nodejs

// The unit tests require nodejs and unit.js to be installed.

var test = require('unit.js');
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext(__dirname+"/oktal.js");

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
// binary
test.assert(validateBinaryInput("<".charCodeAt(0)));
test.assert(validateBinaryInput("0".charCodeAt(0)));
test.assert(validateBinaryInput("1".charCodeAt(0)));
test.assert(!validateBinaryInput("2".charCodeAt(0)));
test.assert(!validateBinaryInput("a".charCodeAt(0)));
test.assert(!validateBinaryInput("€".charCodeAt(0)));

// oktal
test.assert(validateOktalInput("7".charCodeAt(0)));
test.assert(!validateOktalInput("8".charCodeAt(0)));

// decimal
test.assert(validateDecimalInput("9".charCodeAt(0)));
test.assert(!validateDecimalInput("a".charCodeAt(0)));

// hexadecimal
test.assert(validateHexadecimalInput("a".charCodeAt(0)));
test.assert(validateHexadecimalInput("f".charCodeAt(0)));
test.assert(!validateHexadecimalInput("g".charCodeAt(0)));

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
test.assert(list.indexOf('*') > -1);
test.assert.equal(functions['+'](1,1), 2);

// ----------------------------------------------------------------------------
// Testing types.ts
// ----------------------------------------------------------------------------
test.assert.deepEqual(new Token(TokenType.Number, "100"),
    { type: TokenType.Number, value: '100'});

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
lx = new Lexer("1++");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: TokenType.Number, value: 1 },
    { type: TokenType.Operator, value: '+' },
    { type: TokenType.Operator, value: '+' }]);

lx = new Lexer("1+123456789");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: TokenType.Number, value: 1 },
    { type: TokenType.Operator, value: '+' },
    { type: TokenType.Number, value: 123456789 }]);

lx = new Lexer("0");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: TokenType.Number, value: 0 }]);

/*lx = new Lexer("+1+0b0<<0x10&0100");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: TokenType.Operator, value: '+' },
    { type: TokenType.Number, value: 1 },
    { type: TokenType.Operator, value: '+' },
    { type: TokenType.Number, value: 0b0 },
    { type: TokenType.Operator, value: '<<' },
    { type: TokenType.Number, value: 0x10 },
    { type: TokenType.Operator, value: '&' },
    { type: TokenType.Number, value: 0100 }]);
    */

lx = new Lexer("fail");
test.assert.equal(lx.lex(), false);

// ----------------------------------------------------------------------------
// Testing calc.ts
// ----------------------------------------------------------------------------
//c = new calc.Calculation(Array<types.Token>);
//test.assert.equal(c.calculate)

/*
    test("0", "0");
    test("0+0", "0");
    test("(0+0)", "0");
    test("(1&1)", "1");
    test("!(1&1)", "0");
    test("2+1", "3");
    test("2+1", "3");
    test("2+1", "3");
    test("2+1", "3");
    test("1<<1", "2");
    test("(1<<1)", "2");
    test("(1<<(1))", "2");
}
*/
