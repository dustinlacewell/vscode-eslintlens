import { Linter } from "eslint";
import { inject, injectable } from "inversify";
import { join } from "path";

import { WorkspaceService } from "../WorkspaceService";


declare var __non_webpack_require__: typeof require;

export class UnsupportedESLintError extends Error {
    constructor(version: string) {
        super("Unsupported ESLint version: " + version);
    }
}

@injectable()
export class EslintService {

    @inject(WorkspaceService)
    private workspaceService!: WorkspaceService;

    protected linter!: Linter;

    getLinter(): Linter | null {
        if (this.linter) {
            return this.linter;
        }

        const workspacePath = this.workspaceService.getWorkspacePath();

        if (!workspacePath) {
            return null;
        }

        const eslintPath = join(workspacePath, "node_modules", "eslint");
        const eslint = __non_webpack_require__(eslintPath);
        const linter = new eslint.Linter();

        if (!linter.getRules || typeof linter.getRules !== "function") {
            throw new UnsupportedESLintError(eslint.version);
        }

        this.linter = linter;
        return linter;
    }

}