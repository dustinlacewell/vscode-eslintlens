import { existsSync } from "fs";
import { dirname, join } from "path";


export function findParentPathWith(root: string, target: string): string | null {
    const path = join(root, target);

    if (existsSync(path)) {
        return root;
    }

    const parent = dirname(root);

    if (parent === root) {
        return null;
    }

    return findParentPathWith(parent, target);
}