import {mutations, RootMutation} from "../../app/mutations";
import {mockError, mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {expectAllDefined} from "../testHelpers";

describe("mutations", () => {

    it("implements all defined mutations", () => {
        expectAllDefined(RootMutation, mutations);
    });

    it("adds a new project", () => {
        const state = mockRootState()
        mutations[RootMutation.AddProject](state, {
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        });
        expect(state.currentProject).toStrictEqual({
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        })
    });

    it("updates the current region", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"])
        })
        mutations[RootMutation.SetCurrentRegion](state, "/projects/my-project/regions/south-region");
        expect(state.currentProject!!.currentRegion).toEqual({
            name: "South region",
            url: "/projects/my-project/regions/south-region"
        })
    });

    it("adds error", () => {
        const state = mockRootState();
        mutations[RootMutation.AddError](state, mockError("some message detail"));

        expect(state.errors.length).toBe(1);
        expect(state.errors[0].detail).toBe("some message detail");
    });

    it("adds prevalence graph data", () => {
        const state = mockRootState();
        mutations[RootMutation.AddPrevalenceGraphData](state, ["some data"]);

        expect(state.prevalenceGraphData).toStrictEqual(["some data"]);
    });

    it("adds prevalence graph config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddPrevalenceGraphConfig](state, {data: {whatever: 1}, layout: {something: "hi"}});

        expect(state.prevalenceGraphConfig).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

});
