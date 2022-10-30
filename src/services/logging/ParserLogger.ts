import { injectable } from "inversify";

import { TopicLogger } from "./TopicLogger";


@injectable()
export class ParserLogger extends TopicLogger {
    topicName() {
        return 'parser';
    }

    topicActive() {
        return this.config.get<boolean>('debugParsing', false);
    }
}