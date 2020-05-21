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
    FetchCostEffectivenessData = "FetchCostEffectivenessData",
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
                    id_col: "intervention",
                    format: "long"
                },
                series: [
                    {
                        id: "none",
                        name: "No intervention",
                        type: "scatter",
                        marker: {color: "grey", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    },
                    {
                        id: "ITN",
                        name: "Pyrethoid ITN",
                        type: "scatter",
                        marker: {color: "blue", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    },
                    {
                        id: "PBO",
                        name: "Switch to Pyrethoid-PBO ITN",
                        type: "scatter",
                        marker: {color: "aquamarine", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    },
                    {
                        id: "IRS",
                        name: "Only IRS",
                        type: "scatter",
                        marker: {color: "purple", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    },
                    {
                        id: "ITN-IRS",
                        name: "Add IRS to Pyrethoid ITN",
                        type: "scatter",
                        marker: {color: "darkred", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    },
                    {
                        id: "PBO-IRS",
                        name: "Add IRS to Pyrethoid-PBO ITN",
                        type: "scatter",
                        marker: {color: "orange", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            cols: "cases_averted_error_plus",
                            colsminus: "cases_averted_error_minus"
                        }
                    }
                ],
                layout: {
                    title: "Strategy costs over 3 years",
                    xaxis: {
                        title: 'Cases averted per 1,000 people across 3-years',
                        showline: true,
                        range: [-10, 800],
                        tickvals: [0, 100, 200, 300, 400, 500, 600, 700],
                        autorange: false,
                        zeroline: false
                    },
                    yaxis: {
                        title: 'Total costs ($10,000 USD)',
                        showline: true,
                        range: [-2, 30],
                        tickvals: [0, 10 , 20],
                        autorange: false,
                        zeroline: false
                    }
                }
            });
    },

    async [RootAction.FetchCostGraphData](context) {
        //TODO: Fetch from mintr via backend
        context.commit(RootMutation.AddCostGraphData,
            [
                {
                    intervention: "none",
                    cost: 0,
                    cases_averted: 0,
                    cases_averted_error_minus: 0,
                    cases_averted_error_plus: 0,
                    efficacy: 0,
                    efficacy_error_minus: 0,
                    efficacy_error_plus: 0
                },
                {
                    intervention: "ITN",
                    cost: 8,
                    cases_averted: 280,
                    cases_averted_error_minus: 90,
                    cases_averted_error_plus: 85,
                    efficacy: 40,
                    efficacy_error_minus: 3,
                    efficacy_error_plus: 1,
                },
                {
                    intervention: "PBO",
                    cost: 9,
                    cases_averted: 325,
                    cases_averted_error_minus: 85,
                    cases_averted_error_plus: 80,
                    efficacy: 45,
                    efficacy_error_minus: 4,
                    efficacy_error_plus: 2,
                },
                {
                    intervention: "IRS",
                    cost: 17,
                    cases_averted: 630,
                    cases_averted_error_minus: 120,
                    cases_averted_error_plus: 140,
                    efficacy: 72,
                    efficacy_error_minus: 8,
                    efficacy_error_plus: 3
                },
                {
                    intervention: "ITN-IRS",
                    cost: 22,
                    cases_averted: 635,
                    cases_averted_error_minus: 75,
                    cases_averted_error_plus: 120,
                    efficacy: 70,
                    efficacy_error_minus: 6,
                    efficacy_error_plus: 4
                },
                {
                    intervention: "PBO-IRS",
                    cost: 23,
                    cases_averted: 636,
                    cases_averted_error_minus: 65,
                    cases_averted_error_plus: 125,
                    efficacy: 74,
                    efficacy_error_minus: 2,
                    efficacy_error_plus: 5
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

    async [RootAction.FetchCostEffectivenessData](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchCostGraphData)
        ]);
    },

    async [RootAction.FetchConfig](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchBaselineOptions),
            context.dispatch(RootAction.FetchInterventionOptions),
            context.dispatch(RootAction.FetchPrevalenceGraphConfig),
            context.dispatch(RootAction.FetchImpactTableConfig),
            context.dispatch(RootAction.FetchCostCasesGraphConfig)
        ]);
    }

};
