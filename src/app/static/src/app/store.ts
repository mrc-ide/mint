import Vue from "vue"
import Vuex from "vuex"
import {MutationPayload, Store, StoreOptions} from "vuex";

import {mutations} from "./mutations";
import {Project} from "./models/project";

export interface RootState {
    projects: Project[]
    currentProject: Project | null
}

const logger = (store: Store<RootState>) => {
    store.subscribe((mutation: MutationPayload) => {
        console.log(mutation.type);
    })
};

const storeOptions: StoreOptions<RootState> = {
    state: {
        projects: [],
        currentProject: null
    },
    mutations,
    plugins: [logger]
}

Vue.use(Vuex);
export const store = new Vuex.Store<RootState>(storeOptions);
