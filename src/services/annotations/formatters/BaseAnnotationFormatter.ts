import { inject, injectable } from "inversify";
import { DecorationOptions, Range } from "vscode";

import { RuleAnnotation } from "../../../objects";
import { tokens } from "../../../tokens";


@injectable()
export abstract class BaseAnnotationFormatter {

    @inject(tokens.Configuration)
    protected config!: any;

    abstract get icon(): string;
    abstract get iconColor(): string;

    abstract getText(rule: RuleAnnotation): string;

    get iconMargin() {
        const n = this.config.iconMargin;
        return ' '.repeat(n);
    }

    createAnnotation(line: number, text: string, icon: string, color: string) {
        const options: DecorationOptions = {
            range: new Range(line, Number.MAX_SAFE_INTEGER, line, Number.MAX_SAFE_INTEGER),
            hoverMessage: text,
            renderOptions: {
                after: {
                    color,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    margin: '5',
                    contentText: `${this.iconMargin}${icon}`,
                }
            }
        };

        return options;
    }

    format(rule: RuleAnnotation) {
        return this.createAnnotation(
            rule.line,
            this.getText(rule),
            this.icon,
            this.iconColor,
        );
    }

}