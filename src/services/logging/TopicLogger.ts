import { injectable } from "inversify";

import { ChannelLogger } from "./ChannelLogger";


@injectable()
export abstract class TopicLogger extends ChannelLogger {
    abstract topicName(): string;
    abstract topicActive(): boolean;

    protected log(msg: string, level: string) {
        if (this.topicActive()) {
            super.log(`[${this.topicName}] ${msg}`, level);
        }
    }
}