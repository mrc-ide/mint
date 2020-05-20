import Vue from "vue"
import Vuex from "vuex"
import CompositionApi from '@vue/composition-api'
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph, SeriesDefinition, TableDefinition, WideFormatMetadata} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

import {actions} from "./actions";

//TODO: ScatterMetadata to be generated from mintr, and Graph metadata options to include ScatterMetadata - just checking
//we can get this format working in the front end for now
export interface ScatterGraph {
    metadata: ScatterMetadata;
    series: SeriesDefinition[];
    layout: {
        [k: string]: any;
    };
    config?: {
        [k: string]: any;
    };
}
export interface ScatterMetadata {
    x_col: string;
    y_col: string;
    id_col: string;
    error_plus_col: string;
    error_minus_col: string;
    color_col: string;
    format: "scatter";
}

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
    baselineOptions: DynamicFormMeta | null
    interventionOptions: DynamicFormMeta | null
    prevalenceGraphConfig: Graph | null
    impactTableConfig: TableDefinition | null
    costCasesGraphConfig: ScatterGraph | null
}

const logger = (store: Store<RootState>) => {
    store.subscribe((mutation: MutationPayload) => {
        console.log(mutation.type);
    })
};

const storeOptions: StoreOptions<RootState> = {
    state: {
        projects: [],
        currentProject: null,
        errors: [],
        prevalenceGraphConfig: null,
        baselineOptions: null,
        interventionOptions:  null,
        impactTableConfig: null
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
Vue.use(CompositionApi);
export const store = new Vuex.Store<RootState>(storeOptions);
