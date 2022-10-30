import { inject, injectable } from "inversify";
import { OutputChannel, workspace } from "vscode";

import { tokens } from "../../tokens";


enum LogLevel {
    Info = 0,
    Warn = 1,
    Error = 2,
    Debug = 3
}

@injectable()
export class ChannelLogger {

    @inject(tokens.OutputChannel)
    private channel!: OutputChannel;

    get config() {
        return workspace.getConfiguration('eslintlens');
    }

    get level() {
        const configuredLevel = this.config.get<string>('logLevel', 'info');
        switch (configuredLevel) {
            case 'info':
                return LogLevel.Info;
            case 'warn':
                return LogLevel.Warn;
            case 'error':
                return LogLevel.Error;
            case 'debug':
                return LogLevel.Debug;
            default:
                return LogLevel.Info;
        }
    }

    protected log(msg: string, level: string) {
        this.channel.appendLine(`[${level}] ${msg}`);
    }

    public info(msg: string) {
        if (this.level <= LogLevel.Info) {
            this.log(msg, 'info');
        }
    }

    public warn(msg: string) {
        if (this.level <= LogLevel.Warn) {
            this.log(msg, 'warn');
        }
    }

    public error(msg: string) {
        if (this.level <= LogLevel.Error) {
            this.log(msg, 'error');
        }
    }

    public debug(msg: string) {
        if (this.level <= LogLevel.Debug) {
            this.log(msg, 'debug');
        }
    }
}