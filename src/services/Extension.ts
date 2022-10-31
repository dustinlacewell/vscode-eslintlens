import { Container, inject, injectable } from "inversify";
import { ExtensionContext, TextEditor, window, workspace } from 'vscode';

import { tokens } from '../tokens';
import { LensService } from "./LensService";
import { ILogger } from "./logging";
import { TreeviewProvider } from "./treeview";


@injectable()
export class Extension {

    @inject(Container)
    private container!: Container;

    @inject(tokens.ExtensionContext)
    private context!: ExtensionContext;

    @inject(TreeviewProvider)
    private treeview!: TreeviewProvider;

    @inject(ILogger)
    private log!: ILogger;

    activeEditor: TextEditor | undefined = undefined;

    isValid(editor: TextEditor) {
        return (
            editor && editor.document && editor.document.fileName &&
            !editor.document.fileName.startsWith('extension-output')
        );
    }

    update() {
        window.visibleTextEditors.forEach(editor => this.parse(editor));
    }

    activate() {
        window.onDidChangeVisibleTextEditors(editor => {
            this.update();
        }, null, this.context.subscriptions);

        window.onDidChangeActiveTextEditor(editor => {
            this.update();
        }, null, this.context.subscriptions);

        workspace.onDidChangeTextDocument(event => {
            if (event.document.fileName) {
                for (const editor of window.visibleTextEditors) {
                    if (editor.document.fileName === event.document.fileName) {
                        this.parse(editor);
                    }
                }
            }
        }, null, this.context.subscriptions);

        workspace.onDidCloseTextDocument(document => {
            for (const editor of window.visibleTextEditors) {
                this.parse(editor);
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
        if (!this.isValid(editor)) {
            return;
        }

        this.log.debug(`Creating container for ${editor.document.fileName}.`);
        const subContainer = this.container.createChild();

        subContainer
            .bind(Container)
            .toConstantValue(subContainer);

        subContainer
            .bind(tokens.Editor)
            .toConstantValue(editor);

        this.log.debug(`Resolving LenService for ${editor.document.fileName}.`);
        const lens = subContainer.get(LensService);
        lens.handle();
        this.treeview.refresh();
    }
}