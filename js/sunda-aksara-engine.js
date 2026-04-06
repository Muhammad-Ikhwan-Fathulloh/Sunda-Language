// ========== SUNDA LANGUAGE ENGINE - AKSARA VERSION (JavaScript Port) ==========

class SundaAksaraLexer {
  constructor(code) {
    this.code = code.trim();
  }

  tokenize() {
    const tokenDefs = [
      ["COMMENT", /\/\/.*(?:\r?\n|$)/],
      // Keywords in Aksara Sunda
      ["KEYWORD_DECLARE", /(ᮑᮤᮉᮔ᮪|ᮍᮓᮨᮊᮣᮛᮞᮤᮊᮩᮔ᮪)/],
      ["KEYWORD_IF", /ᮅᮕᮙᮤ/],
      ["KEYWORD_ELIF", /ᮜᮙᮥᮔ᮪/],
      ["KEYWORD_ELSE", /(ᮜᮄᮔ᮪ᮔ|ᮜᮄᮔ᮪ ᮜᮙᮥᮔ᮪)/],
      ["KEYWORD_PIKEUN", /ᮕᮤᮊᮩᮔ᮪/],
      ["KEYWORD_WHILE", /ᮘᮛᮤ/],
      ["KEYWORD_TI", /ᮒᮤ/],
      ["KEYWORD_NEPI", /ᮔᮨᮕᮤ/],
      ["KEYWORD_BREAK", /ᮉᮛᮩᮔ᮪/],
      ["KEYWORD_CONTINUE", /ᮒᮨᮛᮞ᮪ᮊᮩᮔ᮪/],
      ["KEYWORD_RUN", /ᮍᮏᮜᮔ᮪ᮊᮩᮔ᮪/],
      ["KEYWORD_END", /ᮃᮀᮌᮩᮞ᮪/],
      ["KEYWORD_PRINT", /ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪/],
      ["KEYWORD_FUNC", /(ᮕᮥᮀᮞᮤ|ᮖᮥᮀᮞᮤ)/],
      ["KEYWORD_RETURN", /ᮘᮜᮤᮊ᮪ᮊᮩᮔ᮪/],
      ["KEYWORD_INPUT", /(ᮒᮑ|ᮙᮀᮌ_ᮉᮞᮤᮃᮔ᮪)/],
      ["KEYWORD_AND", /ᮏᮩᮀ/],
      ["KEYWORD_OR", /ᮃᮒᮝ/],
      ["KEYWORD_NOT", /ᮜᮄᮔ᮪/],
      ["KEYWORD_NULL", /ᮊᮧᮞᮧᮀ/],
      ["KEYWORD_TRY", /ᮎᮧᮘ/],
      ["KEYWORD_CATCH", /ᮎᮨᮊᮨᮜ᮪/],
      ["KEYWORD_FINALLY", /ᮒᮥᮀᮒᮥᮀᮔ/],
      ["KEYWORD_THROW", /ᮘᮜᮀᮊᮩᮔ᮪/],
      ["KEYWORD_CLASS", /ᮊᮨᮜᮞ᮪/],
      ["KEYWORD_THIS", /ᮄᮉ/],
      ["KEYWORD_NEW", /ᮃᮑᮛ᮪/],
      ["KEYWORD_EXTENDS", /ᮒᮥᮛᮥᮔᮔ᮪/],
      ["BOOLEAN", /(ᮜᮨᮛᮨᮞ᮪|ᮜᮨᮕᮒ᮪)/],
      ["AKSARA_NUMBER", /[\u1BB0-\u1BB9]+(\.[\u1BB0-\u1BB9]+)?/],
      ["NUMBER", /\b\d+(\.\d+)?\b/],
      ["STRING", /"[^"]*"/],
      ["VARIABLE", /[a-zA-Z_\u1B80-\u1BAF][a-zA-Z_0-9\u1B80-\u1BAF]*/],
      ["OPERATOR", /(==|!=|<=|>=|[+\-*/%=<>])/],
      ["DOT", /\./],
      ["COLON", /:/],
      ["LPAREN", /\(/],
      ["RPAREN", /\)/],
      ["LBRACKET", /\[/],
      ["RBRACKET", /\]/],
      ["COMMA", /,/],
      ["SEMICOLON", /;/],
      ["SKIP", /[ \t\r\n]+/],
      ["MISMATCH", /./],
    ];

    const parts = tokenDefs.map(([name, rx]) => `(?<${name}>${rx.source})`);
    const combined = new RegExp(parts.join("|"), "gu");
    const tokens = [];
    let match;

    const aksaraToLatinNum = (aksara) => {
      const map = { '᮰': '0', '᮱': '1', '᮲': '2', '᮳': '3', '᮴': '4', '᮵': '5', '᮶': '6', '᮷': '7', '᮸': '8', '᮹': '9' };
      return aksara.split('').map(c => map[c] || c).join('');
    };

    while ((match = combined.exec(this.code)) !== null) {
      for (const [name] of tokenDefs) {
        if (match.groups[name] !== undefined) {
          if (name === "SKIP" || name === "COMMENT") break;
          if (name === "MISMATCH") {
            throw new SyntaxError(`Karakter teu dikenal: '${match.groups[name]}'`);
          }
          
          let value = match.groups[name];
          if (name === "AKSARA_NUMBER") {
            value = aksaraToLatinNum(value);
            tokens.push(["NUMBER", value]);
          } else {
            tokens.push([name, value]);
          }
          break;
        }
      }
    }
    return tokens;
  }
}

