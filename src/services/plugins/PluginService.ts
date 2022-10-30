import { Rule } from "eslint";
import { inject, injectable } from "inversify";
import { join } from "path";

import { PluginInfo } from "../../objects";
import { tokens } from "../../tokens";
import { ILogger } from "../logging";
import { WorkspaceService } from "../WorkspaceService";
import { EslintService } from "./EslintService";
import { PluginCache } from "./PluginCache";


declare var __non_webpack_require__: typeof require;

@injectable()
export class PluginService {

    @inject(WorkspaceService)
    private workspaceService!: WorkspaceService;

    @inject(EslintService)
    private eslintService!: EslintService;

    @inject(PluginCache)
    private cache!: PluginCache;

    @inject(tokens.PluginLogger)
    private log!: ILogger;

    getCachedPlugin(name: string) {
        return this.cache.get(name);
    }

    loadPlugin(pluginName: string) {
        this.log.debug(`Loading plugin ${pluginName}`);

        const workspacePath = this.workspaceService.getWorkspacePath();

        if (!workspacePath) {
            this.log.error("Could not find workspace path");
            return null;
        }

        const pluginPath = join(workspacePath, "node_modules", pluginName);
        let plugin = __non_webpack_require__(pluginPath);

        if (!plugin) {
            this.log.error(`Could not load plugin: ${pluginName} from ${pluginPath}`);
            return null;
        }

        const rulesRecord = {} as Record<string, Rule.RuleModule>;
        for (const [ruleName, rule] of Object.entries(plugin.rules)) {
            rulesRecord[ruleName] = rule as Rule.RuleModule;
        }

        const pluginInfo = new PluginInfo(pluginName, rulesRecord);
        this.cache.set(pluginName, pluginInfo);
        return pluginInfo;
    }

    loadEslint() {
        this.log.debug("Loading eslint");

        const linter = this.eslintService.getLinter();

        if (!linter) {
            this.log.error("Could not load ESLint");
            return null;
        }

        const rules = linter.getRules();
        const rulesRecord = {} as Record<string, Rule.RuleModule>;
        for (const [ruleName, rule] of rules) {
            rulesRecord[ruleName] = rule;
        }

        const eslintPluginInfo = new PluginInfo("eslint", rulesRecord);
        this.cache.set("eslint", eslintPluginInfo);
        return eslintPluginInfo;

    }

    getPlugin(name: string) {
        return this.getCachedPlugin(name) || (name === "eslint" ? this.loadEslint() : this.loadPlugin(name));
    }

}