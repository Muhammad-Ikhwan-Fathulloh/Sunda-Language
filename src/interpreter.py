import operator

class SundaClass:
    def __init__(self, name, parent, body):
        self.name = name
        self.parent = parent
        self.properties = {} # name -> initial_expr
        self.methods = {} # name -> (params, body)
        for stmt in body:
            if stmt[0] == "property":
                self.properties[stmt[1]] = stmt[2]
            elif stmt[0] == "function":
                self.methods[stmt[1]] = (stmt[2], stmt[3])

class SundaInstance:
    def __init__(self, cls, interpreter):
        self.cls = cls
        self.fields = {}
        # Initialize properties chain
        classes = []
        curr = cls
        while curr:
            classes.insert(0, curr)
            curr = interpreter.classes.get(curr.parent)
        for c in classes:
            for name, expr in c.properties.items():
                self.fields[name] = interpreter.evaluate(expr)

    def get_method(self, name, interpreter):
        curr = self.cls
        while curr:
            if name in curr.methods:
                return curr.methods[name]
            curr = interpreter.classes.get(curr.parent)
        return None

class Interpreter:
    def __init__(self, ast, variables=None, functions=None, classes=None):
        self.ast = ast
        self.variables = variables if variables is not None else {}
        self.functions = functions if functions is not None else {}
        self.classes = classes if classes is not None else {}
        self.this_context = None
        self.return_flag = False
        self.return_value = None

    def interpret(self):
        self.execute(self.ast)

    def evaluate(self, node):
        if not isinstance(node, (tuple, list)):
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
        elif kind == "this":
            if not self.this_context:
                raise RuntimeError("'ieu' ngan bisa dipaké di jero kelas.")
            return self.this_context
        elif kind == "member_get":
            obj = self.evaluate(node[1])
            if not isinstance(obj, SundaInstance):
                raise RuntimeError("Aksés member ngan bisa dipaké dina objék.")
            if node[2] in obj.fields:
                return obj.fields[node[2]]
            raise RuntimeError(f"Member '{node[2]}' teu kapanggih dina objék.")
        elif kind == "member_call":
            obj = self.evaluate(node[1])
            method_name = node[2]
            args = node[3]
            if not isinstance(obj, SundaInstance):
                raise RuntimeError("Geroan métode ngan bisa dipaké dina objék.")
            method = obj.get_method(method_name, self)
            if not method:
                raise RuntimeError(f"Métode '{method_name}' teu kapanggih dina kelas {obj.cls.name}.")
            params, body = method
            local_vars = {p: self.evaluate(a) for p, a in zip(params, args)}
            method_interp = Interpreter(body, local_vars, self.functions, self.classes)
            method_interp.this_context = obj
            method_interp.interpret()
            return method_interp.return_value
        elif kind == "new":
            cls_name = node[1]
            if cls_name not in self.classes:
                raise RuntimeError(f"Kelas '{cls_name}' teu kapanggih.")
            instance = SundaInstance(self.classes[cls_name], self)
            init = instance.get_method("nyieun", self)
            if init:
                params, body = init
                args = node[2]
                local_vars = {p: self.evaluate(a) for p, a in zip(params, args)}
                init_interp = Interpreter(body, local_vars, self.functions, self.classes)
                init_interp.this_context = instance
                init_interp.interpret()
            return instance
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
            local_vars = {param: self.evaluate(arg) for param, arg in zip(func_params, args)}
            func_interpreter = Interpreter(func_body, local_vars, self.functions, self.classes)
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
        if not ast: return
        for stmt in ast:
            if self.return_flag: break
            kind = stmt[0]
            if kind == "declare" or kind == "assign":
                self.variables[stmt[1]] = self.evaluate(stmt[2])
            elif kind == "member_assign":
                target, expr = stmt[1], stmt[2]
                val = self.evaluate(expr)
                if target[0] == "member_get":
                    obj = self.evaluate(target[1])
                    if isinstance(obj, SundaInstance):
                        obj.fields[target[2]] = val
                    else:
                        raise RuntimeError("Papasangan member ngan bisa dipaké dina objék.")
            elif kind == "print":
                results = [self.evaluate(e) for e in stmt[1]]
                formatted_results = []
                for v in results:
                    if isinstance(v, SundaInstance): formatted_results.append(f"<Objék {v.cls.name}>")
                    elif v is True: formatted_results.append("leres")
                    elif v is False: formatted_results.append("lepat")
                    else: formatted_results.append(str(v))
                print(" ".join(formatted_results))
            elif kind == "input":
                prompt = stmt[2] if stmt[2] else f"Mangga eusian {stmt[1]}: "
                val = input(prompt)
                if val and val.replace('.','',1).isdigit():
                    val = float(val) if '.' in val else int(val)
                self.variables[stmt[1]] = val
            elif kind == "if_chain":
                branches, else_branch = stmt[1], stmt[2]
                executed = False
                for _, condition, body in branches:
                    if self.evaluate(condition):
                        self.execute(body)
                        executed = True
                        break
                if not executed and else_branch:
                    self.execute(else_branch)
            elif kind == "loop":
                var, start, end, body = stmt[1], stmt[2], stmt[3], stmt[4]
                start_val = int(self.evaluate(start))
                end_val = int(self.evaluate(end))
                for i in range(start_val, end_val + 1):
                    self.variables[var] = i
                    self.execute(body)
                    if self.return_flag: break
            elif kind == "while":
                condition, body = stmt[1], stmt[2]
                while self.evaluate(condition):
                    self.execute(body)
                    if self.return_flag: break
            elif kind == "function":
                self.functions[stmt[1]] = (stmt[2], stmt[3])
            elif kind == "class":
                self.classes[stmt[1]] = SundaClass(stmt[1], stmt[2], stmt[3])
            elif kind == "try":
                try_body, catch_var, catch_body, finally_body = stmt[1], stmt[2], stmt[3], stmt[4]
                try:
                    self.execute(try_body)
                except Exception as e:
                    if catch_body:
                        local_vars = self.variables.copy()
                        local_vars[catch_var if catch_var else "kasalahan"] = str(e)
                        catch_interp = Interpreter(catch_body, local_vars, self.functions, self.classes)
                        catch_interp.interpret()
                    else:
                        raise e
                finally:
                    if finally_body: self.execute(finally_body)
            elif kind == "throw":
                raise RuntimeError(str(self.evaluate(stmt[1])))
            elif kind == "return":
                self.return_value = self.evaluate(stmt[1])
                self.return_flag = True
            elif kind == "expr":
                self.evaluate(stmt[1])
