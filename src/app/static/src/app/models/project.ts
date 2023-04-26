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
        this.interventionSettings = {};
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
    strategies: StrategyWithThreshold[];
    budget: number;
}

export class Project {
    constructor(name: string,
        regionsName: string[],
        baselineOptions: DynamicFormMeta,
        interventionOptions: DynamicFormMeta,
        currentRegion: Region | null = null,
        strategies: StrategyWithThreshold[] = [],
        budget = 2_000_000
    ) {
        this.name = name;
        this.slug = getSlug(name);
        this.regions = regionsName.map(n => new Region(n, this, baselineOptions, interventionOptions));
        this.currentRegion = currentRegion || this.regions[0];
        this.strategies = strategies;
        this.budget = budget;
    }
}

export interface StrategyWithThreshold {
    costThreshold: number
    interventions: {
        zone: string,
        intervention: string,
        cost: number,
        casesAverted: number,
        casesAvertedErrorMinus: number,
        casesAvertedErrorPlus: number
    }[]
}

export interface Versions {
    mint: string
    data: string,
    mintr: string
}
