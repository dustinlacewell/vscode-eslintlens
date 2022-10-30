import { injectable } from "inversify";


@injectable()
export abstract class IParser {
    abstract parse(): Record<string, number>;
}