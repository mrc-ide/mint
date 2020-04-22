import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project} from "./models/project";

export enum RootMutation {
    AddProject = "AddProject"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    }
}
