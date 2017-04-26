// lex.ts

// Lexes a string of numbers and operators into tokens.
class Lexer
{
    private input: string = '';
    private radix: number = 0;
    private pos: number = 0;
    private lexed: Array<Token> = [];
    private error: string = '';

    constructor(input: string, radix: number) {
        this.input = input;
        this.radix = radix;
    }

    // Split the input string into a list of tokens <type,value>.
    public lex(): boolean {
        for (this.pos = 0; this.pos < this.input.length && !this.error; this.pos++) {
            var c = this.input[this.pos];
            if (!this.operator() && !this.number() && !this.whitespace()) {
                this.error = "fixme";
                return false;
            }
        }
        if (this.error)
            return false;
        return true;
    }

    public getResult(): Array<Token> {
        if (this.error)
            return undefined;
        return this.lexed;
    }

    private whitespace(): boolean {
        var c = this.input[this.pos];
        if (c == ' ' || c == '  ')
            return true;
        return false;
    }

    // Check if are at the beginning of an operator and consume it if possible.
    private operator(): boolean {
        if (list.indexOf(this.input[this.pos]) > -1) {
            var op = this.input[this.pos];
            if (op == '<' && this.pos + 1 < this.input.length && this.input[this.pos+1] == '<') {
                op = '<<';
                this.pos++;
            } else if (op == '>' && this.pos + 1 < this.input.length && this.input[this.pos+1] == '>') {
                op = '>>';
                this.pos++;
            }
            this.lexed.push(new Token(TokenType.Operator,op));
            return true;
        }
        return false;
    }
    // Check if we are at the beginning of a number and consume it if possible.
    private number(): boolean {
        var c = this.input[this.pos];
        /*if (!isNumber(c))
            return false;
        var radix = 10;
        if (this.input[this.pos] == '0' && this.pos + 1 < this.input.length) {
            c = this.input[++this.pos];
            if (c == 'x' || c == 'X') {
                radix = 16;
                this.pos++;
            }
            else if (c == 'b' || c == 'B') {
                radix = 2;
                this.pos++;
            }
            else {
                radix = 8;
                this.pos--;
            }
        }
        */

        var start = this.pos;
        for (; this.pos < this.input.length; this.pos++) {
            if(!isHexNumber(this.input[this.pos])) {
                this.pos--;
                break;
            }
        }
        var whole = this.input.substring(start, this.pos+1);
        var x = parseInt(whole, this.radix);
        if (isNaN(x)) {
            console.log("NAN");
            this.error = "NaN";
            return true;
        }
        this.lexed.push(new Token(TokenType.Number,x.toString(this.radix)));
        return true;
    }
}

// Helper functions for lexing.
function isNumber(c: string): boolean {
    if (c >= '0' && c <= '9')
        return true;
    return false;
}
function isHexNumber(c:string): boolean {
    if ((c >= '0' && c <= '9') ||
        (c >= 'a' && c <= 'f') ||
        (c >= 'A' && c <= 'F'))
        return true;
    return false;
}
