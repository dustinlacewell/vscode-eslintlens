import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const PropertyAccessExpression = (config: {
    left?: IMatcher,
    right?: IMatcher,
    operator?: IMatcher,
}) => ({
    match: (value: ts.Node): boolean => {
        if (ts.isPropertyAccessExpression(value)) {
            const leftMatch = !config.left || config.left?.match(value.expression);
            const rightMatch = !config.right || config.right?.match(value.name);
            const operatorMatch = !config.operator || config.operator?.match(value.getChildAt(1));
            return leftMatch && rightMatch && operatorMatch;
        }

        return false;
    }
});