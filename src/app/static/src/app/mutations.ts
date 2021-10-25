import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project, Region, StrategyWithThreshold} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph, TableDefinition} from "./generated";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

export enum RootMutation {
    AddProject = "AddProject",
    SetCurrentProject = "SetCurrentProject",
    AddRegion = "AddRegion",
    SetCurrentRegion = "SetCurrentRegion",
    SetCurrentRegionBaselineOptions = "SetCurrentRegionBaselineOptions",
    SetCurrentRegionBaselineSettings = "SetCurrentRegionBaselineSettings",
    SetCurrentRegionInterventionOptions = "SetCurrentRegionInterventionOptions",
    SetCurrentRegionInterventionSettings = "SetCurrentRegionInterventionSettings",
    SetCurrentRegionStep = "SetCurrentRegionStep",
    AddError = "AddError",
    DismissErrors = "DismissErrors",
    AddBaselineOptions = "AddBaselineOptions",
    AddInterventionOptions = "AddInterventionOptions",
    AddPrevalenceGraphData = "AddPrevalenceGraphData",
    AddPrevalenceGraphConfig = "AddPrevalenceGraphConfig",
    AddCasesGraphConfig = "AddCasesGraphConfig",
    AddImpactTableConfig = "AddImpactTableConfig",
    AddCostCasesGraphConfig = "AddCostCasesGraphConfig",
    AddTableData = "AddTableData",
    AddCostTableConfig = "AddCostTableConfig",
    AddCostPerCaseGraphConfig = "AddCostPerCaseGraphConfig",
    DeleteProject = "DeleteProject",
    UpdateImpactDocs = "UpdateImpactDocs",
    UpdateCostDocs = "UpdateCostDocs",
    SetBudget = "SetBudget",
    UpdateStrategies = "UpdateStrategies"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.DeleteProject](state: RootState, project: Project) {
        state.projects = state.projects.filter(proj => proj != project)
    },

    [RootMutation.SetCurrentProject](state: RootState, project: Project | null) {
        state.currentProject = project;
    },

    [RootMutation.SetCurrentRegion](state: RootState, payload: Region) {
        if (!state.currentProject) {
            throw Error("Attempting to set current region when no current project exists")
        }
        state.currentProject.currentRegion = payload;
    },

    [RootMutation.AddRegion](state: RootState, payload: Region) {
        if (!state.currentProject) {
            throw Error("Attempting to add a region when no current project exists")
        }
        state.currentProject.regions.push(payload);
    },

    [RootMutation.SetCurrentRegionBaselineOptions](state: RootState, payload: DynamicFormMeta) {
        if (state.currentProject) {
            state.currentProject.currentRegion.baselineOptions = payload;

            //Invalidate current region data
            state.currentProject.currentRegion.tableData = [];
            state.currentProject.currentRegion.prevalenceGraphData = [];
        }
    },

    [RootMutation.SetCurrentRegionInterventionOptions](state: RootState,
                                                       payload: DynamicFormMeta) {
        if (state.currentProject) {
            state.currentProject.currentRegion.interventionOptions = payload
        }
    },

    [RootMutation.SetCurrentRegionBaselineSettings](state: RootState, payload: DynamicFormData) {
        if (state.currentProject) {
            state.currentProject.currentRegion.baselineSettings = payload;
        }
    },

    [RootMutation.SetCurrentRegionInterventionSettings](state: RootState, payload: DynamicFormData) {
        if (state.currentProject) {
            state.currentProject.currentRegion.interventionSettings = {
                budgetAllZones: state.currentProject.budget,
                ...payload
            };
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

    [RootMutation.DismissErrors](state: RootState) {
        state.errors = [];
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

    [RootMutation.AddCasesGraphConfig](state: RootState, payload: Graph) {
        state.casesGraphConfig = payload
    },

    [RootMutation.AddTableData](state: RootState, payload: Data) {
        if (state.currentProject) {
            state.currentProject.currentRegion.tableData = payload;
        }
    },

    [RootMutation.AddImpactTableConfig](state: RootState, payload: TableDefinition) {
        state.impactTableConfig = payload
    },

    [RootMutation.AddCostCasesGraphConfig](state: RootState, payload: Graph) {
        state.costCasesGraphConfig = payload;
    },

    [RootMutation.AddCostTableConfig](state: RootState, payload: TableDefinition) {
        state.costTableConfig = payload
    },

    [RootMutation.AddCostPerCaseGraphConfig](state: RootState, payload: Graph) {
        state.costPerCaseGraphConfig = payload;
    },

    [RootMutation.UpdateImpactDocs](state: RootState, payload: string) {
        state.impactDocs = payload;
    },

    [RootMutation.UpdateCostDocs](state: RootState, payload: string) {
        state.costDocs = payload;
    },

    [RootMutation.SetBudget](state: RootState, payload: number) {
        state.currentProject!.budget = payload;
    },

    [RootMutation.UpdateStrategies](state: RootState, payload: StrategyWithThreshold[]) {
        if (state.currentProject) {
            state.currentProject.strategies = payload;
        }
    }

};
