class Parser:
    def __init__(self, tokens):
        self.tokens = iter(tokens)
        self.current_token = None
        self.next_token()

    def next_token(self):
        try:
            self.current_token = next(self.tokens)
        except StopIteration:
            self.current_token = None

    def parse(self):
        statements = []
        while self.current_token:
            statements.append(self.statement())
        return statements

    def match(self, expected_kind):
        if self.current_token and self.current_token[0] == expected_kind:
            value = self.current_token[1]
            self.next_token()
            return value
        else:
            raise SyntaxError(f"Expected {expected_kind}, got {self.current_token}")

    def statement(self):
        if not self.current_token:
            raise SyntaxError("Unexpected end of input")

        kind, value = self.current_token

        if kind == "KEYWORD_DECLARE":
            return self.declare()
        elif kind == "KEYWORD_IF":
            return self.if_statement()
        elif kind == "KEYWORD_LOOP":
            return self.loop_statement()
        elif kind == "KEYWORD_PRINT":
            return self.print_statement()
        elif kind == "KEYWORD_INPUT":
            return self.input_stmt()
        elif kind == "KEYWORD_WHILE":
            return self.while_stmt()
        elif kind == "KEYWORD_FUNC":
            return self.func_stmt()
        elif kind == "KEYWORD_RETURN":
            return self.return_stmt()
        else:
            raise SyntaxError(f"Unexpected token {self.current_token}")

    def declare(self):
        self.next_token()
        var = self.match("VARIABLE")
        self.match("OPERATOR")  # '='
        expr = self.expression()
        self.match("SEMICOLON")
        return ("declare", var, expr)

    def print_statement(self):
        self.next_token()
        value = self.expression()
        self.match("SEMICOLON")
        return ("print", value)

    def input_stmt(self):
        self.next_token()
        varname = self.match("VARIABLE")
        self.match("SEMICOLON")
        return ("input", varname)

    def if_statement(self):
        self.next_token()
        condition = self.expression()
        self.match("COLON")
        body = self.block()
        branches = [("if", condition, body)]

        while self.current_token and self.current_token[0] == "KEYWORD_ELIF":
            self.next_token()
            elif_cond = self.expression()
            self.match("COLON")
            elif_body = self.block()
            branches.append(("elif", elif_cond, elif_body))

        else_branch = []
        if self.current_token and self.current_token[0] == "KEYWORD_ELSE":
            self.next_token()
            self.match("COLON")
            else_branch = self.block()

        return ("if_chain", branches, else_branch)

    def loop_statement(self):
        self.next_token()
        var = self.match("VARIABLE")
        self.match("OPERATOR")  # '='
        start = self.expression()
        self.match("VARIABLE")  # 'ti'
        end = self.expression()
        self.match("KEYWORD_RUN")
        body = self.block()
        return ("loop", var, start, end, body)

    def while_stmt(self):
        self.next_token()
        condition = self.expression()
        self.match("COLON")
        body = self.block()
        return ("while", condition, body)

    def func_stmt(self):
        self.next_token()
        func_name = self.match("VARIABLE")
        self.match("COLON")
        body = self.block()
        return ("function", func_name, body)

    def return_stmt(self):
        self.next_token()
        value = self.expression()
        self.match("SEMICOLON")
        return ("return", value)

    def block(self):
        stmts = []
        while self.current_token and self.current_token[0] not in (
            "KEYWORD_ELIF", "KEYWORD_ELSE", "KEYWORD_IF", "KEYWORD_LOOP",
            "KEYWORD_WHILE", "KEYWORD_DECLARE", "KEYWORD_PRINT",
            "KEYWORD_INPUT", "KEYWORD_FUNC", "KEYWORD_RETURN"
        ):
            stmts.append(self.statement())
        return stmts

    def expression(self):
        expr = []
        while self.current_token and self.current_token[0] not in ("SEMICOLON", "COLON"):
            expr.append(self.current_token[1])
            self.next_token()
        return " ".join(expr)