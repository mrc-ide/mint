import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project, Region} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph, TableDefinition} from "./generated";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

export enum RootMutation {
    AddProject = "AddProject",
    SetCurrentProject = "SetCurrentProject",
    SetCurrentRegion = "SetCurrentRegion",
    SetCurrentRegionBaselineOptions = "SetCurrentRegionBaselineOptions",
    SetCurrentRegionInterventionOptions = "SetCurrentRegionInterventionOptions",
    SetCurrentRegionInterventionSettings = "SetCurrentRegionInterventionSettings",
    SetCurrentRegionStep = "SetCurrentRegionStep",
    AddError = "AddError",
    AddBaselineOptions = "AddBaselineOptions",
    AddInterventionOptions = "AddInterventionOptions",
    AddPrevalenceGraphData = "AddPrevalenceGraphData",
    AddPrevalenceGraphConfig = "AddPrevalenceGraphConfig",
    AddImpactTableData = "AddImpactTableData",
    AddImpactTableConfig = "AddImpactTableConfig",
    AddCostGraphData = "AddCostGraphData",
    AddCostCasesGraphConfig = "AddCostCasesGraphConfig",
    AddCostTableData = "AddCostTableData",
    AddCostTableConfig = "AddCostTableConfig",
    AddCostEfficacyGraphConfig = "AddCostEfficacyGraphConfig"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.SetCurrentProject](state: RootState, project: Project | null) {
        state.currentProject = project;
    },

    [RootMutation.SetCurrentRegion](state: RootState, region: Region) {
        state.currentProject!!.currentRegion = region;
    },

    [RootMutation.SetCurrentRegionBaselineOptions](state: RootState, payload: DynamicFormMeta) {
        if (state.currentProject) {
            state.currentProject.currentRegion.baselineOptions = payload;

            //Invalidate current region data
            state.currentProject.currentRegion.impactTableData = [];
            state.currentProject.currentRegion.prevalenceGraphData = [];
        }
    },

    [RootMutation.SetCurrentRegionInterventionOptions](state: RootState,
                                                       payload: DynamicFormMeta) {
        if (state.currentProject) {
            state.currentProject.currentRegion.interventionOptions = payload
        }
    },

    [RootMutation.SetCurrentRegionInterventionSettings](state: RootState, payload: DynamicFormData) {
        if (state.currentProject) {
            state.currentProject.currentRegion.interventionSettings = payload;
        }
    },

    [RootMutation.SetCurrentRegionStep](state: RootState, payload: number) {
        if (state.currentProject) {
            state.currentProject.currentRegion.step = payload;
        }
    },

    [RootMutation.AddError](state: RootState, payload: APIError) {
        state.errors.push(payload)
    },

    [RootMutation.AddBaselineOptions](state: RootState, payload: DynamicFormMeta) {
        state.baselineOptions = payload
    },

    [RootMutation.AddInterventionOptions](state: RootState, payload: DynamicFormMeta) {
        state.interventionOptions = payload
    },

    [RootMutation.AddPrevalenceGraphData](state: RootState, payload: Data) {
        if (state.currentProject) {
            state.currentProject.currentRegion.prevalenceGraphData = payload;
        }
    },

    [RootMutation.AddPrevalenceGraphConfig](state: RootState, payload: Graph) {
        state.prevalenceGraphConfig = payload
    },

    [RootMutation.AddImpactTableData](state: RootState, payload: Data) {
        if (state.currentProject) {
            state.currentProject.currentRegion.impactTableData = payload;
        }
    },

    [RootMutation.AddImpactTableConfig](state: RootState, payload: TableDefinition) {
        state.impactTableConfig = payload
    },

    [RootMutation.AddCostGraphData](state: RootState, payload: Data) {
        if (state.currentProject) {
            state.currentProject.currentRegion.costGraphData = payload;
        }
    },

    [RootMutation.AddCostCasesGraphConfig](state: RootState, payload: Graph) {
        state.costCasesGraphConfig = payload;
    },

    [RootMutation.AddCostTableData](state: RootState, payload: Data) {
        if (state.currentProject) {
            state.currentProject.currentRegion.costTableData = payload;
        }
    },

    [RootMutation.AddCostTableConfig](state: RootState, payload: TableDefinition) {
        state.costTableConfig = payload
    },

    [RootMutation.AddCostEfficacyGraphConfig](state: RootState, payload: Graph) {
        state.costEfficacyGraphConfig = payload;
    }
};
