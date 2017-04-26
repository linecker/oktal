var currentExample = 1;

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

function isPrintableCharacter(event) {
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)
        return false;
    if (event.key.length == 1) {
        return true;
    } else {
        return false;
    }
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

    // Only care about printable characters, control characters (e.g. cursor left) are
    // handled by the browser default handler.
    if (!isPrintableCharacter(event))
        return;

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

    // We end up here if we got a printable character and the input character is
    // legit concerning the radix. Let the event bubble through the browser default
    // handler now to handle text input.

    // Note: returning true or false makes no sense but in the places we need it we
    // can use event.preventDefault() to cancel the browser default handler.
}

function inputKeyUp(event) {
    var target = event.target;

    // Try to lex input.
    radix = determineInputRadix(event);
    var lex = new Lexer(target.value, radix);
    if (lex.lex()) {
        var lexed = lex.getResult();

        /*
        console.log("-----------------------------");
        console.log("target.value = " + target.value);
        console.log("radix = " + radix);
        logTokens(lexed);
        console.log("--");
        */

        // Distribute the lexed input among the input fields.
        lexed = rebaseTokens(lexed, radix);
        //logTokens(lexed);
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

function Example1() {
    ibin.value = "1010<<1000";
    iokt.value = "12<<10";
    idec.value = "10<<8";
    ihex.value = "a<<8";
    obin.value = "101000000000";
    ookt.value = "5000";
    odec.value = "2560";
    ohex.value = "a00";
}

function Example2() {
    ibin.value = "(1|10|100|1000)&111";
    iokt.value = "(1|2|4|10)&7";
    idec.value = "(1|2|4|8)&7";
    ihex.value = "(1|2|4|8)&7";
    obin.value = "111";
    ookt.value = "7";
    odec.value = "7";
    ohex.value = "7";
}

function Example3() {
    ibin.value = "1<<100";
    iokt.value = "1<<4";
    idec.value = "1<<4";
    ihex.value = "1<<4";
    obin.value = "10000";
    ookt.value = "20";
    odec.value = "16";
    ohex.value = "10";
}

function Example4() {
    ibin.value = "1100100/1010";
    iokt.value = "144/12";
    idec.value = "100/10";
    ihex.value = "64/a";
    obin.value = "1010";
    ookt.value = "12";
    odec.value = "10";
    ohex.value = "a";
}

function NextExample() {
    currentExample++;
    if (currentExample > 4)
        currentExample = 1;
    if (currentExample == 1)
        Example1();
    else if (currentExample == 2)
        Example2();
    else if (currentExample == 3)
        Example3();
    else if (currentExample == 4)
        Example4();
}
