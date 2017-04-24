// calc.ts

// If possible, calculates the numeric result from a token list.
class Calculation
{
    private tokens: Array<Token>;
    private error: string = '';
    private output: number;

    constructor(input: Array<Token>) {
        this.tokens = input;
    }

    public calculate() {
        // calculate
        for(var safe = 64; this.tokens.length > 1 && safe > 0 && this.error == '' ; safe--) {
            this.evaluate();
            //log_tokens("evaluation [" + (32-safe) + "]");
        }
        this.output = parseInt(this.tokens[0].value);
        if (this.error == '')
            return true;
        return false;

        // FIXME
        /*return {
            lexResult: lexed,
            calcResult: output
        };*/
    }

    public getResult() {
        return this.output;
    }

    private A(start: number, end: number): boolean {
        if (this.tokens[start].type != TokenType.Number)
            return false;
        return true;
    }

    private xA(start: number, end: number): boolean {
        if (this.tokens[start].type != TokenType.Operator || this.tokens[start+1].type != TokenType.Number)
            return false;
        var result = functions[this.tokens[start].value](this.tokens[start+1].value);
        this.tokens.splice(start, 2, new Token(TokenType.Number, result));
        //debugLog("Found xB expression, result = " + result);
        return true;
    }

    private AxB(start: number, end: number): boolean {
        if (this.tokens[start].type != TokenType.Number || this.tokens[start+1].type != TokenType.Operator || this.tokens[start+2].type != TokenType.Number)
            return false;
        var result = functions[this.tokens[start+1].value](this.tokens[start].value, this.tokens[start+2].value);
        this.tokens.splice(start, 3, new Token(TokenType.Number, result));
        //debugLog("Found AxB expression, result = " + result);
        return true;
    }

    private AxBx(start: number, end: number): boolean {
        //debugLog("Found AxBx expression");
        // Search for operators within the tokens. Precedence significant!
        var op = undefined;
        var i = start;
        for (var j = 0; j < list.length; j++) {
            for(i = 0; i < end; i++) {
                if (this.tokens[i].type == TokenType.Operator && this.tokens[i].value == list[j]) {
                    op = list[j];
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
            var result = functions[op](this.tokens[i-1].value, this.tokens[i+1].value);
            this.tokens.splice(i-1, 3, new Token(TokenType.Number, result));
        }
        return true;
    }

    // Evaluate an expression that contains no '(' ')'
    private evaluateInner(start: number, end: number): boolean {
        var len = end - start + 1;

        /*
        TODO drop this?
        var xxx = tokens.slice(start, end+1);
        var yyy = "";
        for (var i = 0; i < xxx.length; i++) {
            yyy += xxx[i].value + " ";
        }
        debugLog("start = " + start + " end = " + end + " len = " + len + " -> " + yyy);
        */

        if (len == 1) {
            return this.A(start, end);
        } else if (len == 2) {
            return this.xA(start, end);
        } else if (len == 3) {
            return this.AxB(start, end);
        } else {
            return this.AxBx(start, end);
        }
    }

    // Find the innnermost expression and evaluate it.
    private evaluate() {
        // Find the innermost ( ) expression.
        var i = 0, j = 0, brace = 0;
        for (; i < this.tokens.length; i++)  {
            if (this.tokens[i].type == TokenType.Operator && this.tokens[i].value == ')') {
                brace++;
                break;
            }
        }
        if (i != this.tokens.length) { // if found ')'
            for (j = i; j >= 0; j--) {
                if (this.tokens[j].type == TokenType.Operator && this.tokens[j].value == '(') {
                    brace++;
                    break;
                }
            }
        }

        //debugLog("Brace = " + brace + " j = " + j + " i = " + i );
        if (brace == 0) {
            if (this.evaluateInner(0, this.tokens.length - 1) == false) {
                this.error = "FIXME";
                return;
            }
        } else if (brace == 1) {
            this.error = "FIXME";
            return;
        } else if (brace == 2) {
            this.tokens.splice(j, 1);
            this.tokens.splice(i-1, 1);
            i-=2;
            //debugLog("Brace = " + brace + " j = " + j + " i = " + i );
            if (this.evaluateInner(j, i) == false) {
                this.error = "FIXME";
                return;
            }
        }
    }
}