// Copy of SundaParser and SundaInterpreter logic from sunda-engine.js
// but using SundaAksaraLexer

class SundaAksaraParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  currentToken() {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  eat(expectedKind) {
    const token = this.currentToken();
    if (!token) throw new SyntaxError("Unexpected end of input");
    if (expectedKind && token[0] !== expectedKind) {
      throw new SyntaxError(`Expected ${expectedKind}, got ${token[0]} '${token[1]}'`);
    }
    this.pos++;
    return token;
  }

  parse() {
    const statements = [];
    while (this.currentToken()) {
      statements.push(this.statement());
    }
    return statements;
  }

  statement() {
    const token = this.currentToken();
    if (!token) return null;
    const [kind, value] = token;

    if (kind === "KEYWORD_DECLARE") return this.declareStmt();
    if (kind === "KEYWORD_PRINT") return this.printStmt();
    if (kind === "KEYWORD_INPUT") return this.inputStmt();
    if (kind === "KEYWORD_IF") return this.ifStmt();
    if (kind === "KEYWORD_PIKEUN") return this.loopStmt();
    if (kind === "KEYWORD_WHILE") return this.whileStmt();
    if (kind === "KEYWORD_BREAK") return this.breakStmt();
    if (kind === "KEYWORD_CONTINUE") return this.continueStmt();
    if (kind === "KEYWORD_FUNC") return this.funcStmt();
    if (kind === "KEYWORD_RETURN") return this.returnStmt();
    if (kind === "KEYWORD_CLASS") return this.classStmt();
    if (kind === "KEYWORD_TRY") return this.tryStmt();
    if (kind === "KEYWORD_THROW") return this.throwStmt();
    if (kind === "VARIABLE") {
      const next = this.pos + 1 < this.tokens.length ? this.tokens[this.pos + 1] : null;
      if (next && next[0] === "OPERATOR" && next[1] === "=") return this.assignmentStmt();
      if (next && next[0] === "DOT") return this.memberAssignmentStmt();
      return this.exprStmt();
    }
    if (kind === "KEYWORD_THIS") {
      const next = this.pos + 1 < this.tokens.length ? this.tokens[this.pos + 1] : null;
      if (next && next[0] === "DOT") return this.memberAssignmentStmt();
    }
    throw new SyntaxError(`Sintaks teu dikenal: ${value}`);
  }

  declareStmt() {
    this.eat("KEYWORD_DECLARE");
    const varName = this.eat("VARIABLE")[1];
    this.eat("OPERATOR");
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["declare", varName, expr];
  }

  assignmentStmt() {
    const varName = this.eat("VARIABLE")[1];
    this.eat("OPERATOR");
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["assign", varName, expr];
  }

  exprStmt() {
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["expr", expr];
  }

  memberAssignmentStmt() {
    const target = this.memberAccess();
    if (this.currentToken() && this.currentToken()[0] === "OPERATOR" && this.currentToken()[1] === "=") {
      this.eat("OPERATOR");
      const expr = this.expression();
      this.eat("SEMICOLON");
      return ["member_assign", target, expr];
    }
    this.eat("SEMICOLON");
    return ["expr", target];
  }

