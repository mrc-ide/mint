import {MutationTree} from "vuex";
import {Project, RootState} from "./store";
import {APIError} from "./apiService";

export enum RootMutation {
    AddProject = "AddProject",
    ErrorAdded = "ErrorAdded"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.ErrorAdded](state: RootState, payload: APIError) {
        state.errors.push(payload)
    }
}
