import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const ArrayLiteral = (children: IMatcher[]) => ({

    match(value: ts.Statement): boolean {
        if (value.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const childNodes = value.getChildren();
            const pairs = children.map((child, index) => [child, childNodes[index]] as const);
            return pairs.every(([child, value]) => child.match(value));
        }

        return false;
    }

});