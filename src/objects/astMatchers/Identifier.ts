import { ts } from "ts-morph";


export const Identifier = (name: string) => ({
    match: (value: ts.Node): boolean => {
        if (ts.isIdentifier(value)) {
            return value.text === name;
        }

        return false;
    }
});