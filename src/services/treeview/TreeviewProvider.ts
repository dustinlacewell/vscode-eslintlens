import { inject, injectable, postConstruct } from "inversify";
import {
    EventEmitter,
    ProviderResult,
    TreeDataProvider,
    TreeItem,
    TreeView,
    window
} from "vscode";

import { PluginCache } from "../plugins";
import path = require("path");


@injectable()
export class TreeviewProvider implements TreeDataProvider<string> {
    tree!: TreeView<string>;

    @inject(PluginCache)
    private cache!: PluginCache;

    private _onDidChangeTreeData: EventEmitter<string | undefined | null | void> = new EventEmitter<string | undefined | null | void>();
    onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    @postConstruct()
    init() {
        this.tree = window.createTreeView(
            'eslintRules', {
            treeDataProvider: this,
        }
        );
    }

    getTreeItem(element: string): TreeItem | Thenable<TreeItem> {
        for (const pluginName of this.cache.keys()) {
            const plugin = this.cache.get(pluginName);
            if (plugin) {
                const rule = plugin.rules[element];
                if (rule) {
                    const description = rule.meta?.docs?.description;
                    return {
                        label: element,
                        collapsibleState: 0,
                        tooltip: description,
                    };
                }
            }
        }
        return {
            label: element,
            collapsibleState: this.cache.has(element) ? 1 : 0,
            contextValue: element,
        };
    }

    getChildren(element?: string): ProviderResult<string[]> {
        if (element) {
            const plugin = this.cache.get(element);
            if (plugin) {
                return Object.keys(plugin.rules);
            }
            return [];
        }
        return this.cache.keys();
    }

    // getParent?(element: string) {
    //     throw new Error("Method not implemented.");
    // }

    // resolveTreeItem?(item: TreeItem, element: string, token: CancellationToken): ProviderResult<TreeItem> {
    //     throw new Error("Method not implemented.");
    // }

}