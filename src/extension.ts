import "reflect-metadata";

import * as vscode from 'vscode';

import { createContainer, destroyContainer } from './container';
import { Extension } from "./services";


export function activate(context: vscode.ExtensionContext) {
    const container = createContainer(context);
    const extension = container.get(Extension);
    extension.activate();
}

export function deactivate() {
    destroyContainer();
}
