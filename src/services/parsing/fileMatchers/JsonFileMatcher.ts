import { injectable } from "inversify";

import { JsonParser } from "../parsers";
import { BaseFileMatcher } from "./BaseFileMatcher";


@injectable()
export class JsonFileMatcher extends BaseFileMatcher {

    protected isExtraConfig() {
        const filename = this.editor.document.fileName.replace(this.workspaceRoot, '');
        const isExtra = this.config.extraFiles.includes(filename);
        return isExtra;
    }

    match() {
        if (
            this.isExtraConfig() ||
            this.isMatch('json', '**/.eslintrc.json', '**/eslintrc.json')
        ) {
            this.log.debug(`Using JsonParser for ${this.editor.document.fileName}.`);
            return JsonParser;
        }

        return null;
    }

}