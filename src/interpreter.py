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
        elif statement[0] == "if":
            # Implementasikan logika untuk `if`
            pass
        else:
            raise RuntimeError(f"Unknown statement: {statement}")