import {Project, RootState} from "../app/store";

export function mockRootState(state: Partial<RootState> = {}): RootState {
    return {
        projects: [],
        currentProject: null,
        ...state
    }
}

export function mockProject(props: Partial<Project> = {}): Project {
    return {
        name: "a project",
        regions: [{name: "South"}],
        currentRegion: {name: "South"},
        ...props
    }
}
