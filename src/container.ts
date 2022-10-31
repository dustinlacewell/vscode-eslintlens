import { Container, interfaces } from "inversify";
import { ExtensionContext, window, workspace } from "vscode";

import {
    AnnotationLogger,
    AnnotationService,
    ChannelLogger,
    DefaultAnnotationFormatter,
    EslintService,
    Extension,
    IParser,
    JsFileMatcher,
    JsParser,
    LensService,
    MissingAnnotationFormatter,
    ParserFactory,
    ParserLogger,
    PluginCache,
    PluginLogger,
    PluginService,
    RulesService,
    TreeviewProvider,
    WorkspaceService
} from "./services";
import { ILogger } from "./services/logging/ILogger";
import { tokens } from "./tokens";


let container: Container | null = null;

export function createContainer(context: ExtensionContext) {

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
            window.createOutputChannel('ESLintLens')
        );

    container
        .bind(Extension)
        .toSelf()
        .inSingletonScope();

    container
        .bind(TreeviewProvider)
        .toSelf()
        .inSingletonScope();

    container
        .bind(ILogger)
        .to(ChannelLogger)
        .inSingletonScope();

    container
        .bind(tokens.AnnotationLogger)
        .to(AnnotationLogger)
        .inSingletonScope();

    container
        .bind(tokens.ParserLogger)
        .to(ParserLogger)
        .inSingletonScope();

    container
        .bind(tokens.PluginLogger)
        .to(PluginLogger)
        .inSingletonScope();

    // Request Scope

    container
        .bind(JsParser)
        .toSelf()
        .inRequestScope();

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
        .inSingletonScope();

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
        .inRequestScope();

    return container;
}

export function destroyContainer() {
    container = null;
}