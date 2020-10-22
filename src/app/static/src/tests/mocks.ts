import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {RootState} from "../app/store";
import {Graph, ResponseFailure, ResponseSuccess} from "../app/generated";
import {APIError} from "../app/apiService";
import {Project} from "../app/models/project";

export function mockRootState(state: Partial<RootState> = {}): RootState {
    return {
        projects: [],
        currentProject: null,
        errors: [],
        baselineOptions: null,
        interventionOptions: null,
        prevalenceGraphConfig: null,
        impactTableConfig: null,
        costCasesGraphConfig: null,
        costTableConfig: null,
        costEfficacyGraphConfig: null,
        ...state
    }
}

export function mockGraph(props: Partial<Graph> = {}): Graph {
    return {
        series: [],
        layout: {},
        metadata: {
            format: "wide",
            id_col: "intervention",
            cols: ["cases"]
        },
        ...props
    }
}

export function mockProject(name = "project 1", regions = ["region 1"]): Project {
    return new Project(name, regions, {controlSections: []}, {controlSections: []});
}

export const mockSuccess = (data: any): ResponseSuccess => {
    return {
        data,
        status: "success",
        errors: null
    }
};

export const mockFailure = (errorMessage: string): ResponseFailure => {
    return {
        data: null,
        status: "failure",
        errors: [mockError(errorMessage)]
    }
};

export const mockError = (errorMessage: string): APIError => {
    return {error: "OTHER_ERROR", detail: errorMessage};
};

export const mockAxios = new MockAdapter(axios);
