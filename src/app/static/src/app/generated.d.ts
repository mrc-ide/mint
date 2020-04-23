/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the hintr JSON schema files
  * and run ./generate-types.sh to regenerate this file.
*/
export type Data = {
  [k: string]: any;
}[];
export interface DataOptions {
  [k: string]: any;
}
export interface Graph {
  data: {
    [k: string]: any;
  }[];
  layout: {
    [k: string]: any;
  };
  config?: {
    [k: string]: any;
  };
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
export type TableDefinition = string[];
