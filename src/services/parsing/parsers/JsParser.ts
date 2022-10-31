import { inject, injectable } from "inversify";
import { Project, ts } from "ts-morph";
import { TextEditor } from "vscode";

import {
    BinaryExpression,
    Expression,
    Identifier,
    ObjectLiteralExpression,
    Or,
    PropertyAccessExpression,
    PropertyAssignment
} from "../../../objects";
import { tokens } from '../../../tokens';
import { IParser } from "./IParser";


@injectable()
export class JsParser implements IParser {

    @inject(tokens.Editor)
    private editor!: TextEditor;

    protected isModuleExportsAssignment(statement: ts.Statement): boolean {
        const matcher = Expression([
            BinaryExpression({
                left: PropertyAccessExpression({
                    left: Identifier("module"),
                    right: Identifier("exports"),
                }),
                right: ObjectLiteralExpression([
                    PropertyAssignment({
                        identifier: Or(Identifier("rules"), Identifier("configs")),
                    })
                ]),
            })
        ]);
        return matcher.match(statement);
    }

    protected isPropertyAssignment(node: ts.Node, name: string): boolean {
        const matcher = PropertyAssignment({
            identifier: Identifier(name),
        });
        return matcher.match(node);
    }

    protected isRulesObject(node: ts.Node): this is ts.ObjectLiteralExpression {
        return this.isPropertyAssignment(node, "rules");
    }

    protected isConfigsObject(node: ts.Node): this is ts.ObjectLiteralExpression {
        return this.isPropertyAssignment(node, "configs");
    }

    protected convertNode(node: ts.Node): any {
        if (ts.isObjectLiteralExpression(node)) {
            return this.convertObjectLiteralToObject(node);
        } else if (ts.isArrayLiteralExpression(node)) {
            return this.convertArrayLiteralToArray(node);
        } else if (ts.isStringLiteral(node)) {
            return node.getText();
        } else if (ts.isNumericLiteral(node)) {
            return Number(node.getText());
        }
    }

    protected convertObjectLiteralToObject(node: ts.ObjectLiteralExpression): object {
        const result: any = {};
        for (const child of node.properties) {
            if (ts.isPropertyAssignment(child)) {
                const name = child.name.getText();
                const value = child.initializer;
                result[name] = this.convertNode(value);
            }
        }
        return result;
    }

    protected convertArrayLiteralToArray(node: ts.ArrayLiteralExpression): any[] {
        return node.elements.map(child =>
            this.convertNode(child)
        );
    }

    protected getModuleExportsObject(statement: ts.Statement): ts.ObjectLiteralExpression | undefined {
        const binary = statement.getChildAt(0);
        const right = binary.getChildAt(2);
        if (ts.isObjectLiteralExpression(right)) {
            return right;
        }
    }

    protected parsePropertyAssignment(node: ts.PropertyAssignment): { identifier: string, line: number } {
        const identifier = node.getChildAt(0).getText();
        const line = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line;
        return { identifier, line };
    }

    protected parseRules(node: ts.ObjectLiteralElementLike) {
        const rules = {} as Record<string, number>;

        if (ts.isPropertyAssignment(node)) {
            const initializer = node.initializer;
            if (ts.isObjectLiteralExpression(initializer)) {
                for (const rule of initializer.properties) {
                    if (ts.isPropertyAssignment(rule)) {
                        const { identifier, line } = this.parsePropertyAssignment(rule);
                        rules[identifier] = line;
                    }
                }
            }
        }

        return rules;
    }

    protected parseConfigs(node: ts.ObjectLiteralElementLike) {
        let rules = {} as Record<string, number>;

        if (ts.isPropertyAssignment(node)) {
            const initializer = node.initializer;
            if (ts.isObjectLiteralExpression(initializer)) {
                for (const config of initializer.properties) {
                    if (ts.isPropertyAssignment(config)) {
                        const configSettings = config.initializer;
                        if (ts.isObjectLiteralExpression(configSettings)) {
                            for (const configProp of configSettings.properties) {
                                if (this.isRulesObject(configProp)) {
                                    rules = {
                                        ...rules,
                                        ...this.parseRules(configProp),
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        return rules;
    }

    protected parseStatement(statement: ts.Statement) {
        let rules = {} as Record<string, number>;
        if (this.isModuleExportsAssignment(statement)) {
            const exports = this.getModuleExportsObject(statement);
            if (exports) {
                for (const child of exports.properties) {
                    if (this.isRulesObject(child)) {
                        rules = {
                            ...rules,
                            ...this.parseRules(child),
                        };
                    } else if (this.isConfigsObject(child)) {
                        rules = {
                            ...rules,
                            ...this.parseConfigs(child),
                        };
                    }
                }
            }
        }
        return rules;
    }

    public parse() {
        const project = new Project();
        const file = project.createSourceFile("eslintrc.ts", this.editor.document.getText());

        let allRules = {} as Record<string, number>;

        for (const statement of file.getStatements()) {
            const rules = this.parseStatement(statement.compilerNode);
            allRules = {
                ...allRules,
                ...rules,
            };
        }

        return allRules;
    }
}