  printStmt() {
    this.eat("KEYWORD_PRINT");
    const expressions = [];
    expressions.push(this.expression());

    while (this.currentToken() && this.currentToken()[0] === "COMMA") {
      this.eat("COMMA");
      expressions.push(this.expression());
    }

    this.eat("SEMICOLON");
    return ["print", expressions];
  }

  inputStmt() {
    this.eat("KEYWORD_INPUT");
    let promptStr = null;
    if (this.currentToken() && this.currentToken()[0] === "STRING") {
      promptStr = this.eat("STRING")[1].slice(1, -1);
      if (this.currentToken() && this.currentToken()[0] === "COMMA") {
        this.eat("COMMA");
      }
    }
    const varName = this.eat("VARIABLE")[1];
    this.eat("SEMICOLON");
    return ["input", varName, promptStr];
  }

  ifStmt() {
    this.eat("KEYWORD_IF");
    const condition = this.expression();
    this.eat("COLON");
    const body = this.block();
    const branches = [["if", condition, body]];
    while (this.currentToken() && this.currentToken()[0] === "KEYWORD_ELIF") {
      this.eat("KEYWORD_ELIF");
      const elifCond = this.expression();
      this.eat("COLON");
      const elifBody = this.block();
      branches.push(["elif", elifCond, elifBody]);
    }
    let elseBranch = null;
    if (this.currentToken() && this.currentToken()[0] === "KEYWORD_ELSE") {
      this.eat("KEYWORD_ELSE");
      this.eat("COLON");
      elseBranch = this.block();
    }
    this.eat("KEYWORD_END");
    return ["if_chain", branches, elseBranch];
  }

  loopStmt() {
    this.eat("KEYWORD_PIKEUN");
    const varName = this.eat("VARIABLE")[1];
    this.eat("OPERATOR");
    const startExpr = this.expression();
    this.eat("KEYWORD_TI");
    const endExpr = this.expression();
    this.eat("KEYWORD_RUN");
    const body = this.block();
    this.eat("KEYWORD_END");
    return ["loop", varName, startExpr, endExpr, body];
  }

  breakStmt() {
    this.eat("KEYWORD_BREAK");
    this.eat("SEMICOLON");
    return ["break"];
  }

  continueStmt() {
    this.eat("KEYWORD_CONTINUE");
    this.eat("SEMICOLON");
    return ["continue"];
  }

  whileStmt() {
    this.eat("KEYWORD_WHILE");
    const condition = this.expression();
    this.eat("KEYWORD_RUN");
    const body = this.block();
    this.eat("KEYWORD_END");
    return ["while", condition, body];
  }

  funcStmt() {
    this.eat("KEYWORD_FUNC");
    const name = this.eat("VARIABLE")[1];
    this.eat("LPAREN");
    const params = [];
    if (this.currentToken() && this.currentToken()[0] === "VARIABLE") {
      params.push(this.eat("VARIABLE")[1]);
      while (this.currentToken() && this.currentToken()[0] === "COMMA") {
        this.eat("COMMA");
        params.push(this.eat("VARIABLE")[1]);
      }
    }
    this.eat("RPAREN");
    this.eat("COLON");
    const body = this.block();
    this.eat("KEYWORD_END");
    return ["function", name, params, body];
  }

  returnStmt() {
    this.eat("KEYWORD_RETURN");
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["return", expr];
  }

  classStmt() {
    this.eat("KEYWORD_CLASS");
    const name = this.eat("VARIABLE")[1];
    let parent = null;
    if (this.currentToken() && this.currentToken()[0] === "KEYWORD_EXTENDS") {
      this.eat("KEYWORD_EXTENDS");
      parent = this.eat("VARIABLE")[1];
    }
    this.eat("COLON");
    const body = [];
    while (this.currentToken() && this.currentToken()[0] !== "KEYWORD_END") {
      const token = this.currentToken();
      if (token[0] === "KEYWORD_DECLARE") {
        this.eat("KEYWORD_DECLARE");
        const varName = this.eat("VARIABLE")[1];
        this.eat("OPERATOR");
        const expr = this.expression();
        this.eat("SEMICOLON");
        body.push(["property", varName, expr]);
      } else if (token[0] === "KEYWORD_FUNC") {
        body.push(this.funcStmt());
      } else {
        throw new SyntaxError(`Sintaks kelas teu dikenal: ${token[1]}`);
      }
    }
    this.eat("KEYWORD_END");
    return ["class", name, parent, body];
  }

