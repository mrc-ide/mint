import Vue from "vue"
import Vuex from "vuex"
import {MutationPayload, Store, StoreOptions} from "vuex";

export interface Region {
    name: string
}

export interface Project {
    name: string
    regions: Region[]
    currentRegion: Region
}

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
    plugins: [logger]
}

Vue.use(Vuex);

export const store = new Vuex.Store<RootState>(storeOptions);
