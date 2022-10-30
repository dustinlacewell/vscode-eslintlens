import { Container, inject, injectable } from "inversify";
import { ExtensionContext, TextEditor, window, workspace } from 'vscode';

import { tokens } from '../tokens';
import { Logger } from "../types";
import { LensService } from "./LensService";


@injectable()
export class Extension {

    @inject(Container)
    private container!: Container;

    @inject(tokens.ExtensionContext)
    private context!: ExtensionContext;

    @inject(tokens.Logger)
    private log!: Logger;

    activeEditor: TextEditor | undefined = undefined;

    activate() {
        this.activeEditor = window.activeTextEditor;

        window.onDidChangeActiveTextEditor(editor => {
            this.activeEditor = editor;
            if (editor) {
                this.parse(editor);
            }
        }, null, this.context.subscriptions);

        workspace.onDidChangeTextDocument(event => {
            if (this.activeEditor && event.document === this.activeEditor.document) {
                this.parse(this.activeEditor);
            }
        }, null, this.context.subscriptions);

        workspace.onDidChangeConfiguration(event => {
            if (this.activeEditor && event.affectsConfiguration('eslintlens')) {
                this.parse(this.activeEditor);
            }
        }, null, this.context.subscriptions);

        if (this.activeEditor) {
            this.parse(this.activeEditor);
        }

        this.log('eslintlens is now active.');
    }

    parse(editor: TextEditor) {
        const subContainer = this.container.createChild();

        subContainer
            .bind(Container)
            .toConstantValue(subContainer);

        subContainer
            .bind(tokens.Editor)
            .toConstantValue(editor);

        const lens = subContainer.get(LensService);
        lens.handle();
    }
}