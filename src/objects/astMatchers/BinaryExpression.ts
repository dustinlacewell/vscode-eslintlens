import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const BinaryExpression = (config: {
    left?: IMatcher,
    right?: IMatcher,
}) => ({
    match: (value: ts.Node): boolean => {
        if (ts.isBinaryExpression(value)) {
            const leftMatch = !config.left || config.left?.match(value.left);
            const rightMatch = !config.right || config.right?.match(value.right);
            return leftMatch && rightMatch;
        }

        return false;
    }
});