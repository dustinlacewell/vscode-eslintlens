import { inject, injectable } from "inversify";
import { languages, TextEditor, workspace } from "vscode";

import { tokens } from "../../../tokens";
import { ILogger } from "../../logging";


@injectable()
export abstract class BaseFileMatcher {

    @inject(tokens.ParserLogger)
    protected log!: ILogger;

    @inject(tokens.Configuration)
    protected config!: any;

    @inject(tokens.Editor)
    protected editor!: TextEditor;

    protected get workspaceRoot() {
        let workspaceRoot = workspace.workspaceFolders![0].uri.fsPath;
        return workspaceRoot.endsWith('/') ? workspaceRoot : workspaceRoot + '/';
    }

    protected isMatch(language: string, ...patterns: string[]) {
        return patterns.some(pattern => {
            const selector = {
                pattern,
                scheme: 'file',
                language
            };
            return (languages.match(selector, this.editor.document) > 0);
        });
    }

    protected isExtraConfig(language: string) {
        const filename = this.editor.document.fileName.replace(this.workspaceRoot, '');
        const isExtra = this.config.extraFiles.includes(filename);
        const isLanguageMatch = this.isMatch(language, '**/*');
        return isExtra && isLanguageMatch;
    }
}