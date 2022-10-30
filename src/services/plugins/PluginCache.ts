import { injectable } from "inversify";

import { PluginInfo } from "../../objects";


@injectable()
export class PluginCache {

    private cache = new Map<string, PluginInfo>();

    get(name: string) {
        return this.cache.get(name);
    }

    set(name: string, plugin: PluginInfo) {
        this.cache.set(name, plugin);
    }

    has(name: string) {
        return this.cache.has(name);
    }

}