  tryStmt() {
    this.eat("KEYWORD_TRY");
    this.eat("COLON");
    const tryBody = this.block();
    let catchVar = null;
    let catchBody = null;
    if (this.currentToken() && this.currentToken()[0] === "KEYWORD_CATCH") {
      this.eat("KEYWORD_CATCH");
      catchVar = this.eat("VARIABLE")[1];
      this.eat("COLON");
      catchBody = this.block();
    }
    let finallyBody = null;
    if (this.currentToken() && this.currentToken()[0] === "KEYWORD_FINALLY") {
      this.eat("KEYWORD_FINALLY");
      this.eat("COLON");
      finallyBody = this.block();
    }
    this.eat("KEYWORD_END");
    return ["try", tryBody, catchVar, catchBody, finallyBody];
  }

  throwStmt() {
    this.eat("KEYWORD_THROW");
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["throw", expr];
  }

  block() {
    const statements = [];
    const stopTokens = ["KEYWORD_END", "KEYWORD_ELIF", "KEYWORD_ELSE", "KEYWORD_CATCH", "KEYWORD_FINALLY"];
    while (this.currentToken() && !stopTokens.includes(this.currentToken()[0])) {
      statements.push(this.statement());
    }
    return statements;
  }

  expression() { return this.logicalOr(); }

  logicalOr() {
    let node = this.logicalAnd();
    while (this.currentToken() && this.currentToken()[0] === "KEYWORD_OR") {
      const op = this.eat("KEYWORD_OR")[1];
      const right = this.logicalAnd();
      node = ["binop", node, "or", right];
    }
    return node;
  }

  logicalAnd() {
    let node = this.comparison();
    while (this.currentToken() && this.currentToken()[0] === "KEYWORD_AND") {
      const op = this.eat("KEYWORD_AND")[1];
      const right = this.comparison();
      node = ["binop", node, "and", right];
    }
    return node;
  }

  memberAccess() {
    let node;
    const isThis = this.currentToken()[0] === "KEYWORD_THIS";
    if (isThis) {
      this.eat("KEYWORD_THIS");
      node = ["this"];
    } else {
      const token = this.eat("VARIABLE");
      node = ["variable", token[1]];
      if (this.currentToken() && this.currentToken()[0] === "LPAREN") {
        this.eat("LPAREN");
        const args = this.parseArgs();
        this.eat("RPAREN");
        node = ["call", token[1], args];
      }
    }

    while (this.currentToken() && this.currentToken()[0] === "DOT") {
      this.eat("DOT");
      const member = this.eat("VARIABLE")[1];
      if (this.currentToken() && this.currentToken()[0] === "LPAREN") {
        this.eat("LPAREN");
        const args = this.parseArgs();
        this.eat("RPAREN");
        node = ["member_call", node, member, args];
      } else {
        node = ["member_get", node, member];
      }
    }
    return node;
  }

  parseArgs() {
    const args = [];
    if (this.currentToken() && this.currentToken()[0] !== "RPAREN") {
      args.push(this.expression());
      while (this.currentToken() && this.currentToken()[0] === "COMMA") {
        this.eat("COMMA");
        args.push(this.expression());
      }
    }
    return args;
  }

  comparison() {
    let node = this.arithmetic();
    const compOps = ["==", "!=", "<", ">", "<=", ">="];
    while (this.currentToken() && this.currentToken()[0] === "OPERATOR" && compOps.includes(this.currentToken()[1])) {
      const op = this.eat("OPERATOR")[1];
      const right = this.arithmetic();
      node = ["binop", node, op, right];
    }
    return node;
  }

  arithmetic() {
    let node = this.term();
    while (this.currentToken() && this.currentToken()[0] === "OPERATOR" && ["+", "-"].includes(this.currentToken()[1])) {
      const op = this.eat("OPERATOR")[1];
      const right = this.term();
      node = ["binop", node, op, right];
    }
    return node;
  }

