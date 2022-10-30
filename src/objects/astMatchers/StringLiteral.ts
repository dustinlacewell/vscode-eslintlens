import { ts } from "ts-morph";


const ANY = Symbol.for("ANY");

export const StringLiteral = (value: string | RegExp | typeof ANY) => ({

    match(statement: ts.Statement): boolean {
        if (ts.isStringLiteral(statement)) {
            if (value === ANY) {
                return true;
            }

            if (typeof value === "string") {
                return statement.text === value;
            }

            return value.test(statement.text);
        }

        return false;
    }

});