import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {deepCopy} from "../utils";
import {Data} from "../generated";

export interface Region {
    name: string
    slug: string
    url: string
    baselineOptions: DynamicFormMeta
    baselineSettings: DynamicFormData
    interventionOptions: DynamicFormMeta
    interventionSettings: DynamicFormData
    prevalenceGraphData: Data
    tableData: Data
    step: number
}

export const getSlug = (name: string) => name.replace(/\s/g, "-").toLowerCase();

export class Region {
    constructor(name: string,
                parent: Project,
                baselineOptions: DynamicFormMeta,
                interventionOptions: DynamicFormMeta) {
        this.name = name;
        this.slug = getSlug(name);
        this.url = `/projects/${parent.slug}/regions/${this.slug}`;
        this.baselineOptions = deepCopy(baselineOptions);
        this.baselineSettings = {};
        this.interventionOptions = deepCopy(interventionOptions);
        this.interventionSettings =  {};
        this.interventionOptions.controlSections.map(s => {
            s.controlGroups.map(g => {
                g.controls.map(c => {
                    this.interventionSettings[c.name] = null;
                })
            })
        });
        this.prevalenceGraphData = [];
        this.tableData = [];
        this.step = 1;
    }

}

export interface Project {
    name: string;
    slug: string;
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
        this.slug = getSlug(name);
        this.regions = regionsName.map(n => new Region(n, this, baselineOptions, interventionOptions));
        this.currentRegion = currentRegion || this.regions[0]
    }
}
