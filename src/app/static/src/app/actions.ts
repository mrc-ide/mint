import {ActionTree} from "vuex";
import {RootState} from "./store";
import {api} from "./apiService";
import {Data} from "./generated";
import {RootMutation} from "./mutations";

export enum RootAction {
    FetchPrevalenceGraphData = "FetchPrevalenceGraphData"
}

export const actions: ActionTree<RootState, RootState> = {

    async [RootAction.FetchPrevalenceGraphData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true})
    }
}
