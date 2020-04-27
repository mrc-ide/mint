import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {RootState} from "../app/store";
import {Graph, ResponseFailure, ResponseSuccess} from "../app/generated";
import {APIError} from "../app/apiService";

export function mockRootState(state: Partial<RootState> = {}): RootState {
    return {
        projects: [],
        currentProject: null,
        errors: [],
        prevalenceGraphData: [],
        prevalenceGraphConfig: null,
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
