import sys
from lexer import Lexer
from sunda_parser import Parser
from interpreter import Interpreter

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Gunakan: python main.py <nama_file>.sunda")
        sys.exit(1)

    filename = sys.argv[1]
    with open(filename, "r", encoding="utf-8") as f:
        code = f.read()

    # Step 1: Lexical Analysis
    lexer = Lexer(code)
    tokens = lexer.tokenize()

    # Step 2: Parsing
    parser = Parser(tokens)
    ast = parser.parse()

    # Step 3: Interpretation
    interpreter = Interpreter(ast)
    interpreter.interpret()