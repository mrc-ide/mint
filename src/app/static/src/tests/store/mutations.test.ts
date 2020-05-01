import {mutations, RootMutation} from "../../app/mutations";
import {mockError, mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {expectAllDefined} from "../testHelpers";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

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
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });
        mutations[RootMutation.SetCurrentRegion](state, "/projects/my-project/regions/south-region");
        expect(state.currentProject!!.currentRegion).toEqual({
            name: "South region",
            url: "/projects/my-project/regions/south-region",
            baselineOptions: {controlSections: []},
            interventionOptions: {controlSections:[]},
            interventionSettings: {}
        })
    });

    it("updates the current region's baseline options", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: ["OLD BASELINE"]} as any, {controlSections: []})
        });

        const newBaseline = {controlSections: ["NEWBASELINE"]} as any;
        mutations[RootMutation.SetCurrentRegionBaselineOptions](state, newBaseline);
        expect(state.currentProject!!.currentRegion.baselineOptions).toStrictEqual(newBaseline);
    });

    it("updating the current region's baseline options does nothing if no current project", () => {
        const projects = [new Project("my project", ["North region", "South region"],
            {controlSections: ["OLD BASELINE"]} as any, {controlSections: []})];
        const state = mockRootState({
            projects,
            currentProject: null
        });

        const newBaseline = {controlSections: ["NEWBASELINE"]} as any;
        mutations[RootMutation.SetCurrentRegionBaselineOptions](state, newBaseline);
        expect(state.currentProject).toBeNull();
        expect(state.projects[0].currentRegion.baselineOptions).toStrictEqual({controlSections: ["OLD BASELINE"]});
    });

    it("adds error", () => {
        const state = mockRootState();
        mutations[RootMutation.AddError](state, mockError("some message detail"));

        expect(state.errors.length).toBe(1);
        expect(state.errors[0].detail).toBe("some message detail");
    });

    it("adds baseline options", () => {
        const state = mockRootState();
        const options: DynamicFormMeta = {"controlSections":[]};
        mutations[RootMutation.AddBaselineOptions](state, options);

        expect(state.baselineOptions).toStrictEqual(options);
    });

    it("adds intervention options", () => {
        const state = mockRootState();
        const options: DynamicFormMeta = {"controlSections":[]};
        mutations[RootMutation.AddInterventionOptions](state, options);

        expect(state.interventionOptions).toStrictEqual(options);
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

    it("adds impact table data", () => {
        const state = mockRootState();
        mutations[RootMutation.AddImpactTableData](state, ["some data"]);

        expect(state.impactTableData).toStrictEqual(["some data"]);
    });

    it("adds impact table config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddImpactTableConfig](state, ["some data"]);

        expect(state.impactTableConfig).toStrictEqual(["some data"]);
    });

    it("updates the current region's intervention options", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });

        const newOptions: DynamicFormMeta = {controlSections: [{label: "s1", controlGroups: []}]};
        mutations[RootMutation.SetCurrentRegionInterventionOptions](state, newOptions);
        expect(state.currentProject!!.currentRegion.interventionOptions)
            .toEqual(newOptions);
    });

    it("updating the current region's baseline options does nothing if no current project", () => {
        const state = mockRootState();
        const newOptions: DynamicFormMeta = {controlSections: [{label: "s1", controlGroups: []}]};
        mutations[RootMutation.SetCurrentRegionInterventionOptions](state, newOptions);
        expect(state.currentProject).toBeNull();
    });

    it("updates the current region's intervention settings", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });

        const newSettings: DynamicFormData = {"c1": 3};
        mutations[RootMutation.SetCurrentRegionInterventionSettings](state, newSettings);
        expect(state.currentProject!!.currentRegion.interventionSettings)
            .toEqual(newSettings);
    });

    it("updating the current region's intervention settings does nothing if not current project", () => {
        const state = mockRootState();
        const newSettings: DynamicFormData = {"c1": 3};
        mutations[RootMutation.SetCurrentRegionInterventionSettings](state, newSettings);
        expect(state.currentProject).toBeNull();
    });
});
