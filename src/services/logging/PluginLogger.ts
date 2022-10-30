import { injectable } from "inversify";

import { TopicLogger } from "./TopicLogger";


@injectable()
export class PluginLogger extends TopicLogger {
    topicName(): string {
        return 'plugins';
    }

    topicActive() {
        return this.config.get<boolean>('debugPlugins', false);
    }
}