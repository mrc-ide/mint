import {Project, Region} from "../../../models/project";

export const getRegionPopulations = (project: Project) => project.regions.reduce(
    (a: Record<string, number>, region: Region) =>
        ({[region.name]: region.baselineSettings["population"] as number, ...a}),
    {}
);

export const formatCost = (cost: number, maximumFractionDigits = 0) => isNaN(cost) ? "NA" : new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits
}).format(cost);

export const formatCases = (cases: number, maximumFractionDigits = 0) => new Intl.NumberFormat("en-US", {
    maximumFractionDigits
}).format(cases);

export const formatPercentage = (percentage: number) => new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1
}).format(percentage);

const interventionNames: Record<string, string> = {
    "irs": "IRS* only",
    "llin-pbo": "Pyrethroid-PBO ITN only",
    "irs-llin-pbo": "Pyrethroid-PBO ITN with IRS",
    "llin": "Pyrethroid-only ITN only",
    "irs-llin": "Pyrethroid-only ITN with IRS",
    "pyrrole-pbo": "Pyrethroid-pyrrole ITN only",
    "irs-pyrrole-pbo": "Pyrethroid-pyrrole ITN with IRS",
    "none": "No intervention"
};
export const getInterventionName = (intervention: string) => interventionNames[intervention];

// BTable uses Bootstrap colour variants for styling: https://bootstrap-vue.org/docs/components/table#items-record-data
/*const interventionColourNames: Record<string, string> = {
    "irs": "primaryx",
    "llin-pbo": "secondaryx",
    "irs-llin-pbo": "dangerx",
    "llin": "successx",
    "irs-llin": "warningx",
    "none": ""
};
export const getInterventionColourName = (intervention: string) => interventionColourNames[intervention];
*/

const interventionColourValues: Record<string, string> = {
    "irs": "c080c0",
    "llin-pbo": "bfffea",
    "pyrrole-pbo": "80b280",
    "irs-llin-pbo": "ffd280",
    "llin": "8080ff",
    "irs-llin": "c58080",
    "irs-pyrrole-pbo": "99e699",
    "none": ""
};
export const getInterventionColourValue = (intervention: string) => interventionColourValues[intervention];
