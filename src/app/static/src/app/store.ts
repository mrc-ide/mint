import Vue from "vue"
import Vuex from "vuex"
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph, TableDefinition} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {actions} from "./actions";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
    baselineOptions: DynamicFormMeta | null
    prevalenceGraphData: Data
    prevalenceGraphConfig: Graph | null
    impactTableData: Data
    impactTableConfig: TableDefinition | null
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
        prevalenceGraphData: [],
        prevalenceGraphConfig: null,
        baselineOptions: null,
        impactTableData: [],
        impactTableConfig: null
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
export const store = new Vuex.Store<RootState>(storeOptions);
