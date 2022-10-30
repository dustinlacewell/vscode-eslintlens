import { Container, interfaces } from "inversify";
import { ExtensionContext, OutputChannel, window, workspace } from "vscode";

import {
    AnnotationService,
    DefaultAnnotationFormatter,
    EslintService,
    Extension,
    IParser,
    JsFileMatcher,
    JsParser,
    LensService,
    MissingAnnotationFormatter,
    ParserFactory,
    PluginCache,
    PluginService,
    RulesService,
    WorkspaceService
} from "./services";
import { tokens } from "./tokens";


let container: Container | null = null;

export function createContainer(context: ExtensionContext) {

    const config = workspace.getConfiguration('eslintlens');

    container = new Container();

    // Global scope

    container
        .bind(Container)
        .toConstantValue(container);

    container
        .bind(tokens.ExtensionContext)
        .toConstantValue(context);

    container
        .bind(tokens.OutputChannel)
        .toConstantValue(
            window.createOutputChannel('eslintlens')
        );

    container
        .bind(Extension)
        .toSelf();

    container
        .bind(JsParser)
        .toSelf();

    container
        .bind(tokens.Logger)
        .toConstantValue((msg: string) => {
            if (container) {
                const channel = container.get<OutputChannel>(tokens.OutputChannel);
                channel.appendLine(msg);
            }
        });

    // Request Scope
    container
        .bind(tokens.Configuration)
        .toDynamicValue(() => {
            return workspace.getConfiguration('eslintlens');
        })
        .inRequestScope();

    container
        .bind(ParserFactory)
        .toSelf()
        .inRequestScope();

    container
        .bind<IParser | null>(IParser)
        .toDynamicValue((context: interfaces.Context) => {
            const parserFactory = context.container.get(ParserFactory);
            return parserFactory.create();
        })
        .inRequestScope();

    container
        .bind(AnnotationService)
        .toSelf()
        .inRequestScope();

    container
        .bind(EslintService)
        .toSelf()
        .inRequestScope();

    container
        .bind(LensService)
        .toSelf()
        .inRequestScope();

    container
        .bind(PluginService)
        .toSelf()
        .inRequestScope();

    container
        .bind(PluginCache)
        .toSelf()
        .inRequestScope();

    container
        .bind(WorkspaceService)
        .toSelf()
        .inRequestScope();

    container
        .bind(RulesService)
        .toSelf()
        .inRequestScope();

    container
        .bind(tokens.DefaultFormatter)
        .to(DefaultAnnotationFormatter)
        .inRequestScope();

    container
        .bind(tokens.MissingFormatter)
        .to(MissingAnnotationFormatter)
        .inRequestScope();

    // file matchers

    container
        .bind(tokens.FileMatchers)
        .to(JsFileMatcher)
        .inSingletonScope();

    return container;
}

export function destroyContainer() {
    container = null;
}