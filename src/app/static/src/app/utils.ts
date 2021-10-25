import {ActionMethod, mapActions, mapMutations, mapState, MutationMethod} from "vuex";
import {ResponseFailure} from "./generated";
import {Dict} from "@reside-ic/vue-dynamic-form";

export const mapMutationByName = (name: string): MutationMethod => {
    return mapMutations([name])[name]
};

class ComputedWithType<T> {
}

export const mapStateProp = <S, T>(func: (s: S) => T, namespace: string | null = null): ComputedWithType<T> => {
    return namespace && (mapState<S>(namespace, {prop: (state: S) => func(state)}) as Dict<ComputedWithType<T>>)["prop"]
        || (mapState<S>({prop: (state: S) => func(state)}) as Dict<ComputedWithType<T>>)["prop"]
};

export const mapActionByName = <T>(name: string, namespace: string | null = null): ActionMethod => {
    return (!!namespace && mapActions(namespace, [name])[name]) || mapActions([name])[name]
};

function isMINTError(object: any): object is Error {
    return typeof object.error == "string"
        && object.details == undefined || typeof object.details == "string"
}

export function isMINTResponseFailure(object: any): object is ResponseFailure {
    return object && object.status == "failure"
        && (Array.isArray(object.errors))
        && object.errors.every((e: any) => isMINTError(e))
}

export function deepCopy(data: any): any {
    if (data == null) {
        return null;
    }

    let result = null;
    if(Array.isArray(data)) {
        result = [];
        for (const item of data) {
            result.push(deepCopy(item));
        }
    } else if (typeof data === "object") {
        result = {} as any;
        for(const prop in data) {
            if (data.hasOwnProperty(prop)) {
                result[prop] = deepCopy(data[prop]);
            }
        }
    }

    return result || data;
}

export const freezer = {

    deepFreeze: (data: any): any => {
        if (Array.isArray(data)) {
            return Object.freeze(data.map(d => freezer.deepFreeze(d)))
        }
        if (data != null && typeof data === "object") {
            for (const prop in data) {
                if (data.hasOwnProperty(prop)) {
                    data[prop] = freezer.deepFreeze(data[prop])
                }
            }
            return Object.freeze(data);
        }
        return data;
    }
};
