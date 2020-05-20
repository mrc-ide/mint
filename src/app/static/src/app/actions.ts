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
    FetchCostCasesGraphConfig = "FetchCostCasesGraphConfig",
    FetchCostGraphData = "FetchCostCasesGraphData",
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

    async [RootAction.FetchCostCasesGraphConfig](context) {
        //TODO: Fetch from mintr via backend
        context.commit(RootMutation.AddCostCasesGraphConfig,
            {
                metadata: {
                    x_col: "cases_averted",
                    y_col: "cost",
                    id_col: "interventions",
                    error_plus_col: "cases_averted_error_plus",
                    error_minus_col: "cases_averted_error_minus",
                    color_col: "color",
                    format: "scatter"
                },
                config: {
                    marker_size: 10
                },
                layout: {
                    title: "Strategy costs over 3 years",
                    xaxis: {
                        title: 'Cases averted per 1,000 people across 3-years',
                        showline: true,
                        range: [-2, 800],
                        tickvals: [0, 100, 200, 300, 400, 500, 600, 700],
                        autorange: false,
                        zeroline: false,
                    },
                    yaxis: {
                        title: 'Total costs ($10,000 USD)',
                        showline: true,
                        range: [0, 30],
                        tickvals: [0, 10 , 20],
                        autorange: false
                    }
                },
                series: []
            });
    },

    async [RootAction.FetchCostGraphData](context) {
        //TODO: Fetch from mintr via backend
        context.commit(RootMutation.AddCostGraphData,
            [
                {
                    intervention: "No intervention",
                    cost: 0,
                    cases_averted: 0,
                    cases_averted_error_minus: 0,
                    cases_averted_error_plus: 0,
                    color: "grey"
                },
                {
                    intervention: "Pyrethoid ITN",
                    cost: 8,
                    cases_averted: 280,
                    cases_averted_error_minus: 90,
                    cases_averted_error_plus: 85,
                    color: "blue"
                },
                {
                    intervention: "Switch to Pyrethoid-PBO ITN",
                    cost: 9,
                    cases_averted: 325,
                    cases_averted_error_minus: 85,
                    cases_averted_error_plus: 80,
                    color: "aquamarine"
                },
                {
                    intervention: "Only IRS",
                    cost: 17,
                    cases_averted: 630,
                    cases_averted_error_minus: 120,
                    cases_averted_error_plus: 140,
                    color: "purple"
                },
                {
                    intervention: "Add IRS to Pyrethoid ITN",
                    cost: 22,
                    cases_averted: 635,
                    cases_averted_error_minus: 75,
                    cases_averted_error_plus: 120,
                    color: "darkred"
                },
                {
                    intervention: "Add IRS to Pyrethoid-PBO ITN",
                    cost: 23,
                    cases_averted: 636,
                    cases_averted_error_minus: 65,
                    cases_averted_error_plus: 125,
                    cases_color: "orange"
                }
            ]);
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
