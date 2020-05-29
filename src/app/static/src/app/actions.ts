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
    FetchCostEfficacyGraphConfig = "FetchCostEfficacyGraphConfig",
    FetchCostGraphData = "FetchCostCasesGraphData",
    FetchBaselineOptions = "FetchBaselineOptions",
    FetchInterventionOptions = "FetchInterventionOptions",
    EnsureImpactData = "FetchImpactData",
    EnsureCostEffectivenessData = "FetchCostEffectivenessData",
    FetchConfig = "FetchConfig"
}

const currentRegionBaseline = (state: RootState) => {
    return state.currentProject!!.currentRegion.baselineOptions;
};

const currentRegionInterventions = (state: RootState) => {
    return state.currentProject!!.currentRegion.interventionSettings;
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
        await api(context)
            .withSuccess(RootMutation.AddCostCasesGraphConfig)
            .withError(RootMutation.AddError)
            .get<Graph>("/cost/graph/cases-averted/config");
    },

    async [RootAction.FetchCostEfficacyGraphConfig](context) {
            //TODO: Fetch from mintr via backend
            context.commit(RootMutation.AddCostEfficacyGraphConfig,
            {
                metadata: {
                        x_col: "efficacy",
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
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
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
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
                        }
                    },
                    {
                        id: "PBO",
                        name: "Switch to Pyrethoid-PBO ITN",
                        type: "scatter",
                        marker: {color: "turquoise", size: 10},
                        error_x: {
                            type: "data",
                            width: 0,
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
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
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
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
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
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
                            col: "efficacy_error_plus",
                            colminus: "efficacy_error_minus"
                        }
                    }
                ],
                    layout: {
                title: "Strategy costs over 3 years vs Efficacy",
                    xaxis: {
                    title: 'Efficacy against cases (%)',
                        showline: true,
                        range: [-2, 100],
                        tickvals: [0, 20, 40, 60, 80, 100],
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
                },
                hoverlabel: {
                    namelength: -1
                },
                mintcustom: {
                    hoverposition: "below"
                },
                hovermode: 'closest'
            }
        });
    },

    async [RootAction.FetchCostGraphData](context) {
        const combinedSettings = {
            ...currentRegionBaseline(context.state),
            ...currentRegionInterventions(context.state)
        };
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddCostGraphData)
            .withError(RootMutation.AddError)
            .postAndReturn("/cost/graph/data", combinedSettings);
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

    async [RootAction.EnsureImpactData](context) {
        const project = context.state.currentProject;
        if (project && (!project.currentRegion.impactTableData.length || !project.currentRegion.prevalenceGraphData.length)) {
            await Promise.all([
                context.dispatch(RootAction.FetchPrevalenceGraphData),
                context.dispatch(RootAction.FetchImpactTableData)
            ]);
        }
    },

    async [RootAction.EnsureCostEffectivenessData](context) {
        const project = context.state.currentProject;
        if (project && !project.currentRegion.costGraphData.length) {
            await Promise.all([
                context.dispatch(RootAction.FetchCostGraphData)
            ]);
        }
    },

    async [RootAction.FetchConfig](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchBaselineOptions),
            context.dispatch(RootAction.FetchInterventionOptions),
            context.dispatch(RootAction.FetchPrevalenceGraphConfig),
            context.dispatch(RootAction.FetchImpactTableConfig),
            context.dispatch(RootAction.FetchCostCasesGraphConfig),
            context.dispatch(RootAction.FetchCostEfficacyGraphConfig)
        ]);
    }

};
