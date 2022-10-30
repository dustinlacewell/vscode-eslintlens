import { injectable } from "inversify";

import { JsParser } from "../parsers";
import { BaseFileMatcher } from "./BaseFileMatcher";


@injectable()
export class JsFileMatcher extends BaseFileMatcher {

    match() {
        if (
            this.isExtraConfig('javascript') ||
            this.isExtraConfig('javascriptreact') ||
            this.isMatch('javascript', '**/eslintrc.js') ||
            this.isMatch('javascriptreact', '**/eslintrc.js')
        ) {
            return JsParser;
        }

        return null;
    }

}