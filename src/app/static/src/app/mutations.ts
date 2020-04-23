import {MutationTree} from "vuex";
import {Project, RootState} from "./store";
import {APIError} from "./apiService";
import {Data} from "./generated";

export enum RootMutation {
    AddProject = "AddProject",
    ErrorAdded = "ErrorAdded",
    PrevalenceGraphDataFetched = "PrevalenceGraphDataFetched"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.ErrorAdded](state: RootState, payload: APIError) {
        state.errors.push(payload)
    },

    [RootMutation.PrevalenceGraphDataFetched](state: RootState, payload: Data) {
        // TODO
    }
}
