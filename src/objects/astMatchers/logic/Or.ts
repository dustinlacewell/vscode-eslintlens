import { ts } from "ts-morph";

import { IMatcher } from "../IMatcher";


export const Or = (...children: IMatcher[]) => ({

    match(node: ts.Node): boolean {
        return children.some(child => child.match(node));
    }

});