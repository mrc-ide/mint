import Vue from "vue"
import Vuex from "vuex"
import CompositionApi from '@vue/composition-api'
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Graph, TableDefinition} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

import {actions} from "./actions";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
    baselineOptions: DynamicFormMeta | null
    interventionOptions: DynamicFormMeta | null
    prevalenceGraphConfig: Graph | null
    impactTableConfig: TableDefinition | null
    costCasesGraphConfig: Graph | null
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
        impactTableConfig: null,
        costCasesGraphConfig: null
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
Vue.use(CompositionApi);
export const store = new Vuex.Store<RootState>(storeOptions);
