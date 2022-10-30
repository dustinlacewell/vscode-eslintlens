import { Container, inject, injectable } from "inversify";
import { ExtensionContext, TextEditor, window, workspace } from 'vscode';

import { tokens } from '../tokens';
import { LensService } from "./LensService";
import { ILogger } from "./logging";


@injectable()
export class Extension {

    @inject(Container)
    private container!: Container;

    @inject(tokens.ExtensionContext)
    private context!: ExtensionContext;

    @inject(ILogger)
    private log!: ILogger;

    activeEditor: TextEditor | undefined = undefined;

    activate() {
        this.activeEditor = window.activeTextEditor;

        for (const document of workspace.textDocuments) {
            this.log.debug(`Found document ${document.fileName}`);
        }

        workspace.onDidOpenTextDocument((document) => {
            this.log.debug(`Opened document: ${document.fileName}`);
        });

        workspace.onDidCloseTextDocument((document) => {
            this.log.debug(`Closed document: ${document.fileName}`);
        });

        window.onDidChangeActiveTextEditor(editor => {
            this.log.debug(`Changed active editor: ${editor?.document.fileName}`);
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

        this.log.info('eslintlens is now active.');
    }

    parse(editor: TextEditor) {
        this.log.debug(`Starting parsing on ${editor.document.fileName}...`);
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