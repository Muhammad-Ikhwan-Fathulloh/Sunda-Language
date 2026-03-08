import operator

class Interpreter:
    def __init__(self, ast, variables=None, functions=None):
        self.ast = ast
        self.variables = variables if variables is not None else {}
        self.functions = functions if functions is not None else {}
        self.return_flag = False
        self.return_value = None

    def interpret(self):
        self.execute(self.ast)

    def evaluate(self, node):
        if not isinstance(node, tuple):
            return node

        kind = node[0]
        if kind == "number":
            return node[1]
        elif kind == "string":
            return node[1]
        elif kind == "boolean":
            return node[1]
        elif kind == "variable":
            name = node[1]
            if name in self.variables:
                return self.variables[name]
            raise RuntimeError(f"Variabel '{name}' teu kapanggih.")
        elif kind == "binop":
            left = self.evaluate(node[1])
            op = node[2]
            right = self.evaluate(node[3])
            return self.apply_op(left, op, right)
        elif kind == "unop":
            op = node[1]
            val = self.evaluate(node[2])
            if op == "-": return -val
            return val
        elif kind == "call":
            name, args = node[1], node[2]
            if name not in self.functions:
                raise RuntimeError(f"Fungsi '{name}' teu kapanggih.")
            
            func_params, func_body = self.functions[name]
            if len(args) != len(func_params):
                raise RuntimeError(f"Fungsi '{name}' butuh {len(func_params)} argumén, tapi dikirim {len(args)}.")
            
            # Create local scope
            local_vars = {param: self.evaluate(arg) for param, arg in zip(func_params, args)}
            func_interpreter = Interpreter(func_body, local_vars, self.functions)
            func_interpreter.interpret()
            return func_interpreter.return_value
        
        return None

    def apply_op(self, left, op, right):
        ops = {
            "+": operator.add, "-": operator.sub, "*": operator.mul,
            "/": operator.truediv, "%": operator.mod,
            "==": operator.eq, "!=": operator.ne,
            "<": operator.lt, ">": operator.gt,
            "<=": operator.le, ">=": operator.ge
        }
        if op in ops:
            try:
                return ops[op](left, right)
            except Exception as e:
                raise RuntimeError(f"Kasalahan operasi '{op}': {e}")
        raise RuntimeError(f"Operator '{op}' teu dipikawanoh.")

    def execute(self, ast):
        for stmt in ast:
            if self.return_flag:
                break

            kind = stmt[0]
            if kind == "declare" or kind == "assign":
                _, name, expr = stmt
                self.variables[name] = self.evaluate(expr)
            elif kind == "print":
                _, expr = stmt
                print(self.evaluate(expr))
            elif kind == "input":
                _, name = stmt
                self.variables[name] = input(f"Mangga eusian {name}: ")
            elif kind == "if_chain":
                branches, else_branch = stmt[1], stmt[2]
                executed = False
                for b_kind, condition, body in branches:
                    if self.evaluate(condition):
                        self.execute(body)
                        executed = True
                        break
                if not executed and else_branch:
                    self.execute(else_branch)
            elif kind == "loop":
                _, var, start, end, body = stmt
                start_val = self.evaluate(start)
                end_val = self.evaluate(end)
                for i in range(int(start_val), int(end_val) + 1):
                    self.variables[var] = i
                    self.execute(body)
                    if self.return_flag: break
            elif kind == "while":
                _, condition, body = stmt
                while self.evaluate(condition):
                    self.execute(body)
                    if self.return_flag: break
            elif kind == "function":
                _, name, params, body = stmt
                self.functions[name] = (params, body)
            elif kind == "return":
                _, expr = stmt
                self.return_value = self.evaluate(expr)
                self.return_flag = True
            elif kind == "expr":
                _, expr = stmt
                self.evaluate(expr)
            else:
                raise RuntimeError(f"Statemen '{kind}' teu dipikawanoh.")
