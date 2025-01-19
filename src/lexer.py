import re

class Lexer:
    def __init__(self, code):
        self.code = code.strip()

    def tokenize(self):
        tokens = [
            ("KEYWORD_DECLARE", r"ngadeklarasikeun"),
            ("KEYWORD_IF", r"upami"),
            ("KEYWORD_ELSE", r"lain lamun"),
            ("KEYWORD_LOOP", r"pikeun"),
            ("KEYWORD_FUNC", r"fungsi"),
            ("KEYWORD_RUN", r"ngajalankeun"),
            ("VARIABLE", r"[a-zA-Z_][a-zA-Z_0-9]*"),
            ("NUMBER", r"\d+"),
            ("STRING", r"\".*?\""),
            ("OPERATOR", r"[+\-*/=]"),
            ("COLON", r":"),
            ("LPAREN", r"\("),
            ("RPAREN", r"\)"),
            ("LBRACE", r"\{"),
            ("RBRACE", r"\}"),
            ("SEMICOLON", r";"),
            ("NEWLINE", r"\n"),
            ("SKIP", r"[ \t\r\n]+"),  # Mengabaikan spasi dan newline
            ("MISMATCH", r"."),  # Catch-all untuk karakter yang tidak dikenali
        ]
        regex = "|".join(f"(?P<{name}>{pattern})" for name, pattern in tokens)
        regex = re.compile(regex)

        for match in regex.finditer(self.code):
            kind = match.lastgroup
            value = match.group(kind)
            if kind == "SKIP":
                continue
            elif kind == "MISMATCH":
                raise ValueError(f"Unexpected character: {value}")
            print(f"Lexer Token: ({kind}, {value})")  # Debugging token
            yield (kind, value)