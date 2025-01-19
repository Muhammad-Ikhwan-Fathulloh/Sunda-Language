class Parser:
    def __init__(self, tokens):
        self.tokens = iter(tokens)
        self.current_token = None
        self.next_token()

    def next_token(self):
        try:
            self.current_token = next(self.tokens)
            print(f"Parser: Current Token -> {self.current_token}")  # Debugging
        except StopIteration:
            self.current_token = None
            print("Parser: No more tokens")

    def parse(self):
        statements = []
        while self.current_token:
            try:
                statements.append(self.statement())
            except SyntaxError as e:
                print(f"Syntax Error: {e}")
                self.next_token()  # Skip problematic token
        return statements

    def statement(self):
        if not self.current_token:
            raise SyntaxError("Unexpected end of input")
        kind, value = self.current_token
        if kind == "KEYWORD_DECLARE":
            return self.declare()
        elif kind == "KEYWORD_IF":
            return self.if_statement()
        elif kind == "KEYWORD_LOOP":
            return self.loop_statement()  # Menambahkan method untuk loop
        else:
            raise SyntaxError(f"Unexpected token: {value}")

    def declare(self):
        self.next_token()  # Skip 'ngadeklarasikeun'
        if not self.current_token or self.current_token[0] != "VARIABLE":
            raise SyntaxError("Expected variable name after 'ngadeklarasikeun'")
        var_name = self.current_token[1]
        self.next_token()  # Skip variable name
        if not self.current_token or self.current_token[1] != "=":
            raise SyntaxError("Expected '=' after variable declaration")
        self.next_token()  # Skip '='
        if not self.current_token or self.current_token[0] not in ("NUMBER", "STRING"):
            raise SyntaxError("Expected a value after '='")
        value = self.current_token[1]
        self.next_token()  # Skip value
        if not self.current_token or self.current_token[0] != "SEMICOLON":
            raise SyntaxError("Expected ';' after declaration")
        self.next_token()  # Skip ';'
        print(f"Ngadeklarasikeun: {var_name} = {value}")
        return ("declare", var_name, value)

    def if_statement(self):
        self.next_token()  # Skip 'upami'
        if not self.current_token or self.current_token[0] not in ("VARIABLE", "NUMBER"):
            raise SyntaxError("Expected condition after 'upami'")
        condition = self.current_token[1]
        self.next_token()  # Skip condition
        if not self.current_token or self.current_token[0] != "COLON":
            raise SyntaxError("Expected ':' after condition")
        self.next_token()  # Skip ':'
        body = []
        while self.current_token and self.current_token[0] != "KEYWORD_ELSE":
            body.append(self.statement())
        print(f"If Statement Parsed: condition={condition}, body={body}")
        return ("if", condition, body)

    def loop_statement(self):
        self.next_token()  # Skip 'pikeun'
        if not self.current_token or self.current_token[0] != "VARIABLE":
            raise SyntaxError("Expected variable name after 'pikeun'")
        loop_var = self.current_token[1]
        self.next_token()  # Skip variable name
        if not self.current_token or self.current_token[1] != "=":
            raise SyntaxError("Expected '=' after loop variable")
        self.next_token()  # Skip '='
        if not self.current_token or self.current_token[0] not in ("NUMBER", "VARIABLE"):
            raise SyntaxError("Expected start value after '='")
        start_value = self.current_token[1]
        self.next_token()  # Skip start value
        if not self.current_token or self.current_token[1] != "TI":
            raise SyntaxError("Expected 'TI' after start value in loop")
        self.next_token()  # Skip 'TI'
        if not self.current_token or self.current_token[0] not in ("NUMBER", "VARIABLE"):
            raise SyntaxError("Expected end value after 'TI'")
        end_value = self.current_token[1]
        self.next_token()  # Skip end value
        if not self.current_token or self.current_token[0] != "KEYWORD_RUN":
            raise SyntaxError("Expected 'ngajalankeun' for loop execution")
        self.next_token()  # Skip 'ngajalankeun'

        body = []
        while self.current_token and self.current_token[0] != "KEYWORD_ELSE":
            body.append(self.statement())

        # Menghitung dan menjalankan iterasi berdasarkan start_value dan end_value
        start_val = int(start_value) if start_value.isdigit() else 0
        end_val = int(end_value) if end_value.isdigit() else 0

        # Loop sesuai dengan rentang start_value hingga end_value
        loop_count = 0
        loop_result = []
        while start_val <= end_val:
            loop_count += 1
            print(f"Loop {loop_count}: {loop_var} = {start_val}")  # Debugging
            loop_result.append(f"{loop_var} = {start_val}")
            start_val += 1

        print(f"Loop Statement Parsed: variable={loop_var}, start_value={start_value}, end_value={end_value}, body={body}, iterations={loop_count}")
        return ("loop", loop_var, start_value, end_value, body, loop_result)