import { injectable } from "inversify";


@injectable()
export abstract class IFileMatcher {

    abstract match(): any | null;

}