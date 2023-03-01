/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the mintr JSON schema files
  * and run ./generate-types.sh to regenerate this file.
*/
export type Data = {
  [k: string]: unknown;
}[];
export interface DataOptions {
  [k: string]: unknown;
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
      [k: string]: unknown;
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
  [k: string]: unknown;
}
export interface Graph {
  metadata: LongFormatMetadata | WideFormatMetadata;
  series: SeriesDefinition[];
  layout: Layout;
  config?: {
    [k: string]: unknown;
  };
}
export interface LongFormatMetadata {
  x_col?: string;
  x_formula?: string[];
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
  [k: string]: unknown;
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
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
export interface Axis {
  title?: string;
  autorange?: boolean;
  rangemode?: string;
  range?: number[];
  [k: string]: unknown;
}
export interface ResponseFailure {
  status: "failure";
  data: null;
  errors: {
    error: string;
    detail: string | null;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
export interface ResponseSuccess {
  status: "success";
  data: unknown;
  errors: null;
}
export type Strategise =
  | []
  | [
      {
        costThreshold: number;
        interventions:
          | []
          | [
              {
                zone: string;
                intervention: string;
                cost: number;
                casesAverted: number;
                casesAvertedErrorMinus: number;
                casesAvertedErrorPlus: number;
              }
            ];
      }
    ];
export interface StrategiseOptions {
  budget: number;
  zones: [
    {
      name?: string;
      baselineSettings?: {
        population: number;
        seasonalityOfTransmission: string;
        currentPrevalence: string;
        bitingIndoors: string;
        bitingPeople: string;
        levelOfResistance: string;
        metabolic: string;
        itnUsage: string;
        sprayInput: string;
      };
      interventionSettings?: {
        procurePeoplePerNet: number;
        procureBuffer: number;
        priceDelivery: number;
        priceNetPBO: number;
        priceNetStandard: number;
        priceIRSPerPerson: number;
        netUse: string;
        irsUse: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  ];
}
export type ErrorValue =
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    };
export type TableDefinition = ColumnDefinition[];

export interface ColumnDefinition {
  valueCol: string;
  displayName: string;
  error?: {
    minus: ErrorValue;
    plus: ErrorValue;
  };
  valueTransform?: {
    [k: string]: unknown;
  };
  transform?: string;
  format?: string;
  precision?: number;
}
