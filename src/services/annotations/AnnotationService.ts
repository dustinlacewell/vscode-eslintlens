import { inject, injectable } from "inversify";
import { DecorationOptions, TextEditor, window } from "vscode";

import { RuleAnnotation } from "../../objects";
import { tokens } from "../../tokens";
import { ILogger } from "../logging";
import { IAnnotationFormatter } from "./formatters";


const annotationDecoration = window.createTextEditorDecorationType({});

@injectable()
export class AnnotationService {

    @inject(tokens.AnnotationLogger)
    private log!: ILogger;

    @inject(tokens.Editor)
    private editor!: TextEditor;

    @inject(tokens.DefaultFormatter)
    private defaultFormatter!: IAnnotationFormatter;

    @inject(tokens.MissingFormatter)
    private missingFormatter!: IAnnotationFormatter;

    applyAnnotations(rules: RuleAnnotation[]) {

        const decorations = rules.map<DecorationOptions>(rule => {
            this.log.debug(`Formatting annotation for rule ${rule.name.qualifiedName}`);
            if (rule.data) {
                return this.defaultFormatter.format(rule);
            }
            return this.missingFormatter.format(rule);
        });

        this.log.info(`Applying ${decorations.length} annotations to ${this.editor.document.fileName}`);
        this.editor.setDecorations(annotationDecoration, []);
        this.editor.setDecorations(annotationDecoration, decorations);

    }

}