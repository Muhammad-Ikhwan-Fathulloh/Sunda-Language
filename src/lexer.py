import re

class Lexer:
    def __init__(self, code):
        self.code = code.strip()

    def tokenize(self):
        tokens = [
            ("KEYWORD_DECLARE", r"\b(nyieun|ngadeklarasikeun)\b"),
            ("KEYWORD_IF", r"\bupami\b"),
            ("KEYWORD_ELIF", r"\blamun\b"),
            ("KEYWORD_ELSE", r"\b(lainna|lain lamun)\b"),
            ("KEYWORD_LOOP", r"\bpikeun\b"),
            ("KEYWORD_WHILE", r"\bbari\b"),
            ("KEYWORD_RUN", r"\bngajalankeun\b"),
            ("KEYWORD_END", r"\banggeus\b"),
            ("KEYWORD_PRINT", r"\btampilkeun\b"),
            ("KEYWORD_FUNC", r"\bfungsi\b"),
            ("KEYWORD_RETURN", r"\bbalikkeun\b"),
            ("KEYWORD_INPUT", r"\b(tanya|mangga_eusian)\b"),
            ("BOOLEAN", r"\b(leres|lepat|true|false)\b"),
            ("NUMBER", r"\b\d+(\.\d+)?\b"),
            ("STRING", r'\"[^\"]*\"'),
            ("VARIABLE", r"[a-zA-Z_][a-zA-Z_0-9]*"),
            ("OPERATOR", r"(==|!=|<=|>=|[+\-*/%=<>])"),
            ("COLON", r":"),
            ("LPAREN", r"\("),
            ("RPAREN", r"\)"),
            ("LBRACKET", r"\["),
            ("RBRACKET", r"\]"),
            ("COMMA", r","),
            ("SEMICOLON", r";"),
            ("SKIP", r"[ \t\r\n]+"),
            ("MISMATCH", r"."),
        ]

        regex = "|".join(f"(?P<{name}>{pattern})" for name, pattern in tokens)
        pattern = re.compile(regex)

        for match in pattern.finditer(self.code):
            kind = match.lastgroup
            value = match.group()
            if kind == "SKIP":
                continue
            elif kind == "MISMATCH":
                raise SyntaxError(f"Karakter teu dikenal: '{value}'")
            yield (kind, value)