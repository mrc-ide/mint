import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph} from "./generated";

export enum RootMutation {
    AddProject = "AddProject",
    SetCurrentRegion = "SetCurrentRegion",
    AddError = "AddError",
    AddPrevalenceGraphData = "AddPrevalenceGraphData",
    AddPrevalenceGraphConfig = "AddPrevalenceGraphConfig"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.SetCurrentRegion](state: RootState, payload: string) {
        state.currentProject && state.currentProject.setCurrentRegion(payload);
    },

    [RootMutation.AddError](state: RootState, payload: APIError) {
        state.errors.push(payload)
    },

    [RootMutation.AddPrevalenceGraphData](state: RootState, payload: Data) {
        state.prevalenceGraphData = payload
    },

    [RootMutation.AddPrevalenceGraphConfig](state: RootState, payload: Graph) {
        state.prevalenceGraphConfig = payload
    }
}
