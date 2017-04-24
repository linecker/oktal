// ops.ts

const list: Array<string> = ['~','!','<<','>>','&','^','|','*','/','+','-','%','(',')','=','<','>'];

const functions = {
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
    '='  : function(a, b)  { return a == b },
    '~'  : function(a) { return ~a },
    '!'  : function(a) { return ~a }
};
