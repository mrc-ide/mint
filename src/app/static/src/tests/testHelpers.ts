import {ActionTree, MutationTree} from "vuex";

export function expectEqualsFrozen(args: any, expected: any) {
    expect(Object.isFrozen(args)).toBe(true);
    expect(args).toStrictEqual(expected);
}

export function expectAllDefined(definitions: any, tree: MutationTree<any> | ActionTree<any, any>) {

    const missing: string[] = [];
    Object.keys(definitions).forEach(k => {
        const mutationName = definitions[k];
        if (!tree[mutationName]) {
            missing.push(mutationName);
        }
    });

    if (missing.length > 0) {
        throw Error(`The following mutations were declared but not defined: ${missing.join(",")}`)
    }
}
