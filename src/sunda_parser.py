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
            try:
                statements.append(self.statement())
            except SyntaxError as e:
                self.next_token()
        return statements

    def statement(self):
        if not self.current_token:
            raise SyntaxError("Unexpected end of input")
        kind, value = self.current_token
        if kind == "KEYWORD_DECLARE":
            return self.declare()
        elif kind == "KEYWORD_IF":
            return self.if_statement()
        elif kind == "KEYWORD_ELIF":  # handled inside if_statement
            raise SyntaxError("'lamun' must appear after 'upami'")
        elif kind == "KEYWORD_ELSE":  # handled inside if_statement
            raise SyntaxError("'lain lamun' must appear after 'upami'")
        elif kind == "KEYWORD_LOOP":
            return self.loop_statement()
        elif kind == "KEYWORD_PRINT":
            return self.print_statement()
        else:
            raise SyntaxError(f"Unexpected token: {value}")

    def declare(self):
        self.next_token()
        if not self.current_token or self.current_token[0] != "VARIABLE":
            raise SyntaxError("Expected variable name after declaration")
        var_name = self.current_token[1]
        self.next_token()
        if not self.current_token or self.current_token[1] != "=":
            raise SyntaxError("Expected '=' after variable name")
        self.next_token()
        if not self.current_token or self.current_token[0] not in ("NUMBER", "STRING", "VARIABLE"):
            raise SyntaxError("Expected value after '='")
        value = self.current_token[1]
        self.next_token()
        if not self.current_token or self.current_token[0] != "SEMICOLON":
            raise SyntaxError("Expected ';' after value")
        self.next_token()
        return ("declare", var_name, value)

    def print_statement(self):
        self.next_token()
        if not self.current_token or self.current_token[0] not in ("STRING", "VARIABLE"):
            raise SyntaxError("Expected string or variable after 'tampilkeun'")
        value = self.current_token[1]
        self.next_token()
        if self.current_token and self.current_token[0] == "SEMICOLON":
            self.next_token()
        return ("print", value)

    def if_statement(self):
        self.next_token()
        condition_tokens = []
        while self.current_token and self.current_token[0] != "COLON":
            condition_tokens.append(self.current_token[1])
            self.next_token()
        if not self.current_token or self.current_token[0] != "COLON":
            raise SyntaxError("Expected ':' after condition")
        self.next_token()

        branches = []
        true_branch = []
        while self.current_token and self.current_token[0] not in ("KEYWORD_ELIF", "KEYWORD_ELSE", "KEYWORD_DECLARE", "KEYWORD_IF", "KEYWORD_LOOP", "KEYWORD_PRINT"):
            true_branch.append(self.statement())
        branches.append(("if", " ".join(condition_tokens), true_branch))

        while self.current_token and self.current_token[0] == "KEYWORD_ELIF":
            self.next_token()
            elif_condition = []
            while self.current_token and self.current_token[0] != "COLON":
                elif_condition.append(self.current_token[1])
                self.next_token()
            if not self.current_token or self.current_token[0] != "COLON":
                raise SyntaxError("Expected ':' after 'lamun'")
            self.next_token()
            elif_body = []
            while self.current_token and self.current_token[0] not in ("KEYWORD_ELIF", "KEYWORD_ELSE", "KEYWORD_DECLARE", "KEYWORD_IF", "KEYWORD_LOOP", "KEYWORD_PRINT"):
                elif_body.append(self.statement())
            branches.append(("elif", " ".join(elif_condition), elif_body))

        else_branch = []
        if self.current_token and self.current_token[0] == "KEYWORD_ELSE":
            self.next_token()
            if self.current_token and self.current_token[0] == "COLON":
                self.next_token()
            while self.current_token and self.current_token[0] not in ("KEYWORD_DECLARE", "KEYWORD_IF", "KEYWORD_LOOP", "KEYWORD_PRINT"):
                else_branch.append(self.statement())

        return ("if_chain", branches, else_branch)

    def loop_statement(self):
        self.next_token()
        if not self.current_token or self.current_token[0] != "VARIABLE":
            raise SyntaxError("Expected variable name after 'pikeun'")
        loop_var = self.current_token[1]
        self.next_token()
        if not self.current_token or self.current_token[1] != "=":
            raise SyntaxError("Expected '=' after loop variable")
        self.next_token()
        if not self.current_token or self.current_token[0] not in ("NUMBER", "VARIABLE"):
            raise SyntaxError("Expected start value after '='")
        start_value = self.current_token[1]
        self.next_token()
        if not self.current_token or self.current_token[1] != "TI":
            raise SyntaxError("Expected 'TI' after start value")
        self.next_token()
        if not self.current_token or self.current_token[0] not in ("NUMBER", "VARIABLE"):
            raise SyntaxError("Expected end value after 'TI'")
        end_value = self.current_token[1]
        self.next_token()
        if not self.current_token or self.current_token[0] != "KEYWORD_RUN":
            raise SyntaxError("Expected 'ngajalankeun' keyword")
        self.next_token()

        body = []
        while self.current_token and self.current_token[0] not in ("KEYWORD_DECLARE", "KEYWORD_IF", "KEYWORD_LOOP", "KEYWORD_PRINT"):
            body.append(self.statement())

        return ("loop", loop_var, start_value, end_value, body)