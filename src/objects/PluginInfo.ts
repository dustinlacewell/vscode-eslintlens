import { Rule } from "eslint";


export class PluginInfo {
    constructor(
        public name: string,
        public rules: Record<string, Rule.RuleModule>,
    ) { }
}