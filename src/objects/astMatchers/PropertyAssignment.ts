import { ts } from "ts-morph";

import { IMatcher } from "./IMatcher";


export const PropertyAssignment = (config: {
    identifier?: IMatcher,
    value?: IMatcher,
}) => ({
    match: (value: ts.Node): boolean => {
        if (ts.isPropertyAssignment(value)) {
            const identifierMatch = !config.identifier || config.identifier?.match(value.name);
            const valueMatch = !config.value || config.value?.match(value.initializer);
            return identifierMatch && valueMatch;
        }

        return false;
    }
});