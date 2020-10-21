import {ActionTree} from "vuex";
import {RootState} from "./store";
import {api} from "./apiService";
import {Data, Graph} from "./generated";
import {RootMutation} from "./mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {router} from "./router";

export enum RootAction {
    FetchPrevalenceGraphData = "FetchPrevalenceGraphData",
    FetchPrevalenceGraphConfig = "FetchPrevalenceGraphConfig",
    FetchImpactTableData = "FetchImpactTableData",
    FetchImpactTableConfig = "FetchImpactTableConfig",
    FetchCostCasesGraphConfig = "FetchCostCasesGraphConfig",
    FetchCostEfficacyGraphConfig = "FetchCostEfficacyGraphConfig",
    FetchCostGraphData = "FetchCostCasesGraphData",
    FetchCostTableData = "FetchCostTableData",
    FetchCostTableConfig = "FetchCostTableConfig",
    FetchBaselineOptions = "FetchBaselineOptions",
    FetchInterventionOptions = "FetchInterventionOptions",
    EnsureImpactData = "FetchImpactData",
    EnsureCostEffectivenessData = "FetchCostEffectivenessData",
    FetchConfig = "FetchConfig",
    SetCurrentRegion = "SetCurrentRegion"
}

const currentRegionBaseline = (state: RootState) => {
    return state.currentProject!!.currentRegion.baselineSettings;
};

const currentRegionInterventions = (state: RootState) => {
    return state.currentProject!!.currentRegion.interventionSettings;
};

export const actions: ActionTree<RootState, RootState> = {

    async [RootAction.SetCurrentRegion](context, regionUrl: string) {
        const {state, commit} = context;
        const proj = state.currentProject;

        const region = proj && proj.regions.find(r => r.url == regionUrl);
        if (region) {
            commit(RootMutation.SetCurrentRegion, region);
        } else {
            await router.push({
                path: "/"
            })
        }
    },

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
        await api(context)
            .withSuccess(RootMutation.AddCostEfficacyGraphConfig)
            .withError(RootMutation.AddError)
            .get<Graph>("/cost/graph/efficacy/config");
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

    async [RootAction.FetchCostTableData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddCostTableData)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/cost/table/data", currentRegionBaseline(context.state))
    },

    async [RootAction.FetchCostTableConfig](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddCostTableConfig)
            .withError(RootMutation.AddError)
            .get<Data>("/cost/table/config")
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
                context.dispatch(RootAction.FetchCostGraphData),
                context.dispatch(RootAction.FetchCostTableData)
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
            context.dispatch(RootAction.FetchCostEfficacyGraphConfig),
            context.dispatch(RootAction.FetchCostTableConfig)
        ]);
    }

};
