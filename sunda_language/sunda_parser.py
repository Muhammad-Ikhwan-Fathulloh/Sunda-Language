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
        if not token:
            return None
        kind, value = token

        if kind == "KEYWORD_DECLARE":
            return self.declare_stmt()
        elif kind == "KEYWORD_PRINT":
            return self.print_stmt()
        elif kind == "KEYWORD_INPUT":
            return self.input_stmt()
        elif kind == "KEYWORD_IF":
            return self.if_stmt()
        elif kind == "KEYWORD_PIKEUN":
            return self.loop_stmt()
        elif kind == "KEYWORD_WHILE":
            return self.while_stmt()
        elif kind == "KEYWORD_BREAK":
            return self.break_stmt()
        elif kind == "KEYWORD_CONTINUE":
            return self.continue_stmt()
        elif kind == "KEYWORD_FUNC":
            return self.func_stmt()
        elif kind == "KEYWORD_RETURN":
            return self.return_stmt()
        elif kind == "KEYWORD_CLASS":
            return self.class_stmt()
        elif kind == "KEYWORD_TRY":
            return self.try_stmt()
        elif kind == "KEYWORD_THROW":
            return self.throw_stmt()
        elif kind == "VARIABLE":
            if self.pos + 1 < len(self.tokens):
                next_tok = self.tokens[self.pos + 1]
                if next_tok[0] == "OPERATOR" and next_tok[1] == "=":
                    return self.assignment_stmt()
                if next_tok[0] == "DOT":
                    return self.member_assignment_stmt()
            return self.expr_stmt()
        elif kind == "KEYWORD_THIS":
            if self.pos + 1 < len(self.tokens):
                next_tok = self.tokens[self.pos + 1]
                if next_tok[0] == "DOT":
                    return self.member_assignment_stmt()
            return self.expr_stmt()
        else:
            raise SyntaxError(f"Sintaks teu dikenal: {value}")

    def declare_stmt(self):
        self.eat("KEYWORD_DECLARE")
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR")  # Expect '='
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("declare", var_name, expr)

    def assignment_stmt(self):
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR")  # Expect '='
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("assign", var_name, expr)

    def expr_stmt(self):
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("expr", expr)

    def member_assignment_stmt(self):
        target = self.member_access()
        if self.current_token() and self.current_token()[0] == "OPERATOR" and self.current_token()[1] == "=":
            self.eat("OPERATOR")
            expr = self.expression()
            self.eat("SEMICOLON")
            return ("member_assign", target, expr)
        self.eat("SEMICOLON")
        return ("expr", target)

    def print_stmt(self):
        self.eat("KEYWORD_PRINT")
        expressions = []
        expressions.append(self.expression())
        while self.current_token() and self.current_token()[0] == "COMMA":
            self.eat("COMMA")
            expressions.append(self.expression())
        self.eat("SEMICOLON")
        return ("print", expressions)

    def input_stmt(self):
        self.eat("KEYWORD_INPUT")
        prompt = None
        if self.current_token() and self.current_token()[0] == "STRING":
            prompt = self.eat("STRING")[1][1:-1]
            if self.current_token() and self.current_token()[0] == "COMMA":
                self.eat("COMMA")
        var_name = self.eat("VARIABLE")[1]
        self.eat("SEMICOLON")
        return ("input", var_name, prompt)

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
        self.eat("KEYWORD_PIKEUN")
        var_name = self.eat("VARIABLE")[1]
        self.eat("OPERATOR")  # '='
        start_expr = self.expression()
        self.eat("KEYWORD_TI")
        end_expr = self.expression()
        self.eat("KEYWORD_RUN")
        body = self.block()
        self.eat("KEYWORD_END")
        return ("loop", var_name, start_expr, end_expr, body)

    def break_stmt(self):
        self.eat("KEYWORD_BREAK")
        self.eat("SEMICOLON")
        return ("break",)

    def continue_stmt(self):
        self.eat("KEYWORD_CONTINUE")
        self.eat("SEMICOLON")
        return ("continue",)

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

    def class_stmt(self):
        self.eat("KEYWORD_CLASS")
        name = self.eat("VARIABLE")[1]
        parent = None
        if self.current_token() and self.current_token()[0] == "KEYWORD_EXTENDS":
            self.eat("KEYWORD_EXTENDS")
            parent = self.eat("VARIABLE")[1]
        self.eat("COLON")
        body = []
        while self.current_token() and self.current_token()[0] != "KEYWORD_END":
            tok = self.current_token()
            if tok[0] == "KEYWORD_DECLARE":
                stmt = self.declare_stmt()
                body.append(("property", stmt[1], stmt[2]))
            elif tok[0] == "KEYWORD_FUNC":
                body.append(self.func_stmt())
            else:
                self.eat()  # Skip/Ignore
        self.eat("KEYWORD_END")
        return ("class", name, parent, body)

    def try_stmt(self):
        self.eat("KEYWORD_TRY")
        self.eat("COLON")
        try_body = self.block()
        catch_var = None
        catch_body = None
        if self.current_token() and self.current_token()[0] == "KEYWORD_CATCH":
            self.eat("KEYWORD_CATCH")
            catch_var = self.eat("VARIABLE")[1]
            self.eat("COLON")
            catch_body = self.block()
        finally_body = None
        if self.current_token() and self.current_token()[0] == "KEYWORD_FINALLY":
            self.eat("KEYWORD_FINALLY")
            self.eat("COLON")
            finally_body = self.block()
        self.eat("KEYWORD_END")
        return ("try", try_body, catch_var, catch_body, finally_body)

    def throw_stmt(self):
        self.eat("KEYWORD_THROW")
        expr = self.expression()
        self.eat("SEMICOLON")
        return ("throw", expr)

    def block(self):
        statements = []
        stop_tokens = ("KEYWORD_END", "KEYWORD_ELIF", "KEYWORD_ELSE", "KEYWORD_CATCH", "KEYWORD_FINALLY")
        while self.current_token() and self.current_token()[0] not in stop_tokens:
            statements.append(self.statement())
        return statements

    def expression(self):
        return self.logical_or()

    def member_access(self):
        if self.current_token()[0] == "KEYWORD_THIS":
            self.eat("KEYWORD_THIS")
            node = ("this",)
        else:
            token = self.eat("VARIABLE")
            node = ("variable", token[1])
            if self.current_token() and self.current_token()[0] == "LPAREN":
                self.eat("LPAREN")
                args = self.parse_args()
                self.eat("RPAREN")
                node = ("call", token[1], args)

        while self.current_token() and self.current_token()[0] == "DOT":
            self.eat("DOT")
            member = self.eat("VARIABLE")[1]
            if self.current_token() and self.current_token()[0] == "LPAREN":
                self.eat("LPAREN")
                args = self.parse_args()
                self.eat("RPAREN")
                node = ("member_call", node, member, args)
            else:
                node = ("member_get", node, member)
        return node

    def parse_args(self):
        args = []
        if self.current_token() and self.current_token()[0] != "RPAREN":
            args.append(self.expression())
            while self.current_token() and self.current_token()[0] == "COMMA":
                self.eat("COMMA")
                args.append(self.expression())
        return args

    def logical_or(self):
        node = self.logical_and()
        while self.current_token() and self.current_token()[0] == "KEYWORD_OR":
            self.eat("KEYWORD_OR")
            right = self.logical_and()
            node = ("binop", node, "or", right)
        return node

    def logical_and(self):
        node = self.comparison()
        while self.current_token() and self.current_token()[0] == "KEYWORD_AND":
            self.eat("KEYWORD_AND")
            right = self.comparison()
            node = ("binop", node, "and", right)
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
        elif kind == "KEYWORD_NULL":
            return ("null", None)
        elif kind == "VARIABLE" or kind == "KEYWORD_THIS":
            self.pos -= 1
            return self.member_access()
        elif kind == "KEYWORD_NOT":
            return ("unop", "not", self.factor())
        elif kind == "KEYWORD_NEW":
            cls_name = self.eat("VARIABLE")[1]
            self.eat("LPAREN")
            args = []
            if self.current_token() and self.current_token()[0] != "RPAREN":
                args.append(self.expression())
                while self.current_token() and self.current_token()[0] == "COMMA":
                    self.eat("COMMA")
                    args.append(self.expression())
            self.eat("RPAREN")
            return ("new", cls_name, args)
        elif kind == "LPAREN":
            node = self.expression()
            self.eat("RPAREN")
            return node
        elif kind == "OPERATOR" and value == "-":
            return ("unop", "-", self.factor())
        else:
            raise SyntaxError(f"Teu bisa ngaevaluasi: {value}")
