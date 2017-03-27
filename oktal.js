//
var input = "";
var pos = 0;
var output = "";
var error = false;
var outputRadix = 10;

// Token Types.
const eNumber = 0;
const eOperator = 1;

// A token consists of type and value.
var tokens = [];
var lexed = [];

var opList = ['~','!','<<','>>','&','^','|','*','/','+','-','%','(',')','=','<','>'];

var opFunctions = {
    '+'  : function(a, b) { return a + b },
    '-'  : function(a, b) { return a - b },
    '*'  : function(a, b) { return a * b },
    '%'  : function(a, b) { return a % b },
    '/'  : function(a, b) { return a / b },
    '<<' : function(a, b) { return a << b },
    '>>' : function(a, b) { return a >> b },
    '&'  : function(a, b) { return a & b },
    '|'  : function(a, b) { return a | b },
    '^'  : function(a, b) { return a ^ b },
    '='  : function(a,b)  { return a == b },
    '~'  : function(a) { return ~a },
    '!'  : function(a) { return ~a }

};

function debugLog(s) {
    return;
    //console.log(s);
}

function isNumber(c) {
    if (c >= '0' && c <= '9')
        return true;
    return false;
}

function isHexNumber(c) {
    if ((c >= '0' && c <= '9') ||
        (c >= 'a' && c <= 'f') ||
        (c >= 'A' && c <= 'F'))
        return true;
    return false;
}

function ws() {
    var c = input[pos];
    if (c == ' ' || c == '  ')
        return true;
    return false;
}

// Check if are at the beginning of an operator and consume it if possible.
function op() {

    if (opList.indexOf(input[pos]) > -1) {
        var op = input[pos];
        if (op == '<' && pos + 1 < input.length && input[pos+1] == '<') {
            op = '<<';
            pos++;
        } else if (op == '>' && pos + 1 < input.length && input[pos+1] == '>') {
            op = '>>';
            pos++;
        }
        tokens.push({type:eOperator,value:op});
        return true;
    }
    return false;
}

// Check if we are at the beginning of a number and consume it if possible.
function num() {
    var c = input[pos];
    if (!isNumber(c))
        return false;

    var radix = 10;
    if (input[pos] == '0' && pos + 1 < input.length) {
        c = input[++pos];
        if (c == 'x' || c == 'X') {
            radix = 16;
            pos++;
        }
        else if (c == 'b' || c == 'B') {
            radix = 2;
            pos++;
        }
        else {
            radix = 8;
            pos--;
        }
    }

    var start = pos;
    for (; pos < input.length; pos++) {
        if(!isHexNumber(input[pos])) {
            pos--;
            break;
        }
    }
    var whole = input.substring(start, pos+1);
    var x = parseInt(whole, radix);
    if (isNaN(x)) {
        debugLog("NaN");
        error = true;
        return true;
    }
    tokens.push({type:eNumber,value:x})
    return true;
}

// Split the input string into a list of tokens <type,value>.
function lex() {
    for (pos = 0; pos < input.length && !error; pos++) {
        var c = input[pos];
        if (!op() && !num() && !ws()) {
            error = true;
            return;
        }
    }
}

function A(start, end) {
    if (tokens[start].type != eNumber)
        return false;
    return true;
}

function xA(start, end) {
    if (tokens[start].type != eOperator || tokens[start+1].type != eNumber)
        return false;
    var result = opFunctions[tokens[start].value](tokens[start+1].value);
    tokens.splice(start, 2, {type:eNumber,value:result});
    debugLog("Found xB expression, result = " + result);
    return true;
}

function AxB(start, end) {
    if (tokens[start].type != eNumber || tokens[start+1].type != eOperator || tokens[start+2].type != eNumber)
        return false;
    var result = opFunctions[tokens[start+1].value](tokens[start].value, tokens[start+2].value);
    tokens.splice(start, 3, {type:eNumber,value:result});
    debugLog("Found AxB expression, result = " + result);
    return true;
}

function AxBx(start, end) {
    debugLog("Found AxBx expression");
    // Search for operators within the tokens. Precedence significant!
    var op = undefined;
    var i = start;
    for (var j = 0; j < opList.length; j++) {
        for(i = 0; i < end; i++) {
            if (tokens[i].type == eOperator && tokens[i].value == opList[j]) {
                op = opList[j];
                break;
            }
        }
        if (op !== undefined) {
            break;
        }
    }
    if (op == undefined) {
        return false;
    } else {
        var result = opFunctions[op](tokens[i-1].value, tokens[i+1].value);
        tokens.splice(i-1, 3, {type:eNumber,value:result});
    }
    return true;
}

// Evaluate an expression that contains no '(' ')'
function evaluateInner(start, end) {
    var len = end - start + 1;

    /*
    var xxx = tokens.slice(start, end+1);
    var yyy = "";
    for (var i = 0; i < xxx.length; i++) {
        yyy += xxx[i].value + " ";
    }
    debugLog("start = " + start + " end = " + end + " len = " + len + " -> " + yyy);
    */

    if (len == 1) {
        return A(start, end);
    } else if (len == 2) {
        return xA(start, end);
    } else if (len == 3) {
        return AxB(start, end);
    } else {
        return AxBx(start, end);
    }
}

// Find the innnermost expression and evaluate it.
function evaluate() {

    // Find the innermost ( ) expression.
    var i = 0, j = 0, brace = 0;
    for (; i < tokens.length; i++)  {
        if (tokens[i].type == eOperator && tokens[i].value == ')') {
            brace++;
            break;
        }
    }
    if (i != tokens.length) { // if found ')'
        for (j = i; j >= 0; j--) {
            if (tokens[j].type == eOperator && tokens[j].value == '(') {
                brace++;
                break;
            }
        }
    }

    //debugLog("Brace = " + brace + " j = " + j + " i = " + i );

    if (brace == 0) {
        if (evaluateInner(0, tokens.length - 1) == false) {
            error = true;
            return;
        }
    } else if (brace == 1) {
        error = true;
        return;
    } else if (brace == 2) {
        tokens.splice(j, 1);
        tokens.splice(i-1, 1);
        i-=2;
        //debugLog("Brace = " + brace + " j = " + j + " i = " + i );
        if (evaluateInner(j, i) == false) {
            error = true;
            return;
        }
    }

}

function log_tokens(desc) {
    var str = desc + " tokens: ";
    for (var i = 0; i < tokens.length; i++) {
        str += tokens[i].value;
        str += ' ';
    }
    debugLog(str);
}

function log_lexed(desc) {
    var str = desc + " lexed: ";
    for (var i = 0; i < lexed.length; i++) {
        str += lexed[i].value;
        str += ' ';
    }
    debugLog(str);
}

function rebaseTokens(radix) {
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type == eNumber) {
            tokens[i].value = parseInt(tokens[i].value, radix);
        }
    }
}

function calculate(inp, radix) {
    // reset globals
    error = false;
    tokens = lexed = [];
    output = "";
    pos = 0;

    input = inp;
    if (input.length == 0)
        return undefined;

    // lex
    lex();
    log_tokens("lexer");
    rebaseTokens(radix);
    if (error)
        return undefined;
    lexed = tokens.slice();

    // calculate
    for(var safe = 32; tokens.length > 1 && safe > 0 && error == false ; safe--) {
        evaluate();
        log_tokens("evaluation [" + (32-safe) + "]");
    }
    output = tokens[0].value;

    return {
        lexResult: lexed,
        calcResult: output
    };
}

if (typeof exports === 'object') {
    module.exports.calculate = calculate;
}


