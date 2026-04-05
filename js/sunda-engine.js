// ========== SUNDA LANGUAGE ENGINE (JavaScript Port) ==========

class SundaLexer {
  constructor(code) {
    this.code = code.trim();
  }

  tokenize() {
    const tokenDefs = [
      ["COMMENT", /\/\/.*(?:\r?\n|$)/],
      ["KEYWORD_DECLARE", /\b(nyieun|ngadeklarasikeun)\b/],
      ["KEYWORD_IF", /\bupami\b/],
      ["KEYWORD_ELIF", /\blamun\b/],
      ["KEYWORD_ELSE", /\b(lainna|lain lamun)\b/],
      ["KEYWORD_PIKEUN", /\bpikeun\b/],
      ["KEYWORD_WHILE", /\bbari\b/],
      ["KEYWORD_TI", /\bti\b/],
      ["KEYWORD_NEPI", /\bnepi\b/],
      ["KEYWORD_BREAK", /\beureun\b/],
      ["KEYWORD_CONTINUE", /\bteraskeun\b/],
      ["KEYWORD_RUN", /\bngajalankeun\b/],
      ["KEYWORD_END", /\banggeus\b/],
      ["KEYWORD_PRINT", /\btampilkeun\b/],
      ["KEYWORD_FUNC", /\b(?:pungsi|fungsi)\b/],
      ["KEYWORD_RETURN", /\bbalikkeun\b/],
      ["KEYWORD_INPUT", /\b(tanya|mangga_eusian)\b/],
      ["KEYWORD_AND", /\bjeung\b/],
      ["KEYWORD_OR", /\batawa\b/],
      ["KEYWORD_NOT", /\blain\b/],
      ["KEYWORD_NULL", /\bkosong\b/],
      ["KEYWORD_TRY", /\bcoba\b/],
      ["KEYWORD_CATCH", /\bcekel\b/],
      ["KEYWORD_FINALLY", /\btungtungna\b/],
      ["KEYWORD_THROW", /\bbalangkeun\b/],
      ["KEYWORD_CLASS", /\bkelas\b/],
      ["KEYWORD_THIS", /\bieu\b/],
      ["KEYWORD_NEW", /\banyar\b/],
      ["KEYWORD_EXTENDS", /\bturunan\b/],
      ["BOOLEAN", /\b(leres|lepat|true|false)\b/],
      ["NUMBER", /\b\d+(\.\d+)?\b/],
      ["STRING", /"[^"]*"/],
      ["VARIABLE", /[a-zA-Z_][a-zA-Z_0-9]*/],
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
    const combined = new RegExp(parts.join("|"), "g");
    const tokens = [];
    let match;

    while ((match = combined.exec(this.code)) !== null) {
      for (const [name] of tokenDefs) {
        if (match.groups[name] !== undefined) {
          if (name === "SKIP" || name === "COMMENT") break;
          if (name === "MISMATCH") {
            throw new SyntaxError(`Karakter teu dikenal: '${match.groups[name]}'`);
          }
          tokens.push([name, match.groups[name]]);
          break;
        }
      }
    }
    return tokens;
  }
}

class SundaParser {
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
    // If no '=', it's just a method call or property access used as a statement
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

