import { Container, inject, injectable, multiInject } from "inversify";
import { languages, TextDocument, TextEditor, workspace } from 'vscode';

import { tokens } from "../../tokens";
import { Logger } from "../../types";
import { IFileMatcher } from "./fileMatchers";
import { IParser } from "./parsers";

// vscode extension code


@injectable()
export class ParserFactory {

    @inject(Container)
    private container!: Container;

    @inject(tokens.Editor)
    private editor!: TextEditor;

    @inject(tokens.Logger)
    private log!: Logger;

    @inject(tokens.Configuration)
    private config!: any;

    @multiInject(tokens.FileMatchers)
    private fileMatchers!: IFileMatcher[];

    isMatch(language: string, ...patterns: string[]) {
        return patterns.some(pattern => {
            const selector = {
                pattern,
                scheme: 'file',
                language
            };
            return (languages.match(selector, this.editor.document) > 0);
        });
    }

    get workspaceRoot() {
        let workspaceRoot = workspace.workspaceFolders![0].uri.fsPath;
        return workspaceRoot.endsWith('/') ? workspaceRoot : workspaceRoot + '/';
    }

    isExtraConfig(language: string) {
        const filename = this.editor.document.fileName.replace(this.workspaceRoot, '');
        this.log(`Checking if ${filename} is an ESLint config in ${this.workspaceRoot}.`);
        const isExtra = this.config.extraFiles.includes(filename);
        const isLanguageMatch = this.isMatch(language, '**/*');
        return isExtra && isLanguageMatch;
    }

    containsMarkerComment(document: TextDocument, marker: string) {
        const text = document.getText();
        return text.indexOf(marker) > -1;
    }

    public create(): IParser | null {
        const document = this.editor.document;

        for (const fileMatcher of this.fileMatchers) {
            const parser = fileMatcher.match();
            if (parser) {
                return this.container.get(parser);
            }
        }

        // if (
        //     this.isMatch('javascript', '**/eslint.config.js') || 
        //     this.isMatch('javascriptreact', '**/eslint.config.js')
        // ) {
        //     return null; // this.container.get(FlatConfigParser);
        // } else if (
        //     this.isExtraConfig('javascript') || this.isExtraConfig('javascriptreact') ||
        //     this.isMatch('javascript', '**/.eslintrc.js', '**/.eslintrc.cjs') || 
        //     this.isMatch('javascriptreact', '**/.eslintrc.js', '**/.eslintrc.cjs')
        // ) {
        //     return this.container.get(JsParser);
        // } else if (
        //     this.isMatch('json', '**/.eslintrc', '**/.eslintrc.json') || 
        //     this.isMatch('jsonc', '**/.eslintrc', '**/.eslintrc.json')
        // ) {
        //     return null; // this.container.get(JSONParser);
        // } else if (
        //     this.isMatch('yaml', '**/.eslintrc', '**/.eslintrc.yaml', '**/.eslintrc.yml')
        // ) {
        //     return null; // this.container.get(YAMLParser);
        // } else if (
        //     this.isMatch('json', '**/package.json')
        // ) {
        //     return null; // this.container.get(PkgParser);
        // }

        return null;
    }

}