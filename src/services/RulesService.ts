import { inject, injectable } from "inversify";

import { Rule, RuleName } from "../objects";
import { tokens } from "../tokens";
import { ILogger } from "./logging";
import { PluginService } from "./plugins";


@injectable()
export class RulesService {

    @inject(PluginService)
    private pluginService!: PluginService;

    @inject(tokens.PluginLogger)
    private log!: ILogger;

    getRule(name: string) {
        const ruleName = new RuleName(name);
        const packageName =
            ruleName.qualifiedPackage
                ? ruleName.directory
                : "eslint";
        const pluginInfo = this.pluginService.getPlugin(packageName);

        if (!pluginInfo) {
            // TODO: Improve plugin failure handling
            this.log.debug(`Plugin not found: ${ruleName.qualifiedPackage}`);
            return new Rule(ruleName, undefined);
        }

        const ruleData = pluginInfo.rules[ruleName.rule];

        if (!ruleData) {
            // TODO: Improve missing rule handling
            this.log.info(`Rule not found: ${ruleName.qualifiedName}`);
            return new Rule(ruleName, undefined);
        }

        return new Rule(ruleName, ruleData);
    }
}