
import { inject, injectable } from "inversify";

import { RuleAnnotation } from "../objects";
import { AnnotationService } from "./annotations/AnnotationService";
import { IParser } from "./parsing/parsers";
import { RulesService } from "./RulesService";


@injectable()
export class LensService {

    @inject(IParser)
    private parser!: IParser | null;

    @inject(AnnotationService)
    private annotationService!: AnnotationService;

    @inject(RulesService)
    private rules!: RulesService;

    handle() {
        if (this.parser) {
            const ruleLocations = this.parser.parse();
            const ruleAnnotations = Object.entries(ruleLocations)
                .map(([ruleName, line]) => {
                    const { name, data } = this.rules.getRule(ruleName);
                    return new RuleAnnotation(
                        name,
                        line,
                        data,
                    );
                });

            this.annotationService.applyAnnotations(ruleAnnotations);
        }
    }
}