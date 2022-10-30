import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const ObjectLiteralExpression = (children: IMatcher[]) => ({

    match(value: ts.Node): boolean {
        if (ts.isObjectLiteralExpression(value)) {
            for (let i = 0; i < children.length; i++) {
                const childMatcher = children[i];
                if (!childMatcher.match(value.properties[i])) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

});