import Vue from "vue"
import Vuex from "vuex"
import CompositionApi from '@vue/composition-api'
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";
import {Data, Graph} from "./generated";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

import {actions} from "./actions";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
    baselineOptions: DynamicFormMeta | null
    prevalenceGraphData1: Data
    prevalenceGraphData2: Data
    prevalenceGraphData3: Data
    prevalenceGraphData4: Data
    prevalenceGraphData5: Data
    prevalenceGraphData6: Data
    prevalenceGraphData7: Data
    prevalenceGraphData8: Data
    prevalenceGraphData9: Data
    prevalenceGraphData10: Data
    prevalenceGraphConfig: Graph | null
    impactTableData: Data
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
        prevalenceGraphData1: [],
        prevalenceGraphData2: [],
        prevalenceGraphData3: [],
        prevalenceGraphData4: [],
        prevalenceGraphData5: [],
        prevalenceGraphData6: [],
        prevalenceGraphData7: [],
        prevalenceGraphData8: [],
        prevalenceGraphData9: [],
        prevalenceGraphData10: [],
        prevalenceGraphConfig: null,
        baselineOptions: null,
        impactTableData: []
    },
    actions,
    mutations,
    plugins: [logger]
};

Vue.use(Vuex);
Vue.use(CompositionApi);
export const store = new Vuex.Store<RootState>(storeOptions);
