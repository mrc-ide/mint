import Vue from "vue"
import Vuex from "vuex"
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";
import {APIError} from "./apiService";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
    errors: APIError[]
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
        errors: []
    },
    mutations,
    plugins: [logger]
}

Vue.use(Vuex);
export const store = new Vuex.Store<RootState>(storeOptions);
