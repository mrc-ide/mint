import {mockProject, mockRootState} from "./mocks";
import {localStorageManager, serialiseState} from "../app/localStorageManager";
import {Project, StrategyWithThreshold} from "../app/models/project";

describe("local storage manager", () => {

    afterEach(() => {
       localStorage.clear();
    });

    const mockProjectWithData = (name: string, regions: string[], strategies: StrategyWithThreshold[] = []): Project => {
        const project = mockProject(name, regions, strategies)
        const region = project.regions[0]

        // settings should all be preserved
        region.interventionSettings = "INT_SETTINGS" as any;
        region.interventionOptions = "INT_OPTS" as any;
        region.baselineOptions = "BASELINE_OPTS" as any;
        region.baselineSettings = "BASELINE_SETTINGS" as any;
        region.step = 1;

        // data should all we wiped
        region.tableData = [{"something": 1}]
        region.prevalenceGraphData = [{"something": 4}]

        return project
    }

    it("can strip data from projects", () => {

        const project1 = mockProjectWithData("p1", ["r1"], [{costThreshold: 1, interventions: []}])
        const project2 = mockProjectWithData("p2", ["r2"])

        const state = mockRootState({
            projects: [project1, project2],
            currentProject: project1
        });

        const result = serialiseState(state);

        const expectedFirstRegion = {
            name: "r1",
            slug: "r1",
            url: "/projects/p1/regions/r1",
            baselineOptions: "BASELINE_OPTS" as any,
            baselineSettings: "BASELINE_SETTINGS" as any,
            interventionOptions: "INT_OPTS" as any,
            interventionSettings: "INT_SETTINGS" as any,
            prevalenceGraphData: [],
            tableData: [],
            step: 1
        }

        expect(result.projects!![0]!!.regions[0]).toEqual(expectedFirstRegion);

        expect(result.projects!![1]!!.regions[0]).toEqual({
            name: "r2",
            slug: "r2",
            url: "/projects/p2/regions/r2",
            baselineOptions: "BASELINE_OPTS" as any,
            baselineSettings: "BASELINE_SETTINGS" as any,
            interventionOptions: "INT_OPTS" as any,
            interventionSettings: "INT_SETTINGS" as any,
            prevalenceGraphData: [],
            tableData: [],
            step: 1
        });

        expect(result.currentProject!!.name).toBe("p1");
        expect(result.currentProject!!.slug).toBe("p1");
        expect(result.currentProject!!.regions[0]).toEqual(expectedFirstRegion);
        expect(result.currentProject!!.currentRegion).toEqual(expectedFirstRegion);
        expect(result.currentProject!!.strategies).toEqual([]);

        expect(Object.keys(result)).toEqual([
            "projects",
            "currentProject"
        ]);
    });

    it("can serialise state with no project data", () => {

        const result = serialiseState(mockRootState());

        expect(result.currentProject).toBe(null);
        expect(result.projects).toEqual([]);
        expect(Object.keys(result)).toEqual([
            "projects",
            "currentProject"
        ]);
    });

    it("can save and get state", () => {
       const emptyState = localStorageManager.getState();
       expect(emptyState).toEqual(null);

       localStorageManager.saveState(mockRootState());

        const state = localStorageManager.getState();
        expect(state).toEqual({
            projects: [],
            currentProject: null
        });
    })

});
