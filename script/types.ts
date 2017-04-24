// types.ts

enum TokenType {
    Number,
    Operator
}

class Token {
    constructor(type: TokenType, value: string) {
        this.type = type;
        this.value = value;
        //this.original = '';
    }
    type: TokenType;
    value: string;
    //original: string;
}