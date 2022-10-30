import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const Expression = (children: IMatcher[]) => ({

    match(value: ts.Statement): boolean {
        if (value.kind === ts.SyntaxKind.ExpressionStatement) {
            const childNodes = value.getChildren();
            const pairs = children.map((child, index) => [child, childNodes[index]] as const);
            return pairs.every(([child, value]) => child.match(value));
        }

        return false;
    }

});