  term() {
    let node = this.factor();
    while (this.currentToken() && this.currentToken()[0] === "OPERATOR" && ["*", "/", "%"].includes(this.currentToken()[1])) {
      const op = this.eat("OPERATOR")[1];
      const right = this.factor();
      node = ["binop", node, op, right];
    }
    return node;
  }

  factor() {
    const token = this.eat();
    const [kind, value] = token;
    if (kind === "NUMBER") return ["number", value.includes(".") ? parseFloat(value) : parseInt(value)];
    if (kind === "STRING") return ["string", value.slice(1, -1)];
    if (kind === "BOOLEAN") return ["boolean", value === "ᮜᮨᮛᮨᮞ᮪" || value === "leres" || value === "true"];
    if (kind === "KEYWORD_NULL") return ["null"];
    if (kind === "VARIABLE" || kind === "KEYWORD_THIS") {
      this.pos--;
      return this.memberAccess();
    }
    if (kind === "KEYWORD_NOT") return ["unop", "not", this.factor()];
    if (kind === "KEYWORD_NEW") {
      const clsName = this.eat("VARIABLE")[1];
      this.eat("LPAREN");
      const args = [];
      if (this.currentToken() && this.currentToken()[0] !== "RPAREN") {
        args.push(this.expression());
        while (this.currentToken() && this.currentToken()[0] === "COMMA") {
          this.eat("COMMA");
          args.push(this.expression());
        }
      }
      this.eat("RPAREN");
      return ["new", clsName, args];
    }
    if (kind === "LPAREN") {
      const node = this.expression();
      this.eat("RPAREN");
      return node;
    }
    if (kind === "OPERATOR" && value === "-") return ["unop", "-", this.factor()];
    throw new SyntaxError(`Teu bisa ngaevaluasi: ${value}`);
  }
}

// Interpreter classes (identical to SundaInterpreter but could be customized later)
class SundaAksaraClass {
  constructor(name, parent, body) {
    this.name = name;
    this.parent = parent;
    this.properties = {}; 
    this.methods = {}; 
    body.forEach(stmt => {
      if (stmt[0] === "property") this.properties[stmt[1]] = stmt[2];
      else if (stmt[0] === "function") this.methods[stmt[1]] = [stmt[2], stmt[3]];
    });
  }
}

class SundaAksaraInstance {
  constructor(cls, interpreter) {
    this.cls = cls;
    this.fields = {};
    let currentCls = cls;
    const classes = [];
    while (currentCls) {
      classes.unshift(currentCls);
      currentCls = interpreter.classes[currentCls.parent];
    }
    classes.forEach(c => {
      for (const [name, expr] of Object.entries(c.properties)) {
        this.fields[name] = interpreter.evaluate(expr);
      }
    });
  }

  getMethod(name, interpreter) {
    let currentCls = this.cls;
    while (currentCls) {
      if (name in currentCls.methods) return currentCls.methods[name];
      currentCls = interpreter.classes[currentCls.parent];
    }
    return null;
  }
}

class SundaAksaraInterpreter {
  constructor(ast, variables, functions, outputFn, inputFn, classes) {
    this.ast = ast;
    this.variables = variables || {};
    this.functions = functions || {};
    this.classes = classes || {};
    this.outputFn = outputFn || console.log;
    this.inputFn = inputFn || (() => "");
    this.thisContext = null;
    this.returnFlag = false;
    this.returnValue = null;
    this.breakFlag = false;
    this.continueFlag = false;
    this.stepCount = 0;
    this.maxSteps = 100000;
  }

  interpret() { this.execute(this.ast); }
  checkSteps() {
    this.stepCount++;
    if (this.stepCount > this.maxSteps) throw new Error("Infinite loop detected!");
  }

