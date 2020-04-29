import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

export enum RootMutation {
    AddProject = "AddProject",
    SetCurrentRegion = "SetCurrentRegion",
    SetCurrentRegionBaselineOptions = "SetCurrentRegionBaselineOptions",
    AddError = "AddError",
    AddBaselineOptions = "AddBaselineOptions",

    //ClearPrevalenceGraphData = "ClearPrevalenceGraphData",

    AddPrevalenceGraphData1 = "AddPrevalenceGraphData1",
    AddPrevalenceGraphData2 = "AddPrevalenceGraphData2",
    AddPrevalenceGraphData3 = "AddPrevalenceGraphData3",
    AddPrevalenceGraphData4 = "AddPrevalenceGraphData4",
    AddPrevalenceGraphData5 = "AddPrevalenceGraphData5",
    AddPrevalenceGraphData6 = "AddPrevalenceGraphData6",
    AddPrevalenceGraphData7 = "AddPrevalenceGraphData7",
    AddPrevalenceGraphData8 = "AddPrevalenceGraphData8",
    AddPrevalenceGraphData9 = "AddPrevalenceGraphData9",
    AddPrevalenceGraphData10 = "AddPrevalenceGraphData10",

    AddPrevalenceGraphConfig = "AddPrevalenceGraphConfig",
    AddImpactTableData = "AddImpactTableData"
}

export const mutations: MutationTree<RootState> = {

    [RootMutation.AddProject](state: RootState, payload: Project) {
        state.projects.push(payload)
        state.currentProject = payload
    },

    [RootMutation.SetCurrentRegion](state: RootState, payload: string) {
        state.currentProject && state.currentProject.setCurrentRegion(payload);
    },

    [RootMutation.SetCurrentRegionBaselineOptions](state: RootState, payload: DynamicFormMeta) {
        if (state.currentProject) {
            state.currentProject.currentRegion.baselineOptions = payload;
        }
    },

    [RootMutation.AddError](state: RootState, payload: APIError) {
        state.errors.push(payload)
    },

    [RootMutation.AddBaselineOptions](state: RootState, payload: DynamicFormMeta) {
        state.baselineOptions = payload
    },

   /* [RootMutation.ClearPrevalenceGraphData](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData1 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData2 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData3 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData4 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData5 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData6 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData7 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData8 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData9 = [];
        state.currentProject!!.currentRegion.prevalenceGraphData10 = [];
    },*/

    [RootMutation.AddPrevalenceGraphData1](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData1 = payload
    },

    [RootMutation.AddPrevalenceGraphData2](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData2 = payload
    },

    [RootMutation.AddPrevalenceGraphData3](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData3 = payload
    },

    [RootMutation.AddPrevalenceGraphData4](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData4 = payload
    },

    [RootMutation.AddPrevalenceGraphData5](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData5 = payload
    },

    [RootMutation.AddPrevalenceGraphData6](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData6 = payload
    },

    [RootMutation.AddPrevalenceGraphData7](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData7 = payload
    },

    [RootMutation.AddPrevalenceGraphData8](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData8 = payload
    },

    [RootMutation.AddPrevalenceGraphData9](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData9 = payload
    },

    [RootMutation.AddPrevalenceGraphData10](state: RootState, payload: Data) {
        state.currentProject!!.currentRegion.prevalenceGraphData10 = payload
    },

    [RootMutation.AddPrevalenceGraphConfig](state: RootState, payload: Graph) {
        state.prevalenceGraphConfig = payload
    },

    [RootMutation.AddImpactTableData](state: RootState, payload: Data) {
        state.impactTableData = payload
    }
};
