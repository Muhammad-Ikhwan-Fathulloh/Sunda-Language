"""
Entry point utama Sunda Language.

Bisa dijalankeun ku cara:
  sunda <file.sunda>
  python -m sunda_language <file.sunda>
"""

import sys
import os
import io
import argparse

# Fix Windows console encoding for Unicode/Aksara Sunda support
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from sunda_language.lexer import Lexer
from sunda_language.sunda_parser import Parser
from sunda_language.interpreter import Interpreter


def main():
    parser = argparse.ArgumentParser(
        prog="sunda",
        description="Sunda Language - Basa pamrograman nganggo Basa Sunda 🌺",
        epilog="Conto: sunda examples/halo.sunda",
    )
    parser.add_argument("file", help="File .sunda anu bade dijalankeun")
    parser.add_argument(
        "--version", "-v",
        action="version",
        version="Sunda Language v1.0.0",
    )

    args = parser.parse_args()
    filename = args.file

    if not os.path.exists(filename):
        print(f"❌ File '{filename}' teu kapanggih!")
        sys.exit(1)

    if not filename.endswith(".sunda"):
        print("⚠️  File kedah nganggo ékstensi .sunda")
        sys.exit(1)

    with open(filename, "r", encoding="utf-8") as f:
        code = f.read()

    try:
        # Léksér: Tokenisasi kode
        lexer = Lexer(code)
        tokens = list(lexer.tokenize())

        # Parser: Ngawangun AST
        sunda_parser = Parser(tokens)
        ast = sunda_parser.parse()

        # Interpreter: Ngajalankeun program
        interpreter = Interpreter(ast)
        interpreter.interpret()

    except SyntaxError as e:
        print(f"❌ Kasalahan sintaks: {e}")
        sys.exit(1)
    except RuntimeError as e:
        print(f"❌ Kasalahan runtime: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Kasalahan: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
