/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the mintr JSON schema files
  * and run ./generate-types.sh to regenerate this file.
*/
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
export type Data = {
  [k: string]: any;
}[];
export interface DataOptions {
  [k: string]: any;
}
export interface ErrorDetail {
  error: string;
  detail: string | null;
  [k: string]: any;
}
export interface Graph {
  metadata: LongFormatMetadata | WideFormatMetadata;
  series: SeriesDefinition[];
  layout: {
    [k: string]: any;
  };
  config?: {
    [k: string]: any;
  };
}
export interface LongFormatMetadata {
  x_col: string;
  y_col: string;
  id_col: string;
  format: "long";
}
export interface WideFormatMetadata {
  cols: string[];
  id_col: string;
  format: "wide";
}
export interface SeriesDefinition {
  x?: number[];
  y?: number[];
  id?: string;
  name?: string;
  type?: string;
  [k: string]: any;
}
export interface ResponseFailure {
  status: "failure";
  data: null;
  errors: {
    error: string;
    detail: string | null;
    [k: string]: any;
  }[];
  [k: string]: any;
}
export interface ResponseSuccess {
  status: "success";
  data: any;
  errors: null;
}
export interface TableDefinition {
  [k: string]: any;
}
