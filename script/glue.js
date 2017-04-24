var ibin = document.getElementsByClassName("bin")[0].childNodes[1];
var iokt = document.getElementsByClassName("okt")[0].childNodes[1];
var idec = document.getElementsByClassName("dec")[0].childNodes[1];
var ihex = document.getElementsByClassName("hex")[0].childNodes[1];
var obin = document.getElementsByClassName("bin")[1].childNodes[1];
var ookt = document.getElementsByClassName("okt")[1].childNodes[1];
var odec = document.getElementsByClassName("dec")[1].childNodes[1];
var ohex = document.getElementsByClassName("hex")[1].childNodes[1];
ibin.addEventListener("keypress", inputKeyPress);
iokt.addEventListener("keypress", inputKeyPress);
idec.addEventListener("keypress", inputKeyPress);
ihex.addEventListener("keypress", inputKeyPress);
ibin.addEventListener("keyup", inputKeyUp);
iokt.addEventListener("keyup", inputKeyUp);
idec.addEventListener("keyup", inputKeyUp);
ihex.addEventListener("keyup", inputKeyUp);

var lexed = [];

function lexToString(lexed, radix) {
    var str = "";
    for (var i = 0; i < lexed.length; i++) {
        if (lexed[i].type == TokenType.Number)
            str += lexed[i].value.toString(radix);
        else
            str += lexed[i].value;
    }
    return str;
}

function isPrintableCharacter(evt) {
    if (typeof evt.which == "undefined") {
        return true;
    } else if (typeof evt.which == "number" && evt.which > 0) {
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
    }
    return false;
}

function log_lexed(lexed) {
    var str = "lexed: ";
    for (var i = 0; i < lexed.length; i++) {
        str += lexed[i].value;
        str += ' ';
    }
    console.log(str);
}

function inputReady(event) {

}

function determineInputRadix(event) {
    // Check if input char is legit.
    var target = event.target;
    if (target == ibin) {
        return 2;
    } else if (target == iokt) {
        return 8;
    } else if (target == idec) {
        return 10;
    } else if (target == ihex) {
        return 16;
    }
}

function inputKeyPress(event) {
    var code = event.charCode;
    var target = event.target;
    var radix = 0;

    // Only care about printable characters, control characters are treated as is.
    if (isPrintableCharacter(event) == false)
        return false;

    // Check if input char is legit.
    if (target == ibin) {
        radix = 2;
        if (validateBinaryInput(code) == false) {
            event.preventDefault();
            return;
        }
    } else if (target == iokt) {
        radix = 8;
        if (validateOktalInput(code) == false) {
            event.preventDefault();
            return;
        }
    } else if (target == idec) {
        radix = 10;
        if (validateDecimalInput(code) == false) {
            event.preventDefault();
            return;
        }
    } else if (target == ihex) {
        radix = 16;
        if (validateHexadecimalInput(code) == false) {
            event.preventDefault();
            return;
        }
    }

    // Now, let the event bubble through the browser handler which handles all the text-input logic
    // for us (copy-paste, cursor key navigation, etc.) and take all further actions in the keyup
    // event handler.
}

function inputKeyUp(event) {
    var target = event.target;

    // Try to lex input.
    console.log("-----------------------------");
    console.log("target.value = " + target.value);

    var lex = new Lexer(target.value);
    if (lex.lex()) {
        var lexed = lex.getResult();

        // Distribute the lexed input among the input fields.
        radix = determineInputRadix(event);
        lexed = rebaseTokens(lexed, radix);
        ibin.value = lexToString(lexed, 2);
        iokt.value = lexToString(lexed, 8);
        idec.value = lexToString(lexed, 10);
        ihex.value = lexToString(lexed, 16);

        // If lexing went well, try to evaluate the input.
        var calc = new Calculation(lexed);
        if (calc.calculate()) {
            var output = calc.getResult();
            obin.value = output.toString(2);
            ookt.value = output.toString(8);
            odec.value = output.toString(10);
            ohex.value = output.toString(16);
        } else {
            obin.value = "";
            ookt.value = "";
            odec.value = "";
            ohex.value = "";
        }
    } else {
        // TODO print actual lex error
    }
}

function Clear() {
    ibin.value = "";
    iokt.value = "";
    idec.value = "";
    ihex.value = "";
    obin.value = "";
    ookt.value = "";
    odec.value = "";
    ohex.value = "";
}

function NextExample() {
    ibin.value = "x";
    iokt.value = "x";
    idec.value = "x";
    ihex.value = "x";
    obin.value = "x";
    ookt.value = "x";
    odec.value = "x";
    ohex.value = "x";
}

