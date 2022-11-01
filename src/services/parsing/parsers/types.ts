export type JSONEntry = {
    type: string;
    position: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    };
    raw: string;
    value: string;
};

export type JSONEntries = JSONEntry[];
