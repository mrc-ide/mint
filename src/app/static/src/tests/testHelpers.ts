import {ActionContext, MutationTree} from "vuex";

export function expectEqualsFrozen(args: any, expected: any) {
    expect(Object.isFrozen(args)).toBe(true);
    expect(args).toStrictEqual(expected);
}

export function expectAllMutationsDefined(mutationDefinitions: any, mutationTree: MutationTree<any>) {

    const missing: string[] = [];
    Object.keys(mutationDefinitions).forEach(k => {
        const mutationName = mutationDefinitions[k];
        if (!mutationTree[mutationName]) {
            missing.push(mutationName);
        }
    });

    if (missing.length > 0) {
        throw Error(`The following mutations were declared but not defined: ${missing.join(",")}`)
    }
}
