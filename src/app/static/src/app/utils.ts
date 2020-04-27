import {mapMutations, MutationMethod} from "vuex";
import {ResponseFailure, ResponseSuccess} from "./generated";

export const mapMutationByName = (name: string): MutationMethod => {
    return mapMutations([name])[name]
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
    let result = null;
    if(!data) return result;

    if(Array.isArray(data)) {
        result = [];
        for (let item of data) {
            result.push(deepCopy(item));
        }
    } else if (typeof data === "object") {
        result = {} as any;
        for(let prop in data) {
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
            for (let prop in data) {
                if (data.hasOwnProperty(prop)) {
                    data[prop] = freezer.deepFreeze(data[prop])
                }
            }
            return Object.freeze(data);
        }
        return data;
    }
};
