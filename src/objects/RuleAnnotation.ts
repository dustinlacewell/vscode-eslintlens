import { Rule } from "eslint";

import { RuleName } from "./RuleName";


export class RuleAnnotation {
    constructor(
        public name: RuleName,
        public line: number,
        public data?: Rule.RuleModule,
    ) { }
}