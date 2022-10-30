import { ts } from "ts-morph";


export const NumberLiteral = (value: number | RegExp | undefined) => ({

    match(statement: ts.Statement): boolean {
        if (ts.isNumericLiteral(statement)) {
            if (value === undefined) {
                return true;
            }

            if (typeof value === "number") {
                return statement.text === value.toString();
            }

            return value.test(statement.text);
        }

        return false;
    }

});