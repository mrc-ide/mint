import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {deepCopy} from "../utils";

export interface Region {
    name: string
    url: string
    baselineOptions: DynamicFormMeta
    step: number
}

export class Region {
    constructor(name: string, parent: Project, baselineOptions: DynamicFormMeta) {
        this.name = name;
        this.url = `/projects/${parent.name}/regions/${name}`.replace(/\s/g, "-").toLowerCase();
        this.baselineOptions = deepCopy(baselineOptions);
        this.step = 1;
    }
}

export interface Project {
    name: string;
    regions: Region[];
    currentRegion: Region;
}

export class Project {

    constructor(name: string, regionsName: string[], baselineOptions: DynamicFormMeta, currentRegion: Region | null = null) {
        this.name = name;
        this.regions = regionsName.map(n => new Region(n, this, baselineOptions));
        this.currentRegion = currentRegion || this.regions[0]
    }

    setCurrentRegion(url: string) {
        const region = this.regions.find(r => r.url == url);
        if (!region) {
            throw Error(`${url} does not correspond to a valid region`)
        }
        this.currentRegion = region;
    }
}
