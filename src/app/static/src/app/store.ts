import Vue from "vue"
import Vuex, {MutationPayload, Store, StoreOptions} from "vuex"
import CompositionApi from '@vue/composition-api'

import {actions} from "./actions";
import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Graph, TableDefinition} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {localStorageManager} from "./localStorageManager";
import {migrateSettings} from "./migrations";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
    baselineOptions: DynamicFormMeta | null
    interventionOptions: DynamicFormMeta | null
    prevalenceGraphConfig: Graph | null
    casesGraphConfig: Graph | null
    impactTableConfig: TableDefinition | null
    costCasesGraphConfig: Graph | null
    costTableConfig: TableDefinition | null
    costPerCaseGraphConfig: Graph | null
    impactDocs: string
    costDocs: string
}

const logger = (store: Store<RootState>) => {
    store.subscribe((mutation: MutationPayload, state: RootState) => {
        console.log(mutation.type);
        localStorageManager.saveState(state);
    })
};

const existingState = localStorageManager.getState();

if (existingState) {
    migrateSettings(existingState);
}

const storeOptions: StoreOptions<RootState> = {
    state: {
        projects: [],
        currentProject: null,
        errors: [],
        prevalenceGraphConfig: null,
        casesGraphConfig: null,
        baselineOptions: null,
        interventionOptions: null,
        impactTableConfig: null,
        costCasesGraphConfig: null,
        costTableConfig: null,
        costPerCaseGraphConfig: null,
        impactDocs: "",
        costDocs: "",
        ...existingState
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
Vue.use(CompositionApi);
export const store = new Vuex.Store<RootState>(storeOptions);
