//TODO: These should be generated from the mintr schema

export interface BaselineOptions {
    controlSections: ControlSection[];
}
export interface ControlSection {
    label: string;
    description?: string;
    controlGroups: ControlGroup[];
}
export interface ControlGroup {
    label?: string;
    controls: (SelectControl | NumberControl)[];
}
export interface SelectControl {
    name: string;
    label?: string;
    type: "select" | "multiselect";
    required: boolean;
    value?: string;
    helpText?: string;
    options?: {
        id: string;
        label: string;
        children?: {
            [k: string]: any;
        }[];
    }[];
}
export interface NumberControl {
    name: string;
    label?: string;
    type: "number";
    required: boolean;
    value?: number;
    helpText?: string;
    min?: number;
    max?: number;
}