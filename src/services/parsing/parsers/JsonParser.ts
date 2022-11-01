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
        const stringifiedJson = JSON.stringify(JSON.parse(this.editor.document.getText()), null, 2);
        const parsedJsonEntries = 
            jsonParser.tokenize(stringifiedJson) as JSONEntries;

        const parsedRules = this.parseRules(parsedJsonEntries);
        return parsedRules;
    }

    protected parseRules(jsonEntries: JSONEntries): Record<string, number> {
        const rules: Record<string, number> = {};
        let rulesEncountered = false;
        let firstColonEncountered = false;

        let parsedColon = false;

        let punctuationMap: Record<string, number> = {
            '{': 0,
            '[': 0
        };
        let idx = 0;
        for (const entry of jsonEntries) {
            idx++;
            if (entry.value === "rules") {
                rulesEncountered = true;
                continue;
            } else if (rulesEncountered && !firstColonEncountered && entry.type === "punctuation" && entry.value === ":") {
                firstColonEncountered = true;
                continue;
            } else if (rulesEncountered) {
                if (entry.type === "punctuation") {
                    // Add all beginning parentheses
                    if (entry.value === "{") {
                        punctuationMap["{"]++;
                    // Mark that a parentheses block has ended
                    } else if (entry.value === "}") {
                        punctuationMap["{"]--;
                        // "rules" parentheses block has ended
                        if (punctuationMap["}"] === 0) {
                            break;
                        }
                    } else if (entry.value === ":") {
                        parsedColon = true;
                    }
                } else if (entry.type === "string") {
                    // Colon was parsed before, so current entry has the rule property name
                    if (!parsedColon) {
                        const ruleProperty = entry.value;
                        rules[ruleProperty] = entry.position.startLineNumber - 1;
                    } else {
                        parsedColon = false;
                    }
                }
            }
        }

        return rules;
    }
}