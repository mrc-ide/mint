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
    FetchBaselineOptions = "FetchBaselineOptions"
}

export const actions: ActionTree<RootState, RootState> = {

    async [RootAction.FetchBaselineOptions](context) {
        await api(context)
            .withSuccess(RootMutation.AddBaselineOptions)
            .withError(RootMutation.AddError)
            .get<DynamicFormMeta>("/baseline/options")
    },

    async [RootAction.FetchPrevalenceGraphData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData1)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData2)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData3)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData4)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData5)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData6)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData7)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData8)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData9)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});

        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddPrevalenceGraphData10)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/impact/graph/prevalence/data", {anySettings: true});
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
            .postAndReturn<Data>("/impact/table/data", {anySettings: true})
    }
};
