import unittest
from lexer import Lexer
from sunda_parser import Parser
from interpreter import Interpreter

class SundaLanguageTest(unittest.TestCase):

    def test_tokenization(self):
        code = 'ngadeklarasikeun x = 5; tampilkeun x;'
        lexer = Lexer(code)
        tokens = list(lexer.tokenize())
        self.assertTrue(('KEYWORD_DECLARE', 'ngadeklarasikeun') in tokens)
        self.assertTrue(('KEYWORD_PRINT', 'tampilkeun') in tokens)

    def test_parsing_and_execution(self):
        code = '''
        ngadeklarasikeun x = 3;
        upami x > 2:
            tampilkeun "Lulus";
        lamun x == 2:
            tampilkeun "Pas";
        lain lamun:
            tampilkeun "Gagal";
        '''
        lexer = Lexer(code)
        parser = Parser(lexer.tokenize())
        ast = parser.parse()

        interpreter = Interpreter(ast)
        # Capture output
        import io
        from contextlib import redirect_stdout
        f = io.StringIO()
        with redirect_stdout(f):
            interpreter.interpret()
        output = f.getvalue().strip()
        self.assertIn("Kaluaran: Lulus", output)

    def test_loop_execution(self):
        code = '''
        ngadeklarasikeun total = 0;
        pikeun i = 1 ti 3 ngajalankeun:
            ngadeklarasikeun total = total + i;
        tampilkeun total;
        '''
        lexer = Lexer(code)
        parser = Parser(lexer.tokenize())
        ast = parser.parse()

        interpreter = Interpreter(ast)
        import io
        from contextlib import redirect_stdout
        f = io.StringIO()
        with redirect_stdout(f):
            interpreter.interpret()
        output = f.getvalue().strip()
        self.assertIn("Kaluaran: 6", output)

if __name__ == '__main__':
    unittest.main()