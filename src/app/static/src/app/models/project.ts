import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {deepCopy} from "../utils";
import {Data} from "../generated";

export interface Region {
    name: string
    url: string
    baselineOptions: DynamicFormMeta

    prevalenceGraphData1: Data
    prevalenceGraphData2: Data
    prevalenceGraphData3: Data
    prevalenceGraphData4: Data
    prevalenceGraphData5: Data
    prevalenceGraphData6: Data
    prevalenceGraphData7: Data
    prevalenceGraphData8: Data
    prevalenceGraphData9: Data
    prevalenceGraphData10: Data
}

export class Region {
    constructor(name: string, parent: Project, baselineOptions: DynamicFormMeta) {
        this.name = name;
        this.url = `/projects/${parent.name}/regions/${name}`.replace(/\s/g, "-").toLowerCase();
        this.baselineOptions = deepCopy(baselineOptions);

        this.prevalenceGraphData1 = [];
        this.prevalenceGraphData2 = [];
        this.prevalenceGraphData3 = [];
        this. prevalenceGraphData4 = [];
        this.prevalenceGraphData5 = [];
        this.prevalenceGraphData6 = [];
        this.prevalenceGraphData7 = [];
        this.prevalenceGraphData8 =[];
        this.prevalenceGraphData9 = [];
        this.prevalenceGraphData10 = [];
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
