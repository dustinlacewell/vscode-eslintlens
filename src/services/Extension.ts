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

    update() {
        for (const editor of window.visibleTextEditors) {
            if (editor && editor.document.fileName) {
                if (editor.document.fileName.startsWith('extension-output')) {
                    continue;
                }
                // check if filename is under workspace root
                if (workspace.getWorkspaceFolder(editor.document.uri)) {
                    this.log.info(`Updating ${editor.document.fileName}...`);
                    this.parse(editor);
                }
            }
        }
    }

    activate() {
        window.onDidChangeActiveTextEditor(editor => {
            this.update();
            // this.log.debug(`Changed active editor: ${editor?.document.fileName}`);

            // if (!editor) {
            //     this.activeEditor = undefined;
            //     return;
            // }

            // if (!editor.document.fileName) {
            //     this.activeEditor = undefined;
            //     return;
            // }

            // this.activeEditor = editor;
            // this.parse(editor);

        }, null, this.context.subscriptions);

        workspace.onDidChangeTextDocument(event => {
            if (event.document.fileName) {
                for (const editor of window.visibleTextEditors) {
                    if (editor.document.fileName === event.document.fileName) {
                        if (!editor.document.fileName.startsWith('extension-output')) {
                            this.parse(editor);
                        }
                    }
                }
            }
        }, null, this.context.subscriptions);

        workspace.onDidCloseTextDocument(document => {
            for (const editor of window.visibleTextEditors) {
                if (!editor.document.fileName.startsWith('extension-output')) {
                    this.parse(editor);
                }
            }
        });

        workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('eslintlens')) {
                this.update();
            }
        }, null, this.context.subscriptions);

        this.update();
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