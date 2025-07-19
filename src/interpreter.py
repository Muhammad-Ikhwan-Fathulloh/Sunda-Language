class Interpreter:
    def __init__(self, ast):
        self.ast = ast
        self.variables = {}
        self.functions = {}
        self.return_flag = False
        self.return_value = None

    def interpret(self):
        self.execute(self.ast)

    def evaluate_expr(self, expr):
        expr = expr.strip()

        if expr.startswith("[") and expr.endswith("]"):
            elements = expr[1:-1].split(',')
            return [self.evaluate_expr(e.strip()) for e in elements]

        if expr.startswith("\"") and expr.endswith("\""):
            return expr.strip('"')

        if expr in self.variables:
            return self.variables[expr]

        if expr in ("true", "false"):
            return expr == "true"

        if expr.isdigit():
            return int(expr)

        if "(" in expr and ")" in expr:
            fname, rest = expr.split("(", 1)
            fname = fname.strip()
            args = rest.rstrip(")").split(",") if rest.rstrip(")") else []
            if fname in self.functions:
                local_vars = self.variables.copy()
                self.execute(self.functions[fname])
                result = self.return_value
                self.return_value = None
                self.return_flag = False
                self.variables = local_vars
                return result
            else:
                raise RuntimeError(f"Fungsi '{fname}' teu kapanggih.")

        if any(op in expr for op in ['+', '-', '*', '/', '%']):
            try:
                return eval(expr, {}, self.variables)
            except Exception as e:
                raise RuntimeError(f"Kesalahan evaluasi ekspresi: {expr} => {e}")

        return expr

    def execute(self, ast):
        for stmt in ast:
            if self.return_flag:
                break

            kind = stmt[0]
            if kind == "declare":
                _, name, value = stmt
                self.variables[name] = self.evaluate_expr(value)
                if value.startswith('"') and value.endswith('"'):
                    print(f"Kaluaran: {value.strip('\"')}")
                else:
                    print(f"Nilai diset kana {value}")
            elif kind == "print":
                _, value = stmt
                result = self.evaluate_expr(value)
                print(f"Kaluaran: {result}")

            elif kind == "if_chain":
                for branch_type, condition, body in stmt[1]:
                    if self.evaluate_condition(condition):
                        self.execute(body)
                        break
                else:
                    self.execute(stmt[2])

            elif kind == "loop":
                _, var, start, end, body = stmt
                start_val = self.evaluate_expr(start)
                end_val = self.evaluate_expr(end)
                for i in range(start_val, end_val + 1):
                    self.variables[var] = i
                    self.execute(body)

            elif kind == "while":
                _, condition, body = stmt
                while self.evaluate_condition(condition):
                    self.execute(body)

            elif kind == "input":
                _, varname = stmt
                self.variables[varname] = input(f"Mangga eusian {varname}: ")

            elif kind == "function":
                _, name, body = stmt
                self.functions[name] = body

            elif kind == "return":
                _, value = stmt
                self.return_value = self.evaluate_expr(value)
                self.return_flag = True

            else:
                raise RuntimeError(f"Jenis statemen teu dikenal: {stmt}")

    def evaluate_condition(self, condition):
        ops = ["==", "!=", "<=", ">=", "<", ">"]
        for op in ops:
            if op in condition:
                left, right = condition.split(op)
                left_val = self.evaluate_expr(left.strip())
                right_val = self.evaluate_expr(right.strip())
                return eval(f"{repr(left_val)} {op} {repr(right_val)}")
        return bool(self.evaluate_expr(condition))
