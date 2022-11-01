import { injectable } from "inversify";

import { JsonParser } from "../parsers";
import { BaseFileMatcher } from "./BaseFileMatcher";


@injectable()
export class JsonFileMatcher extends BaseFileMatcher {

    match() {
        if (
            this.isExtraConfig('json') ||
            this.isMatch('json', '**/.eslintrc.json', '**/eslintrc.json')
        ) {
            this.log.debug(`Using JsonParser for ${this.editor.document.fileName}.`);
            return JsonParser;
        }

        return null;
    }

}