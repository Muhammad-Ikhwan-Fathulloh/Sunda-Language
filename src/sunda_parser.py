class Parser:
    def __init__(self, tokens):
        self.tokens = list(tokens)
        self.pos = 0

    def current_token(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def eat(self, expected_kind=None):
        token = self.current_token()
        if not token:
            raise SyntaxError("Unexpected end of input")
        if expected_kind and token[0] != expected_kind:
            raise SyntaxError(f"Expected {expected_kind}, got {token[0]} '{token[1]}'")
        self.pos += 1
        return token

    def parse(self):
        statements = []
        while self.current_token():
            statements.append(self.statement())
        return statements

    def statement(self):
        token = self.current_token()
        if not token: return None
        kind, value = token

        if kind == "KEYWORD_DECLARE":
            return self.declare_stmt()
        elif kind == "KEYWORD_PRINT":
            return self.print_stmt()
        elif kind == "KEYWORD_INPUT":
            return self.input_stmt()
        elif kind == "KEYWORD_IF":
            return self.if_stmt()
        elif kind == "KEYWORD_LOOP":
            return self.loop_stmt()
        elif kind == "KEYWORD_WHILE":
            return self.while_stmt()
        elif kind == "KEYWORD_FUNC":
            return self.func_stmt()
        elif kind == "KEYWORD_RETURN":
            return self.return_stmt()
        elif kind == "VARIABLE":
            # Lookahead: if next token is '=' → assignment, else → expression statement (function call)
            next_tok = self.tokens[self.pos + 1] if self.pos + 1 < len(self.tokens) else None
            if next_tok and next_tok[0] == "OPERATOR" and next_tok[1] == "=":
                return self.assignment_stmt()
            else:
                return self.expr_stmt()
        else:
            raise SyntaxError(f"Sintaks teu dikenal: {value}")

    def declare_stmt(self):
        self.eat("KEYWORD_DECLARE")
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR") # '='
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("declare", var_name, expr)

    def assignment_stmt(self):
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR") # '='
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("assign", var_name, expr)

    def expr_stmt(self):
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("expr", expr)

    def print_stmt(self):
        self.eat("KEYWORD_PRINT")
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("print", expr)

    def input_stmt(self):
        self.eat("KEYWORD_INPUT")
        var_name = self.eat("VARIABLE")[1]
        self.eat("SEMICOLON")
        return ("input", var_name)

    def if_stmt(self):
        self.eat("KEYWORD_IF")
        condition = self.expression()
        self.eat("COLON")
        body = self.block()
        branches = [("if", condition, body)]

        while self.current_token() and self.current_token()[0] == "KEYWORD_ELIF":
            self.eat("KEYWORD_ELIF")
            elif_cond = self.expression()
            self.eat("COLON")
            elif_body = self.block()
            branches.append(("elif", elif_cond, elif_body))

        else_branch = None
        if self.current_token() and self.current_token()[0] == "KEYWORD_ELSE":
            self.eat("KEYWORD_ELSE")
            self.eat("COLON")
            else_branch = self.block()

        self.eat("KEYWORD_END")
        return ("if_chain", branches, else_branch)

    def loop_stmt(self):
        self.eat("KEYWORD_LOOP")
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR") # '='
        start_expr = self.expression()
        ti_token = self.eat("VARIABLE")
        if ti_token[1].lower() != "ti":
            raise SyntaxError("Expected 'ti' in loop")
        end_expr = self.expression()
        self.eat("KEYWORD_RUN")
        body = self.block()
        self.eat("KEYWORD_END")
        return ("loop", var_name, start_expr, end_expr, body)

    def while_stmt(self):
        self.eat("KEYWORD_WHILE")
        condition = self.expression()
        self.eat("KEYWORD_RUN")
        body = self.block()
        self.eat("KEYWORD_END")
        return ("while", condition, body)

    def func_stmt(self):
        self.eat("KEYWORD_FUNC")
        name = self.eat("VARIABLE")[1]
        self.eat("LPAREN")
        params = []
        if self.current_token() and self.current_token()[0] == "VARIABLE":
            params.append(self.eat("VARIABLE")[1])
            while self.current_token() and self.current_token()[0] == "COMMA":
                self.eat("COMMA")
                params.append(self.eat("VARIABLE")[1])
        self.eat("RPAREN")
        self.eat("COLON")
        body = self.block()
        self.eat("KEYWORD_END")
        return ("function", name, params, body)

    def return_stmt(self):
        self.eat("KEYWORD_RETURN")
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("return", expr)

    def block(self):
        statements = []
        while self.current_token() and self.current_token()[0] not in ("KEYWORD_END", "KEYWORD_ELIF", "KEYWORD_ELSE"):
            statements.append(self.statement())
        return statements

    def expression(self):
        return self.logical_or()

    def logical_or(self):
        node = self.logical_and()
        # simplified for now, can add 'atawa' keyword later
        return node

    def logical_and(self):
        node = self.comparison()
        # simplified for now, can add 'jeung' keyword later
        return node

    def comparison(self):
        node = self.arithmetic()
        while self.current_token() and self.current_token()[0] == "OPERATOR" and self.current_token()[1] in ("==", "!=", "<", ">", "<=", ">="):
            op = self.eat("OPERATOR")[1]
            right = self.arithmetic()
            node = ("binop", node, op, right)
        return node

    def arithmetic(self):
        node = self.term()
        while self.current_token() and self.current_token()[0] == "OPERATOR" and self.current_token()[1] in ("+", "-"):
            op = self.eat("OPERATOR")[1]
            right = self.term()
            node = ("binop", node, op, right)
        return node

    def term(self):
        node = self.factor()
        while self.current_token() and self.current_token()[0] == "OPERATOR" and self.current_token()[1] in ("*", "/", "%"):
            op = self.eat("OPERATOR")[1]
            right = self.factor()
            node = ("binop", node, op, right)
        return node

    def factor(self):
        token = self.eat()
        kind, value = token
        if kind == "NUMBER":
            return ("number", float(value) if "." in value else int(value))
        elif kind == "STRING":
            return ("string", value[1:-1])
        elif kind == "BOOLEAN":
            return ("boolean", value in ("leres", "true"))
        elif kind == "VARIABLE":
            if self.current_token() and self.current_token()[0] == "LPAREN":
                self.eat("LPAREN")
                args = []
                if self.current_token() and self.current_token()[0] != "RPAREN":
                    args.append(self.expression())
                    while self.current_token() and self.current_token()[0] == "COMMA":
                        self.eat("COMMA")
                        args.append(self.expression())
                self.eat("RPAREN")
                return ("call", value, args)
            return ("variable", value)
        elif kind == "LPAREN":
            node = self.expression()
            self.eat("RPAREN")
            return node
        elif kind == "OPERATOR" and value == "-":
            return ("unop", "-", self.factor())
        else:
            raise SyntaxError(f"Teu bisa ngaevaluasi: {value}")
