import { Rule } from "eslint";
import { injectable } from "inversify";

import { RuleAnnotation } from "../../../objects";
import { markdownLink } from "../../../utils";
import { BaseAnnotationFormatter } from "./BaseAnnotationFormatter";


type ValidRuleAnnotation = RuleAnnotation & { data: Rule.RuleModule };

@injectable()
export class DefaultAnnotationFormatter extends BaseAnnotationFormatter {

    get icon() {
        return '🔎';
    }

    get iconColor() {
        return this.config.defaultColor;
    }

    getDescription(rule: ValidRuleAnnotation) {
        return rule.data.meta?.docs?.description || 'Undocumented.';
    }

    getUrl(rule: ValidRuleAnnotation) {
        const url = rule.data.meta?.docs?.url;
        return url
            ? markdownLink("Learn More", url)
            : markdownLink("Search Google", `https://google.com/search?q=${rule.name.qualifiedName}`);
    }

    getFixable(rule: ValidRuleAnnotation) {
        return rule.data.meta?.fixable ? '`🔧 Fixable`' : '';
    }

    getDeprecated(rule: ValidRuleAnnotation) {
        return rule.data.meta?.deprecated ? '`🛑 Deprecated`' : '';
    }

    getType(rule: ValidRuleAnnotation) {
        return rule.data.meta?.type
            ? `(*${rule.data.meta.type}*)`
            : '';
    }

    getTags(rule: ValidRuleAnnotation) {
        return [
            this.getFixable(rule),
            this.getDeprecated(rule),
        ].join(" ");
    }

    getText(rule: RuleAnnotation) {
        const validRule = rule as ValidRuleAnnotation;
        return `
**${validRule.name.qualifiedName}** ${this.getType(validRule)}

${this.getTags(validRule)}

${this.getDescription(validRule)}

${this.getUrl(validRule)}`.trim();
    }

}