    // Check if there is an optional prompt string
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
      // Handle regular function call: func(args)
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
    if (kind === "BOOLEAN") return ["boolean", value === "leres" || value === "true"];
    if (kind === "KEYWORD_NULL") return ["null"];
    if (kind === "VARIABLE" || kind === "KEYWORD_THIS") {
      this.pos--; // Put it back to use memberAccess
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

class SundaClass {
  constructor(name, parent, body) {
    this.name = name;
    this.parent = parent;
    this.properties = {}; // name -> initialExpr
    this.methods = {}; // name -> [params, body]
    body.forEach(stmt => {
      if (stmt[0] === "property") this.properties[stmt[1]] = stmt[2];
      else if (stmt[0] === "function") this.methods[stmt[1]] = [stmt[2], stmt[3]];
    });
  }
}

class SundaInstance {
  constructor(cls, interpreter) {
    this.cls = cls;
    this.fields = {};
    // Initialize properties
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

class SundaInterpreter {
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

  interpret() {
    this.execute(this.ast);
  }

  checkSteps() {
    this.stepCount++;
    if (this.stepCount > this.maxSteps) {
      throw new Error("Infinite loop detected! (leuwih ti 100000 léngkah)");
    }
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
      if (name in this.functions) return name; // For first-class functions if needed
      throw new Error(`Variabel '${name}' teu kapanggih.`);
    }
    if (kind === "this") {
      if (!this.thisContext) throw new Error("'ieu' ngan bisa dipaké di jero kelas.");
      return this.thisContext;
    }
    if (kind === "member_get") {
      const obj = this.evaluate(node[1]);
      if (!(obj instanceof SundaInstance)) throw new Error("Aksés member ngan bisa dipaké dina objék.");
      if (node[2] in obj.fields) return obj.fields[node[2]];
      throw new Error(`Member '${node[2]}' teu kapanggih dina objék.`);
    }
    if (kind === "member_call") {
      const obj = this.evaluate(node[1]);
      const methodName = node[2];
      const args = node[3];
      if (!(obj instanceof SundaInstance)) throw new Error("Geroan métode ngan bisa dipaké dina objék.");
      const method = obj.getMethod(methodName, this);
      if (!method) throw new Error(`Métode '${methodName}' teu kapanggih dina kelas ${obj.cls.name}.`);
      
      const [params, body] = method;
      const localVars = {};
      params.forEach((p, i) => localVars[p] = this.evaluate(args[i]));
      const methodInterp = new SundaInterpreter(body, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
      methodInterp.thisContext = obj;
      methodInterp.interpret();
      return methodInterp.returnValue;
    }
    if (kind === "new") {
      const clsName = node[1];
      if (!(clsName in this.classes)) throw new Error(`Kelas '${clsName}' teu kapanggih.`);
      const instance = new SundaInstance(this.classes[clsName], this);
      // Optional: call constructor (init) if exists
      const init = instance.getMethod("nyieun", this); // Use 'nyieun' as constructor name?
      if (init) {
        const [params, body] = init;
        const args = node[2];
        const localVars = {};
        params.forEach((p, i) => localVars[p] = this.evaluate(args[i]));
        const initInterp = new SundaInterpreter(body, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
        initInterp.thisContext = instance;
        initInterp.interpret();
      }
      return instance;
    }
    if (kind === "binop") {
      const leftNode = node[1];
      const op = node[2];
      const rightNode = node[3];

      if (op === "and") return this.evaluate(leftNode) && this.evaluate(rightNode);
      if (op === "or") return this.evaluate(leftNode) || this.evaluate(rightNode);

      const left = this.evaluate(leftNode);
      const right = this.evaluate(rightNode);
      return this.applyOp(left, op, right);
    }
    if (kind === "unop") {
      const val = this.evaluate(node[2]);
      if (node[1] === "-") return -val;
      if (node[1] === "not") return !val;
      return val;
    }
    if (kind === "call") {
      const [, name, args] = node;
      if (!(name in this.functions)) throw new Error(`Fungsi '${name}' teu kapanggih.`);
      const [funcParams, funcBody] = this.functions[name];
      if (args.length !== funcParams.length) {
        throw new Error(`Fungsi '${name}' butuh ${funcParams.length} argumén, tapi dikirim ${args.length}.`);
      }
      const localVars = {};
      funcParams.forEach((param, i) => { localVars[param] = this.evaluate(args[i]); });
      const funcInterp = new SundaInterpreter(funcBody, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
      funcInterp.stepCount = this.stepCount;
      funcInterp.maxSteps = this.maxSteps;
      funcInterp.interpret();
      this.stepCount = funcInterp.stepCount;
      return funcInterp.returnValue;
    }
    return null;
  }

  applyOp(left, op, right) {
    const ops = {
      "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b,
      "/": (a, b) => { if (b === 0) throw new Error("Teu bisa dibagi ku 0!"); return a / b; },
      "%": (a, b) => a % b,
      "==": (a, b) => a === b, "!=": (a, b) => a !== b,
      "<": (a, b) => a < b, ">": (a, b) => a > b,
      "<=": (a, b) => a <= b, ">=": (a, b) => a >= b,
    };
    if (op in ops) return ops[op](left, right);
    throw new Error(`Operator '${op}' teu dipikawanoh.`);
  }

  execute(ast) {
    if (!ast) return;
    for (const stmt of ast) {
      this.checkSteps();
      if (this.returnFlag || this.breakFlag || this.continueFlag) break;
      this.executeStmt(stmt);
    }
  }

  executeStmt(stmt) {
    const kind = stmt[0];
    if (kind === "declare" || kind === "assign") {
      this.variables[stmt[1]] = this.evaluate(stmt[2]);
    } else if (kind === "member_assign") {
      const target = stmt[1];
      const val = this.evaluate(stmt[2]);
      if (target[0] === "member_get") {
        const obj = this.evaluate(target[1]);
        if (obj instanceof SundaInstance) {
          obj.fields[target[2]] = val;
        } else {
          throw new Error("Papasangan member ngan bisa dipaké dina objék.");
        }
      }
    } else if (kind === "print") {
      const expressions = stmt[1];
      const results = expressions.map(expr => {
        const v = this.evaluate(expr);
        if (v instanceof SundaInstance) return `<Objék ${v.cls.name}>`;
        if (v === true) return "leres";
        if (v === false) return "lepat";
        if (v === null) return "kosong";
        return String(v);
      });
      this.outputFn(results.join(" "));
    } else if (kind === "input") {
      const varName = stmt[1];
      const customPrompt = stmt[2];
      const promptText = customPrompt || `Mangga eusian ${varName}: `;
      let val = this.inputFn(promptText);
      if (val !== null && val !== "" && !isNaN(val)) {
        val = val.includes(".") ? parseFloat(val) : parseInt(val);
      }
      this.variables[varName] = val;
    } else if (kind === "if_chain") {
      const [, branches, elseBranch] = stmt;
      let executed = false;
      for (const [, condition, body] of branches) {
        if (this.evaluate(condition)) {
          this.execute(body);
          executed = true;
          break;
        }
      }
      if (!executed && elseBranch) this.execute(elseBranch);
    } else if (kind === "loop") {
      const [, varName, start, end, body] = stmt;
      const startVal = this.evaluate(start);
      const endVal = this.evaluate(end);
      for (let i = startVal; i <= endVal; i++) {
        this.variables[varName] = i;
        this.execute(body);
        if (this.returnFlag) break;
        if (this.breakFlag) { this.breakFlag = false; break; }
        if (this.continueFlag) { this.continueFlag = false; continue; }
      }
    } else if (kind === "while") {
      const [, condition, body] = stmt;
      while (this.evaluate(condition)) {
        this.execute(body);
        if (this.returnFlag) break;
        if (this.breakFlag) { this.breakFlag = false; break; }
        if (this.continueFlag) { this.continueFlag = false; continue; }
      }
    } else if (kind === "break") {
      this.breakFlag = true;
    } else if (kind === "continue") {
      this.continueFlag = true;
    } else if (kind === "function") {
      this.functions[stmt[1]] = [stmt[2], stmt[3]];
    } else if (kind === "class") {
      this.classes[stmt[1]] = new SundaClass(stmt[1], stmt[2], stmt[3]);
    } else if (kind === "try") {
      const [, tryBody, catchVar, catchBody, finallyBody] = stmt;
      try {
        this.execute(tryBody);
      } catch (e) {
        if (catchBody) {
          const localVars = { ...this.variables };
          localVars[catchVar || "kasalahan"] = e.message || e;
          const catchInterp = new SundaInterpreter(catchBody, localVars, this.functions, this.outputFn, this.inputFn, this.classes);
          catchInterp.interpret();
        } else {
          throw e;
        }
      } finally {
        if (finallyBody) this.execute(finallyBody);
      }
    } else if (kind === "throw") {
      const val = this.evaluate(stmt[1]);
      throw val;
    } else if (kind === "return") {
      this.returnValue = this.evaluate(stmt[1]);
      this.returnFlag = true;
    } else if (kind === "expr") {
      this.evaluate(stmt[1]);
    }
  }
}

// Main runner function
function runSundaCode(code, inputValues) {
  const output = [];
  let inputIdx = 0;

  const outputFn = (val) => {
    if (val === true) output.push("leres");
    else if (val === false) output.push("lepat");
    else output.push(String(val));
  };

  const inputFn = (promptText) => {
    if (inputIdx < inputValues.length) return inputValues[inputIdx++];
    if (typeof window !== "undefined" && window.prompt) {
      return window.prompt(promptText);
    }
    return null;
  };

  try {
    const lexer = new SundaLexer(code);
    const tokens = lexer.tokenize();
    const parser = new SundaParser(tokens);
    const ast = parser.parse();
    const interpreter = new SundaInterpreter(ast, {}, {}, outputFn, inputFn, {});
    interpreter.interpret();
    return { success: true, output };
  } catch (e) {
    return { success: false, output, error: e.message };
  }
}
