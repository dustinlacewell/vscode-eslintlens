export class RuleName {
    scope: string;
    package: string;
    rule: string;

    constructor(name: string) {
        const { scope, packageName, ruleName } = this.parseName(name);

        this.scope = scope;
        this.package = packageName;
        this.rule = ruleName;
    }

    protected matchName(name: string) {
        const pattern = /((@[a-zA-Z0-9\-_]+)\/)?(([\w\d\-_]+)\/)?([\w\d\-_]+)/;

        const match = name.match(pattern);

        if (!match) {
            throw new Error(`Invalid plugin name: ${name}`);
        }

        const [, , scope, , packageName, ruleName] = match;
        return [scope || '', packageName || '', ruleName] as const;
    }

    protected parseName(name: string) {
        const [scope, packageName, ruleName] = this.matchName(name);

        return {
            scope,
            packageName,
            ruleName,
        };
    }

    protected join(...parts: string[]) {
        return parts.filter(Boolean).join("/");
    }

    get qualifiedPackage() {
        return this.join(this.scope, this.package);
    }

    get qualifiedName() {
        return this.join(
            this.scope,
            this.package,
            this.rule,
        );
    }

    get folder() {
        return `eslint-plugin${this.package ? `-${this.package}` : ""}`;
    }

    get directory() {
        return this.join(
            this.scope,
            this.folder,
        );
    }
}