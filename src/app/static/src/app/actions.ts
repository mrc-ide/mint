import {ActionTree} from "vuex";
import {RootState} from "./store";
import {api} from "./apiService";
import {Data, Graph} from "./generated";
import {RootMutation} from "./mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

export enum RootAction {
    FetchPrevalenceGraphData = "FetchPrevalenceGraphData",
    FetchPrevalenceGraphConfig = "FetchPrevalenceGraphConfig",
    FetchImpactTableData = "FetchImpactTableData",
    FetchImpactTableConfig = "FetchImpactTableConfig",
    FetchBaselineOptions = "FetchBaselineOptions",
    FetchInterventionOptions = "FetchInterventionOptions",
    FetchImpactData = "FetchImpactData",
    FetchConfig = "FetchConfig"
}

const currentRegionBaseline = (state: RootState) => {
    return state.currentProject!!.currentRegion.baselineOptions;
};

export const actions: ActionTree<RootState, RootState> = {

    async [RootAction.FetchBaselineOptions](context) {
        await api(context)
            .withSuccess(RootMutation.AddBaselineOptions)
            .withError(RootMutation.AddError)
            .get<DynamicFormMeta>("/baseline/options")
    },

    async [RootAction.FetchInterventionOptions](context) {
        await api(context)
            .withSuccess(RootMutation.AddInterventionOptions)
            .withError(RootMutation.AddError)
            .get<DynamicFormMeta>("/intervention/options")
    },

    async [RootAction.FetchPrevalenceGraphData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", currentRegionBaseline(context.state))
    },

    async [RootAction.FetchPrevalenceGraphConfig](context) {
        await api(context)
            .withSuccess(RootMutation.AddPrevalenceGraphConfig)
            .withError(RootMutation.AddError)
            .get<Graph>("/impact/graph/prevalence/config")
    },

    async [RootAction.FetchImpactTableData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddImpactTableData)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/table/data", currentRegionBaseline(context.state))
    },

    async [RootAction.FetchImpactTableConfig](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddImpactTableConfig)
            .withError(RootMutation.AddError)
            .get<Data>("/impact/table/config")
    },

    async [RootAction.FetchImpactData](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchPrevalenceGraphData),
            context.dispatch(RootAction.FetchImpactTableData)
        ]);
    },

    async [RootAction.FetchConfig](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchBaselineOptions),
            context.dispatch(RootAction.FetchInterventionOptions),
            context.dispatch(RootAction.FetchPrevalenceGraphConfig),
            context.dispatch(RootAction.FetchImpactTableConfig)
        ]);
    }

};
