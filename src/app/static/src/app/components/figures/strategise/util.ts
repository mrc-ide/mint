import {Project, Region} from "../../../models/project";

export const getRegionPopulations = (project: Project) => project.regions.reduce(
    (a: Record<string, number>, region: Region) =>
        ({[region.name]: region.baselineSettings["population"] as number, ...a}),
    {}
);

export const formatCost = (cost: number, maximumFractionDigits = 0) => isNaN(cost) ? "NA" : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits
}).format(cost);

export const formatCases = (cases: number, maximumFractionDigits = 0) => new Intl.NumberFormat('en-US', {
    maximumFractionDigits
}).format(cases);

export const formatPercentage = (percentage: number) => new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1
}).format(percentage);

const interventionNames: Record<string, string> = {
    "irs": "IRS* only",
    "llin-pbo": "Pyrethroid-PBO ITN only",
    "irs-llin-pbo": "Pyrethroid-PBO ITN with IRS*",
    "llin": "Pyrethroid LLIN only",
    "irs-llin": "Pyrethroid LLIN with IRS*",
    "none": "No intervention"
};
export const getInterventionName = (intervention: string) => interventionNames[intervention];

// BTable uses Bootstrap colour variants for styling: https://bootstrap-vue.org/docs/components/table#items-record-data
const interventionColourNames: Record<string, string> = {
    "irs": "primary",
    "llin-pbo": "secondary",
    "irs-llin-pbo": "danger",
    "llin": "success",
    "irs-llin": "warning",
    "none": ""
};
export const getInterventionColourName = (intervention: string) => interventionColourNames[intervention];

const interventionColourValues: Record<string, string> = {
    "irs": "dbb8db",
    "llin-pbo": "e0fae0",
    "irs-llin-pbo": "ffe6b8",
    "llin": "bbf0fb",
    "irs-llin": "bbf0fb",
    "none": ""
};
export const getInterventionColourValue = (intervention: string) => interventionColourValues[intervention];
