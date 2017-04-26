// utils.ts

function rebaseTokens(tokens, radix) {
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.Number) {
            tokens[i].value = parseInt(tokens[i].value, radix);
        }
    }
    return tokens;
}

function logTokens(tokens) {
    let s: string = '';
    for (var i = 0; i < tokens.length; i++) {
        s += tokens[i].value.toString();
        s += ',';
    }
    console.log(s);
}

// Input validation functions
function isOperation(c) {
    c = String.fromCharCode(c);
    if (list.indexOf(c) > -1) {
        return true;
    }
    return false;
}

function validateBinaryInput(keycode) {
    if (keycode == 0x30 || keycode == 0x31 || isOperation(keycode))
        return true;
    return false;
}

function validateOktalInput(keycode) {
    if ((keycode >= 0x30 && keycode <= 0x37) || isOperation(keycode))
        return true;
    return false;
}

function validateDecimalInput(keycode) {
    if ((keycode >= 0x30 && keycode <= 0x39) || isOperation(keycode))
        return true;
    return false;
}

function validateHexadecimalInput(keycode) {
    var keycode = keycode.toLowerCase();
    if ((keycode >= 0x30 && keycode <= 0x39) || (keycode >= 0x61 && keycode <= 0x66) || isOperation(keycode))
        return true;
    return false;
}