import { inject, injectable } from "inversify";
import { TextEditor } from "vscode";

import { tokens } from '../../../tokens';
import { IParser } from "./IParser";


@injectable()
export class JsonParser implements IParser {

    @inject(tokens.Editor)
    private editor!: TextEditor;

    // TODO
    public parse() {
        return {};
    }
}