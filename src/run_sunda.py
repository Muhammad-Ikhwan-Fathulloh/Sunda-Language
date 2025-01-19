import sys
import os
from lexer import Lexer
from sunda_parser import Parser
from interpreter import Interpreter

def main():
    if len(sys.argv) < 2:
        print("Gunakan: run sunda <nama_file>.sunda")
        sys.exit(1)

    filename = sys.argv[1]

    if not os.path.exists(filename):
        print(f"File {filename} tidak ditemukan!")
        sys.exit(1)

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

if __name__ == "__main__":
    main()