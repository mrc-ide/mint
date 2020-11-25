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
    FetchCasesGraphConfig = "FetchCasesGraphConfig",
    FetchImpactTableConfig = "FetchImpactTableConfig",
    FetchCostCasesGraphConfig = "FetchCostCasesGraphConfig",
    FetchCostEfficacyGraphConfig = "FetchCostEfficacyGraphConfig",
    FetchCostTableConfig = "FetchCostTableConfig",
    FetchBaselineOptions = "FetchBaselineOptions",
    FetchInterventionOptions = "FetchInterventionOptions",
    EnsureImpactData = "FetchImpactData",
    EnsureCostEffectivenessData = "FetchCostEffectivenessData",
    FetchTableData = "FetchTableData",
    FetchConfig = "FetchConfig",
    SetCurrentRegion = "SetCurrentRegion",
    FetchDocs = "FetchDocs"
}

const currentRegionBaseline = (state: RootState) => {
    return state.currentProject!!.currentRegion.baselineSettings;
};

export const actions: ActionTree<RootState, RootState> = {

    async [RootAction.SetCurrentRegion](context, payload: { project: string, region: string }) {
        const {state, commit} = context;
        const proj = state.projects.find(p => p.slug == payload.project);
        const region = proj && proj.regions.find(r => r.slug == payload.region);
        if (region) {
            commit(RootMutation.SetCurrentProject, proj);
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

    async [RootAction.FetchCasesGraphConfig](context) {
        await api(context)
            .withSuccess(RootMutation.AddCasesGraphConfig)
            .withError(RootMutation.AddError)
            .get<Graph>("/impact/graph/cases-averted/config")
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

    async [RootAction.FetchTableData](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddTableData)
            .withError(RootMutation.AddError)
            .postAndReturn<Data>("/table/data", currentRegionBaseline(context.state))
    },

    async [RootAction.FetchImpactTableConfig](context) {
        await api(context)
            .freezeResponse()
            .withSuccess(RootMutation.AddImpactTableConfig)
            .withError(RootMutation.AddError)
            .get<Data>("/impact/table/config")
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
        if (project && (!project.currentRegion.tableData.length || !project.currentRegion.prevalenceGraphData.length)) {
            await Promise.all([
                context.dispatch(RootAction.FetchPrevalenceGraphData),
                context.dispatch(RootAction.FetchTableData)
            ]);
        }
    },

    async [RootAction.EnsureCostEffectivenessData](context) {
        const project = context.state.currentProject;
        if (project && !project.currentRegion.tableData.length) {
            await Promise.all([
                context.dispatch(RootAction.FetchTableData)
            ]);
        }
    },

    async [RootAction.FetchDocs](context) {
        await Promise.all([
            api(context)
                .withSuccess(RootMutation.UpdateImpactDocs)
                .withError(RootMutation.AddError)
                .get<string>("/impact/docs"),
            api(context)
                .withSuccess(RootMutation.UpdateCostDocs)
                .withError(RootMutation.AddError)
                .get<string>("/cost/docs")
        ])
    },

    async [RootAction.FetchConfig](context) {
        await Promise.all([
            context.dispatch(RootAction.FetchPrevalenceGraphConfig),
            context.dispatch(RootAction.FetchCasesGraphConfig),
            context.dispatch(RootAction.FetchImpactTableConfig),
            context.dispatch(RootAction.FetchCostCasesGraphConfig),
            context.dispatch(RootAction.FetchCostEfficacyGraphConfig),
            context.dispatch(RootAction.FetchCostTableConfig)
        ]);
    }

};
