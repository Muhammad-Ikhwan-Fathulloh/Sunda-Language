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
      ["KEYWORD_LOOP", /\bpikeun\b/],
      ["KEYWORD_WHILE", /\bbari\b/],
      ["KEYWORD_RUN", /\bngajalankeun\b/],
      ["KEYWORD_END", /\banggeus\b/],
      ["KEYWORD_PRINT", /\btampilkeun\b/],
      ["KEYWORD_FUNC", /\b(?:pungsi|fungsi)\b/],
      ["KEYWORD_RETURN", /\bbalikkeun\b/],
      ["KEYWORD_INPUT", /\b(tanya|mangga_eusian)\b/],
      ["BOOLEAN", /\b(leres|lepat|true|false)\b/],
      ["NUMBER", /\b\d+(\.\d+)?\b/],
      ["STRING", /"[^"]*"/],
      ["VARIABLE", /[a-zA-Z_][a-zA-Z_0-9]*/],
      ["OPERATOR", /(==|!=|<=|>=|[+\-*/%=<>])/],
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
    if (kind === "KEYWORD_LOOP") return this.loopStmt();
    if (kind === "KEYWORD_WHILE") return this.whileStmt();
    if (kind === "KEYWORD_FUNC") return this.funcStmt();
    if (kind === "KEYWORD_RETURN") return this.returnStmt();
    if (kind === "VARIABLE") {
      const next = this.pos + 1 < this.tokens.length ? this.tokens[this.pos + 1] : null;
      if (next && next[0] === "OPERATOR" && next[1] === "=") return this.assignmentStmt();
      return this.exprStmt();
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

  printStmt() {
    this.eat("KEYWORD_PRINT");
    const expr = this.expression();
    this.eat("SEMICOLON");
    return ["print", expr];
  }

  inputStmt() {
    this.eat("KEYWORD_INPUT");
    const varName = this.eat("VARIABLE")[1];
    this.eat("SEMICOLON");
    return ["input", varName];
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
    this.eat("KEYWORD_LOOP");
    const varName = this.eat("VARIABLE")[1];
    this.eat("OPERATOR");
    const startExpr = this.expression();
    const tiToken = this.eat("VARIABLE");
    if (tiToken[1].toLowerCase() !== "ti") throw new SyntaxError("Expected 'ti' in loop");
    const endExpr = this.expression();
    this.eat("KEYWORD_RUN");
    const body = this.block();
    this.eat("KEYWORD_END");
    return ["loop", varName, startExpr, endExpr, body];
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

  block() {
    const statements = [];
    const stopTokens = ["KEYWORD_END", "KEYWORD_ELIF", "KEYWORD_ELSE"];
    while (this.currentToken() && !stopTokens.includes(this.currentToken()[0])) {
      statements.push(this.statement());
    }
    return statements;
  }

  expression() { return this.comparison(); }

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
    if (kind === "VARIABLE") {
      if (this.currentToken() && this.currentToken()[0] === "LPAREN") {
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
        return ["call", value, args];
      }
      return ["variable", value];
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

class SundaInterpreter {
  constructor(ast, variables, functions, outputFn, inputFn) {
    this.ast = ast;
    this.variables = variables || {};
    this.functions = functions || {};
    this.outputFn = outputFn || console.log;
    this.inputFn = inputFn || (() => "");
    this.returnFlag = false;
    this.returnValue = null;
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
    if (kind === "variable") {
      const name = node[1];
      if (name in this.variables) return this.variables[name];
      throw new Error(`Variabel '${name}' teu kapanggih.`);
    }
    if (kind === "binop") {
      const left = this.evaluate(node[1]);
      const op = node[2];
      const right = this.evaluate(node[3]);
      return this.applyOp(left, op, right);
    }
    if (kind === "unop") {
      const val = this.evaluate(node[2]);
      if (node[1] === "-") return -val;
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
      const funcInterp = new SundaInterpreter(funcBody, localVars, this.functions, this.outputFn, this.inputFn);
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
    for (const stmt of ast) {
      this.checkSteps();
      if (this.returnFlag) break;
      const kind = stmt[0];

      if (kind === "declare" || kind === "assign") {
        this.variables[stmt[1]] = this.evaluate(stmt[2]);
      } else if (kind === "print") {
        const val = this.evaluate(stmt[1]);
        this.outputFn(val);
      } else if (kind === "input") {
        this.variables[stmt[1]] = this.inputFn(`Mangga eusian ${stmt[1]}: `);
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
        }
      } else if (kind === "while") {
        const [, condition, body] = stmt;
        while (this.evaluate(condition)) {
          this.execute(body);
          if (this.returnFlag) break;
        }
      } else if (kind === "function") {
        this.functions[stmt[1]] = [stmt[2], stmt[3]];
      } else if (kind === "return") {
        this.returnValue = this.evaluate(stmt[1]);
        this.returnFlag = true;
      } else if (kind === "expr") {
        this.evaluate(stmt[1]);
      }
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

  const inputFn = (prompt) => {
    if (inputIdx < inputValues.length) return inputValues[inputIdx++];
    return prompt(prompt);
  };

  try {
    const lexer = new SundaLexer(code);
    const tokens = lexer.tokenize();
    const parser = new SundaParser(tokens);
    const ast = parser.parse();
    const interpreter = new SundaInterpreter(ast, {}, {}, outputFn, inputFn);
    interpreter.interpret();
    return { success: true, output };
  } catch (e) {
    return { success: false, output, error: e.message };
  }
}
