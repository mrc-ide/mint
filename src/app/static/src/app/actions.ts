import {ActionTree} from "vuex";
import {Project, RootState} from "./store";

export enum RootAction {
    FetchPrevalenceGraphData = "FetchPrevalenceGraphData"
}

export const actions: ActionTree<RootState, RootState> = {

    [RootAction.FetchPrevalenceGraphData](context) {

    }
}
