import {MutationTree} from "vuex";
import {Project, RootState} from "./store";

export enum RootMutation {
    AddProject = "AddProject"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    }
}
