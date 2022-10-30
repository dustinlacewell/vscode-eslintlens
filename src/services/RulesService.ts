import { inject, injectable } from "inversify";

import { Rule, RuleName } from "../objects";
import { PluginService } from "./plugins";


@injectable()
export class RulesService {

    @inject(PluginService)
    private pluginService!: PluginService;

    getRule(name: string) {
        const ruleName = new RuleName(name);
        const packageName =
            ruleName.qualifiedPackage
                ? ruleName.directory
                : "eslint";
        const pluginInfo = this.pluginService.getPlugin(packageName);
        const ruleData = pluginInfo.rules[ruleName.rule];

        if (!ruleData) {
            return new Rule(ruleName, undefined);
        }

        return new Rule(ruleName, ruleData);
    }
}