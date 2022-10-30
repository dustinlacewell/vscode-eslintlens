import { Range } from "vscode";


export type Rule = {
    name: string;
    keyRange: Range;
    lineEndingRange: Range;
};