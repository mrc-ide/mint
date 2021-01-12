/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the mintr JSON schema files
  * and run ./generate-types.sh to regenerate this file.
*/
export type Data = {
  [k: string]: any;
}[];
export interface DataOptions {
  [k: string]: any;
}
export type Docs = string;
export interface DynamicFormOptions {
  controlSections: ControlSection[];
}
export interface ControlSection {
  label: string;
  description?: string;
  controlGroups: ControlGroup[];
  documentation?: string;
  collapsible?: boolean;
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
  excludeNullOption?: boolean;
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
export interface ErrorDetail {
  error: string;
  detail: string | null;
  [k: string]: any;
}
export interface Graph {
  metadata: LongFormatMetadata | WideFormatMetadata;
  series: SeriesDefinition[];
  layout: Layout;
  config?: {
    [k: string]: any;
  };
}
export interface LongFormatMetadata {
  x_col: string;
  y_col?: string;
  id_col: string;
  format: "long";
  settings?: string[];
}
export interface WideFormatMetadata {
  cols?: string[];
  id_col: string;
  format: "wide";
  settings?: string[];
}
export interface SeriesDefinition {
  x?: (number | string)[];
  y?: number[];
  y_formula?: string[];
  id?: string;
  name?: string;
  type?: string;
  [k: string]: any;
}
export interface Layout {
  xaxis: Axis;
  yaxis: Axis;
  shapes?: {
    type?: string;
    y_formula?: string;
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    [k: string]: any;
  }[];
  [k: string]: any;
}
export interface Axis {
  title?: string;
  autorange?: boolean;
  rangemode?: string;
  range?: number[];
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
export type TableDefinition = ColumnDefinition[];

export interface ColumnDefinition {
  valueCol: string;
  displayName: string;
  valueTransform?: {
    [k: string]: any;
  };
  transform?: string;
  format?: string;
  precision?: number;
}
