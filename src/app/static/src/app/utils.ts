import {mapMutations, MutationMethod} from "vuex";

export const mapMutationByName = (name: string): MutationMethod => {
    return mapMutations([name])[name]
};
