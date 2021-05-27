import {RootState} from "./store";
import {Project, Region} from "./models/project";

// in case the stored data format changes in subsequent versions
const appStateKey = "MINTv0.0.2";

// we don't want to save large data arrays to local storage,
// just region metadata
const stripDataFromRegion = (region: Region): Region => {
    return {...region, prevalenceGraphData: [], tableData: []}
}

const stripDataFromProject = (project: Project): Project => {
    return {
        ...project,
        currentRegion: stripDataFromRegion(project.currentRegion),
        regions: project.regions.map(stripDataFromRegion)
    }
}

export const serialiseState = (rootState: RootState): Partial<RootState> => {
    return {
        projects: rootState.projects.map(stripDataFromProject),
        currentProject: rootState.currentProject ? stripDataFromProject(rootState.currentProject) : null
    };
};

export class LocalStorageManager {

    private savePartialState = (partialState: Partial<RootState>) => {
        window.localStorage.setItem(appStateKey, JSON.stringify(partialState));
    };

    saveState = (state: RootState) => {
        const partialState = serialiseState(state);
        this.savePartialState(partialState);
    };

    getState = (): Partial<RootState> | null => {
        const item = window.localStorage.getItem(appStateKey);
        if (item) {
            return JSON.parse(item) as Partial<RootState>;
        } else {
            return null;
        }
    };
}

export const localStorageManager = new LocalStorageManager();
