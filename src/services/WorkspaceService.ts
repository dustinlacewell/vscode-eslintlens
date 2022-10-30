import { existsSync } from "fs";
import { inject, injectable } from "inversify";
import { dirname, join } from "path";
import { TextEditor } from "vscode";

import { tokens } from "../tokens";
import { findParentPathWith } from "../utils";


@injectable()
export class WorkspaceService {

    @inject(tokens.Editor)
    private editor!: TextEditor;

    pathIsWorkspaceRoot(path: string) {
        const nodeModules = join(path, "node_modules");

        if (existsSync(nodeModules)) {
            return path;
        }
    }

    getWorkspacePath() {
        // get absolute filename from editor's current document
        const filename = this.editor.document.fileName;

        // directory of the current file
        const root = dirname(filename);

        // check if root is the workspace root
        if (this.pathIsWorkspaceRoot(root)) {
            return root;
        }

        return findParentPathWith(root, 'node_modules');
    }

}