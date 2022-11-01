import { inject, injectable } from "inversify";
import { TextEditor } from "vscode";

import { tokens } from '../../../tokens';
import { IParser } from "./IParser";
import { JSONEntries } from "./types";


const jsonParser = require('json-parse-ast');


@injectable()
export class JsonParser implements IParser {

    @inject(tokens.Editor)
    private editor!: TextEditor;

    public parse() {
        const parsedJsonEntries = 
            jsonParser.tokenize({}) as JSONEntries;

        // TODO: Parse entries
        return {};
    }
}