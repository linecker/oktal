#!/usr/bin/env nodejs

// The unit tests require nodejs and unit.js to be installed.

var test = require('unit.js');
var fs = require('fs');

function include(fileName) {
  console.log('Loading file: ' + fileName);
  var ev = require(fileName);
  for (var prop in ev) {
    global[prop] = ev[prop];
  }
}

include('oktal.js');

//var oktal = require('./oktal');

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
// binary
test.assert(validateBinaryInput("<".charCodeAt(0)));
test.assert(oktal.validateBinaryInput("0".charCodeAt(0)));
test.assert(oktal.validateBinaryInput("1".charCodeAt(0)));
test.assert(!oktal.validateBinaryInput("2".charCodeAt(0)));
test.assert(!oktal.validateBinaryInput("a".charCodeAt(0)));
test.assert(!oktal.validateBinaryInput("€".charCodeAt(0)));

// oktal
test.assert(oktal.validateOktalInput("7".charCodeAt(0)));
test.assert(!oktal.validateOktalInput("8".charCodeAt(0)));

// decimal
test.assert(oktal.validateDecimalInput("9".charCodeAt(0)));
test.assert(!oktal.validateDecimalInput("a".charCodeAt(0)));

// hexadecimal
test.assert(oktal.validateHexadecimalInput("a".charCodeAt(0)));
test.assert(oktal.validateHexadecimalInput("f".charCodeAt(0)));
test.assert(!oktal.validateHexadecimalInput("g".charCodeAt(0)));

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
test.assert(oktal.list.indexOf('*') > -1);
test.assert.equal(oktal.functions['+'](1,1), 2);

// ----------------------------------------------------------------------------
// Testing types.ts
// ----------------------------------------------------------------------------
test.assert.deepEqual(new oktal.Token(oktal.TokenType.Number, "100"),
    { type: oktal.TokenType.Number, value: '100'});

// ----------------------------------------------------------------------------
// Testing ts
// ----------------------------------------------------------------------------
lx = new oktal.Lexer("1++");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: oktal.TokenType.Number, value: 1 },
    { type: oktal.TokenType.Operator, value: '+' },
    { type: oktal.TokenType.Operator, value: '+' }]);

lx = new oktal.Lexer("1+123456789");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: oktal.TokenType.Number, value: 1 },
    { type: oktal.TokenType.Operator, value: '+' },
    { type: oktal.TokenType.Number, value: 123456789 }]);

lx = new oktal.Lexer("0");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: oktal.TokenType.Number, value: 0 }]);

lx = new oktal.Lexer("+1+0b0<<0x10&0100");
test.assert.equal(lx.lex(), true);
test.assert.deepEqual(lx.getResult(),[
    { type: oktal.TokenType.Operator, value: '+' },
    { type: oktal.TokenType.Number, value: 1 },
    { type: oktal.TokenType.Operator, value: '+' },
    { type: oktal.TokenType.Number, value: 0b0 },
    { type: oktal.TokenType.Operator, value: '<<' },
    { type: oktal.TokenType.Number, value: 0x10 },
    { type: oktal.TokenType.Operator, value: '&' },
    { type: oktal.TokenType.Number, value: 0100 }]);

lx = new oktal.Lexer("fail");
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
