import { injectable } from "inversify";


@injectable()
export abstract class ILogger {
    public abstract info(msg: string): void;
    public abstract warn(msg: string): void;
    public abstract error(msg: string): void;
    public abstract debug(msg: string): void;
}