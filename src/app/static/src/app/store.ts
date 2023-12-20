import Vue from "vue"
import Vuex, {MutationPayload, Store, StoreOptions} from "vuex"
import CompositionApi from "@vue/composition-api"

import {actions} from "./actions";
import {mutations} from "./mutations";
import {Project, Versions} from "./models/project";
import {APIError} from "./apiService";
import {Graph, TableDefinition} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {localStorageManager} from "./localStorageManager";
import {EmulatorConfig} from "./emulator";

export interface RootState {
    versions: Versions | null,
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
    selectedEmulator: number | null
    emulatorConfig: EmulatorConfig | null
}

const logger = (store: Store<RootState>) => {
    store.subscribe((mutation: MutationPayload, state: RootState) => {
        localStorageManager.saveState(state);
    })
};

const existingState = localStorageManager.getState();

const storeOptions: StoreOptions<RootState> = {
    state: {
        versions: null,
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
        selectedEmulator: null,
        emulatorConfig: null,
        ...existingState
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
Vue.use(CompositionApi);
export const store = new Vuex.Store<RootState>(storeOptions);
