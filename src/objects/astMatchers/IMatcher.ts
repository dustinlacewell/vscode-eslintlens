import { ts } from "ts-morph";


export type IMatcher = {
    match: (node: ts.Node) => boolean
};

export type IMatcherFactory = (...args: any[]) => IMatcher;