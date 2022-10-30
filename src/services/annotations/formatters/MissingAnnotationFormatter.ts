import { injectable } from "inversify";

import { RuleAnnotation } from "../../../objects";
import { markdownLink } from "../../../utils";
import { BaseAnnotationFormatter } from "./BaseAnnotationFormatter";


type MissingRuleAnnotation = RuleAnnotation & { data: undefined };

@injectable()
export class MissingAnnotationFormatter extends BaseAnnotationFormatter {

    get icon() {
        return this.config.errorIcon;
    }

    get iconColor() {
        return this.config.errorColor;
    }

    getDescription(rule: MissingRuleAnnotation) {
        return `Couldn't find or load rule.`;
    }

    getUrl(rule: MissingRuleAnnotation) {
        return markdownLink("Search Google", `https://google.com/search?q=${rule.name.qualifiedName}`);
    }

    getText(rule: RuleAnnotation) {
        const missingRule = rule as MissingRuleAnnotation;
        return `
**${missingRule.name.qualifiedName}** (*missing*)

${this.getDescription(missingRule)}

${this.getUrl(missingRule)}`.trim();
    }

}