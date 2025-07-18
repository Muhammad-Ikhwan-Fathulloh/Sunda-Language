class Interpreter:
    def __init__(self, ast):
        self.ast = ast
        self.variables = {}

    def interpret(self):
        for statement in self.ast:
            self.execute(statement)

    def execute(self, statement):
        if statement[0] == "declare":
            _, var_name, value = statement
            self.variables[var_name] = value
            print(f"{var_name} = {value}")
            if value.startswith('"') and value.endswith('"'):
                print(f"Kaluaran: {value.strip('\"')}")
            else:
                print(f"Nilai '{var_name}' diset kana {value}")
        elif statement[0] == "if":
            _, condition, body = statement
            if self.evaluate_condition(condition):
                for stmt in body:
                    self.execute(stmt)
        elif statement[0] == "loop":
            _, loop_var, start, end, body, _ = statement
            start = int(start)
            end = int(end)
            for i in range(start, end + 1):
                self.variables[loop_var] = i
                for stmt in body:
                    self.execute(stmt)
        else:
            raise RuntimeError(f"Pernyataan teu dikenal: {statement}")

    def evaluate_condition(self, condition):
        # Saat ini hanya dukung format 'angka == 10'
        if '==' in condition:
            var, val = condition.split('==')
            var = var.strip()
            val = val.strip()
            return str(self.variables.get(var)) == val
        return False
