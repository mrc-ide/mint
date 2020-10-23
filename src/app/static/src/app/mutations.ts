import {MutationTree} from "vuex";
import {RootState} from "./store";
import {Project, Region} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph, TableDefinition} from "./generated";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

export enum RootMutation {
    AddProject = "AddProject",
    AddRegion = "AddRegion",
    SetCurrentRegion = "SetCurrentRegion",
    SetCurrentRegionBaselineOptions = "SetCurrentRegionBaselineOptions",
    SetCurrentRegionBaselineSettings = "SetCurrentRegionBaselineSettings",
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

    [RootMutation.AddRegion](state: RootState, payload: Region) {
        // it is an error to call this mutation before current project is set
        state.currentProject!!.regions.push(payload);
    },

    [RootMutation.SetCurrentRegion](state: RootState, payload: string) {
        state.currentProject && state.currentProject.setCurrentRegion(payload);
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

    [RootMutation.SetCurrentRegionBaselineSettings](state: RootState, payload: DynamicFormData) {
        if (state.currentProject) {
            state.currentProject.currentRegion.baselineSettings = payload;
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
        //state.interventionOptions = payload
        state.interventionOptions = {
            "controlSections": [
                {
                    "label": "Procurement and distribution",
                    "controlGroups": [
                        {
                            "controls": [
                                {
                                    "name": "procure_people_per_net",
                                    "label": "When planning procurement, what number of people per net is used?",
                                    "type": "number",
                                    "required": true,
                                    "value": 1.8
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "procure_buffer",
                                    "label": "What percentage is your procurement buffer, if used? (%)",
                                    "type": "number",
                                    "required": true,
                                    "value": 7
                                }
                            ]
                        }
                    ]
                },
                {
                    "label": "Price of interventions",
                    "controlGroups": [
                        {
                            "controls": [
                                {
                                    "name": "price_net_standard",
                                    "label": "Price of standard ITN ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 1.5
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "price_net_pbo",
                                    "label": "Price of PBO ITN ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 2.5
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "price_delivery",
                                    "label": "ITN mass distribution campaign delivery cost per person ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 2.75
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "metabolic",
                                    "label": "Annual cost of IRS per person ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 2.5,
                                    "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "budget_all_zones",
                                    "label": "Total available budget ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 2000000,
                                    "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "zonal_budget",
                                    "label": "Zonal budget ($USD)",
                                    "type": "number",
                                    "required": true,
                                    "value": 500000.05
                                }
                            ]
                        }
                    ]
                },
                {
                    "label": "Intervention coverage potential",
                    "controlGroups": [
                        {
                            "controls": [
                                {
                                    "name": "netUse",
                                    "label": "Expected ITN population use given access",
                                    "type": "select",
                                    "required": true,
                                    "helpText": "Explore the impact of different ITNs given the expected use of nets by the community (the percentage of people sleeping under ITN). A single expected usage can be selected to represent expected ITN use immediately after a mass distribution campaign. The impact of standard pyrethroid only ITNs or PBO ITNs are show (only one net type is implemented for any single scenario).",
                                    "options": [
                                        {"id": "0", "label": "0% usage"},
                                        {"id": "0.2", "label": "20% usage"},
                                        {"id": "0.3", "label": "30% usage"},
                                        {"id": "0.4", "label": "40% usage"},
                                        {"id": "0.5", "label": "50% usage"},
                                        {"id": "0.6", "label": "60% usage"},
                                        {"id": "0.7", "label": "70% usage"},
                                        {"id": "0.8", "label": "80% usage"},
                                        {"id": "0.9", "label": "90% usage"},
                                        {"id": "1", "label": "100% usage"}
                                    ],
                                    "value": "0"
                                }
                            ]
                        },
                        {
                            "controls": [
                                {
                                    "name": "irsUse",
                                    "label": "Expected IRS coverage",
                                    "type": "select",
                                    "required": true,
                                    "helpText": "Indoor residual spraying can be added to areas in addition of any ITN scenarios selected. Houses to receive IRS are selected at random (irrespective of ITN coverage) and coverage estimates represents the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within smaller geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) and is repeated annually prior to the peak of the transmission season (if 'seasonal' transmission setting selected).",
                                    "options": [
                                        {"id": "0", "label": "0% coverage"},
                                        {"id": "0.6", "label": "60% coverage"},
                                        {"id": "0.7", "label": "70% coverage"},
                                        {"id": "0.8", "label": "80% coverage"},
                                        {"id": "0.9", "label": "90% coverage"},
                                        {"id": "1", "label": "100% coverage"}
                                    ],
                                    "value": "0"
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    },

    [RootMutation.AddPrevalenceGraphData](state: RootState, payload: Data) {
        if (state.currentProject) {
           state.currentProject.currentRegion.prevalenceGraphData = payload;
        }
    },

    [RootMutation.AddPrevalenceGraphConfig](state: RootState, payload: Graph) {
        state.prevalenceGraphConfig  = {
            "metadata": {
                "x_col": "month",
                "y_col": "value",
                "id_col": "intervention",
                "format": "long"
            },
            "layout": {
                "title": "Projected prevalence in under 5 year olds",
                "xaxis": {
                    "title": "years of intervention",
                    "showline": true,
                    "tickvals": [12, 24, 36],
                    "ticktext": [1, 2, 3]
                },
                "yaxis": {
                    "title": "prevalence (%)",
                    "showline": true,
                    "autorange": true,
                    //"range": [0, 0.03],
                    //"tickformat": ".1%"
                },
                "mintcustom": {
                    "hovertemplate": "%{y:.2%}",
                }
            },
            "series": [
                {
                    "id": "none",
                    "name": "No intervention",
                    "type": "lines",
                    "marker": {"color": "grey"}
                },
                {
                    "id": "llin",
                    "name": "Pyrethroid LLIN only",
                    "type": "lines",
                    "marker": {"color": "blue"}
                },
                {
                    "id": "irs",
                    "name": "IRS only",
                    "type": "lines",
                    "marker": {"color": "purple"}
                },
                {
                    "id": "irs-llin",
                    "name": "Pyrethroid LLIN with IRS",
                    "type": "lines",
                    "marker": {"color": "blue"}
                },
                {
                    "id": "llin-pbo",
                    "name": "Pyrethroid-PBO LLIN only",
                    "type": "lines",
                    "marker": {"color": "aquamarine"}
                },
                {
                    "id": "irs-llin-pbo",
                    "name": "Pyrethroid-PBO LLIN with IRS",
                    "type": "lines",
                    "marker": {"color": "aquamarine"}
                },
                {
                    "x": [12, 12],
                    "y": [0, 1],
                    "line": {
                        "dash": "dot",
                        "width": 2,
                        "color": "grey"
                    },
                    "name": "",
                    "showlegend": false,
                    "hoverinfo": "none"
                }
            ],
            "config": {
                "editable": true
            }
        };
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

    [RootMutation.AddCostTableConfig](state: RootState, payload: TableDefinition)
    {
        state.costTableConfig = payload
    },

    [RootMutation.AddCostEfficacyGraphConfig](state: RootState, payload: Graph) {
        state.costEfficacyGraphConfig = payload;
    }
};
