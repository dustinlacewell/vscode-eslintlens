import { Rule as EslintRule } from "eslint";

import { RuleName } from "./RuleName";


export class Rule {
    constructor(
        public name: RuleName,
        public data?: EslintRule.RuleModule,
    ) { }
}