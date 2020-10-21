import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {deepCopy} from "../utils";
import {Data} from "../generated";

export interface Region {
    name: string
    url: string
    baselineOptions: DynamicFormMeta
    interventionOptions: DynamicFormMeta
    interventionSettings: DynamicFormData
    prevalenceGraphData: Data
    impactTableData: Data
    costGraphData: Data
    costTableData: Data
    step: number
}

export class Region {
    constructor(name: string,
                parent: Project,
                baselineOptions: DynamicFormMeta,
                interventionOptions: DynamicFormMeta) {
        this.name = name;
        this.url = `/projects/${parent.name}/regions/${name}`.replace(/\s/g, "-").toLowerCase();
        this.baselineOptions = deepCopy(baselineOptions);
        this.interventionOptions = deepCopy(interventionOptions);
        this.interventionSettings =  {}
        this.interventionOptions.controlSections.map(s => {
            s.controlGroups.map(g => {
                g.controls.map(c => {
                    this.interventionSettings[c.name] = null;
                })
            })
        });
        this.prevalenceGraphData = [];
        this.impactTableData = [];
        this.costGraphData = [];
        this.costTableData = [];
        this.step = 1;
    }

}

export interface Project {
    name: string;
    regions: Region[];
    currentRegion: Region;
}

export class Project {

    constructor(name: string,
                regionsName: string[],
                baselineOptions: DynamicFormMeta,
                interventionOptions: DynamicFormMeta,
                currentRegion: Region | null = null) {
        this.name = name;
        this.regions = regionsName.map(n => new Region(n, this, baselineOptions, interventionOptions));
        this.currentRegion = currentRegion || this.regions[0]
    }
}
