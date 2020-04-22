import {RootState} from "../app/store";

export function mockRootState(state: Partial<RootState> = {}): RootState {
    return {
        projects: [],
        currentProject: null,
        currentRegion: null,
        ...state
    }
}
