import { injectable } from "inversify";

import { TopicLogger } from "./TopicLogger";


@injectable()
export class AnnotationLogger extends TopicLogger {
    topicName() {
        return 'annotations';
    }

    topicActive() {
        return this.config.get<boolean>('debugAnnotations', false);
    }
}