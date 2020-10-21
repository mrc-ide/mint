import {RootState} from "./store";

const appStateKey = "MINTappState";

export const serialiseState = (rootState: RootState): Partial<RootState> => {
    return {
        projects: rootState.projects,
        currentProject: rootState.currentProject
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
