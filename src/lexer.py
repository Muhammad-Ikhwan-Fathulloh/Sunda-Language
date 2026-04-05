import re

class Lexer:
    def __init__(self, code):
        self.code = code.strip()

    def tokenize(self):
        tokens = [
            ("COMMENT", r"//.*"),
            ("KEYWORD_DECLARE", r"\b(nyieun|ngadeklarasikeun)\b"),
            ("KEYWORD_IF", r"\bupami\b"),
            ("KEYWORD_ELIF", r"\blamun\b"),
            ("KEYWORD_ELSE", r"\b(lainna|lain lamun)\b"),
            ("KEYWORD_PIKEUN", r"\bpikeun\b"),
            ("KEYWORD_WHILE", r"\bbari\b"),
            ("KEYWORD_TI", r"\bti\b"),
            ("KEYWORD_NEPI", r"\bnepi\b"),
            ("KEYWORD_BREAK", r"\beureun\b"),
            ("KEYWORD_CONTINUE", r"\bteraskeun\b"),
            ("KEYWORD_RUN", r"\bngajalankeun\b"),
            ("KEYWORD_END", r"\banggeus\b"),
            ("KEYWORD_PRINT", r"\btampilkeun\b"),
            ("KEYWORD_FUNC", r"\b(pungsi|fungsi)\b"),
            ("KEYWORD_RETURN", r"\bbalikkeun\b"),
            ("KEYWORD_INPUT", r"\b(tanya|mangga_eusian)\b"),
            ("KEYWORD_AND", r"\bjeung\b"),
            ("KEYWORD_OR", r"\batawa\b"),
            ("KEYWORD_NOT", r"\blain\b"),
            ("KEYWORD_NULL", r"\bkosong\b"),
            ("KEYWORD_TRY", r"\bcoba\b"),
            ("KEYWORD_CATCH", r"\bcekel\b"),
            ("KEYWORD_FINALLY", r"\btungtungna\b"),
            ("KEYWORD_THROW", r"\bbalangkeun\b"),
            ("KEYWORD_CLASS", r"\bkelas\b"),
            ("KEYWORD_THIS", r"\bieu\b"),
            ("KEYWORD_NEW", r"\banyar\b"),
            ("KEYWORD_EXTENDS", r"\bturunan\b"),
            ("BOOLEAN", r"\b(leres|lepat|true|false)\b"),
            ("NUMBER", r"\b\d+(\.\d+)?\b"),
            ("STRING", r'\"[^\"]*\"'),
            ("VARIABLE", r"[a-zA-Z_][a-zA-Z_0-9]*"),
            ("OPERATOR", r"==|!=|<=|>=|[+\-*/%=<>]"),
            ("DOT", r"\."),
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
            if kind == "SKIP" or kind == "COMMENT":
                continue
            elif kind == "MISMATCH":
                raise SyntaxError(f"Karakter teu dikenal: '{value}'")
            yield (kind, value)