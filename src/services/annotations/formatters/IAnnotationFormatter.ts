import { injectable } from "inversify";
import { DecorationOptions } from "vscode";

import { RuleAnnotation } from "../../../objects";


@injectable()
export abstract class IAnnotationFormatter {
    abstract format(annotation: RuleAnnotation): DecorationOptions;
}