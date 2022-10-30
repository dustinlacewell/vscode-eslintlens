import { ts } from "ts-morph";


export const BooleanLiteral = (value: boolean | undefined) => ({

    match(statement: ts.Statement): boolean {
        if (ts.isLiteralExpression(statement)) {

            if (value === undefined) {
                return true;
            }

            return statement.text === value.toString();
        }

        return false;
    }

});