  evaluate(node) {
    this.checkSteps();
    if (!Array.isArray(node)) return node;
    const kind = node[0];
    if (kind === "number" || kind === "string" || kind === "boolean") return node[1];
    if (kind === "null") return null;
    if (kind === "variable") {
      const name = node[1];
      if (name in this.variables) return this.variables[name];
      if (name in this.functions) return name;
      throw new Error(`Variabel '${name}' teu kapanggih.`);
    }
    if (kind === "this") return this.thisContext;
    if (kind === "member_get") {
      const obj = this.evaluate(node[1]);
      return obj.fields[node[2]];
    }
    if (kind === "member_call") {
      const obj = this.evaluate(node[1]);
      const [params, body] = obj.getMethod(node[2], this);
      const localVars = {};
      params.forEach((p, i) => localVars[p] = this.evaluate(node[3][i]));
      const interp = new SundaAksaraInterpreter(body, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
      interp.thisContext = obj;
      interp.interpret();
      return interp.returnValue;
    }
    if (kind === "new") {
      const instance = new SundaAksaraInstance(this.classes[node[1]], this);
      const init = instance.getMethod("nyieun", this);
      if (init) {
        const [params, body] = init;
        const localVars = {};
        params.forEach((p, i) => localVars[p] = this.evaluate(node[2][i]));
        const initInterp = new SundaAksaraInterpreter(body, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
        initInterp.thisContext = instance;
        initInterp.interpret();
      }
      return instance;
    }
    if (kind === "binop") {
      const left = this.evaluate(node[1]);
      const right = this.evaluate(node[3]);
      const op = node[2];
      if (op === "and") return left && right;
      if (op === "or") return left || right;
      return this.applyOp(left, op, right);
    }
    if (kind === "unop") {
      const val = this.evaluate(node[2]);
      return node[1] === "-" ? -val : !val;
    }
    if (kind === "call") {
      const [funcParams, funcBody] = this.functions[node[1]];
      const localVars = {};
      funcParams.forEach((p, i) => localVars[p] = this.evaluate(node[2][i]));
      const interp = new SundaAksaraInterpreter(funcBody, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
      interp.interpret();
      return interp.returnValue;
    }
  }

  applyOp(left, op, right) {
    const ops = {
      "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b,
      "/": (a, b) => a / b, "%": (a, b) => a % b,
      "==": (a, b) => a === b, "!=": (a, b) => a !== b,
      "<": (a, b) => a < b, ">": (a, b) => a > b,
      "<=": (a, b) => a <= b, ">=": (a, b) => a >= b,
    };
    return ops[op](left, right);
  }

  execute(ast) {
    for (const stmt of ast) {
      if (this.returnFlag || this.breakFlag || this.continueFlag) break;
      this.executeStmt(stmt);
    }
  }

  executeStmt(stmt) {
    const kind = stmt[0];
    if (kind === "declare" || kind === "assign") this.variables[stmt[1]] = this.evaluate(stmt[2]);
    else if (kind === "print") this.outputFn(stmt[1].map(e => {
        const v = this.evaluate(e);
        if (v === true) return "leres";
        if (v === false) return "lepat";
        return String(v);
    }).join(" "));
    else if (kind === "input") {
        const val = this.inputFn(stmt[2]);
        this.variables[stmt[1]] = val !== null ? val : "";
    }
    else if (kind === "if_chain") {
      let done = false;
      for (const [, cond, body] of stmt[1]) {
        if (this.evaluate(cond)) { this.execute(body); done = true; break; }
      }
      if (!done && stmt[2]) this.execute(stmt[2]);
    }
    else if (kind === "loop") {
      const startVal = this.evaluate(stmt[2]);
      const endVal = this.evaluate(stmt[3]);
      for (let i = startVal; i <= endVal; i++) {
        this.variables[stmt[1]] = i;
        this.execute(stmt[4]);
        if (this.breakFlag) { this.breakFlag = false; break; }
      }
    }
    else if (kind === "while") {
      while (this.evaluate(stmt[1])) {
        this.execute(stmt[2]);
        if (this.breakFlag) { this.breakFlag = false; break; }
      }
    }
    else if (kind === "function") this.functions[stmt[1]] = [stmt[2], stmt[3]];
    else if (kind === "class") this.classes[stmt[1]] = new SundaAksaraClass(stmt[1], stmt[2], stmt[3]);
    else if (kind === "return") { this.returnValue = this.evaluate(stmt[1]); this.returnFlag = true; }
  }
}

function runSundaAksaraCode(code, inputValues) {
  const output = [];
  const outputFn = (val) => output.push(String(val));
  const inputFn = (p) => inputValues.length ? inputValues.shift() : null;

  try {
    const lexer = new SundaAksaraLexer(code);
    const tokens = lexer.tokenize();
    const parser = new SundaAksaraParser(tokens);
    const ast = parser.parse();
    const interpreter = new SundaAksaraInterpreter(ast, {}, {}, outputFn, inputFn, {});
    interpreter.interpret();
    return { success: true, output };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
