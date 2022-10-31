import { Container, inject, injectable, multiInject } from "inversify";
import { TextEditor } from 'vscode';

import { tokens } from "../../tokens";
import { ILogger } from "../logging";
import { IFileMatcher } from "./fileMatchers";
import { IParser } from "./parsers";


@injectable()
export class ParserFactory {

    @inject(Container)
    private container!: Container;

    @inject(tokens.Editor)
    private editor!: TextEditor;

    @inject(tokens.ParserLogger)
    private log!: ILogger;

    @multiInject(tokens.FileMatchers)
    private fileMatchers!: IFileMatcher[];

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
        this.log.debug(`No parser matched: ${document.fileName}.`);
        return null;
    }

}