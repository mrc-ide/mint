import {mutations, RootMutation} from "../../app/mutations";
import {mockError, mockProject, mockRegion, mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {expectAllDefined} from "../testHelpers";
import {DynamicControlType, DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("mutations", () => {

    it("implements all defined mutations", () => {
        expectAllDefined(RootMutation, mutations);
    });

    it("adds a new project", () => {
        const state = mockRootState();
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

    it("can delete a project", () => {
        const state = mockRootState()
        const proj = {
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        }
        mutations[RootMutation.AddProject](state, proj);
        expect(state.projects).toHaveLength(1)
        expect(state.currentProject).toStrictEqual(proj)
   
        mutations[RootMutation.DeleteProject](state, proj);
        expect(state.projects).toHaveLength(0)
        expect(state.projects).not.toBe(proj);
    });

    it("sets the current project", () => {
        const state = mockRootState();
        const proj = mockProject()
        mutations[RootMutation.SetCurrentProject](state, proj);
        expect(state.currentProject).toEqual(proj);
        mutations[RootMutation.SetCurrentProject](state, null);
        expect(state.currentProject).toBe(null);
    });

    it("adds a new region", () => {
        const state = mockRootState({
            currentProject: mockProject()
        })
        const region = mockRegion();
        mutations[RootMutation.AddRegion](state, region);
        expect(state.currentProject!!.regions[0]).toEqual(region);
    });

    it("updates the current region", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });
        mutations[RootMutation.SetCurrentRegion](state, state.currentProject!!.regions[1]);
        expect(state.currentProject!!.currentRegion).toEqual({
            name: "South region",
            slug: "south-region",
            url: "/projects/my-project/regions/south-region",
            baselineOptions: {controlSections: []},
            baselineSettings: {},
            interventionOptions: {controlSections:[]},
            interventionSettings: {},
            prevalenceGraphData: [],
            tableData: [],
            step: 1
        });
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

    it("updates the current region's step", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });
        const region = state.currentProject!!.currentRegion;
        expect(region.step).toBe(1);

        mutations[RootMutation.SetCurrentRegionStep](state, 2);
        expect(region.step).toBe(2);
    });

    it("updating the current region's baseline options invalidates data", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: ["OLD BASELINE"]} as any, {controlSections: []})
        });
        state.currentProject!!.currentRegion.prevalenceGraphData = ["TEST GRAPH DATA"] as any;
        state.currentProject!!.currentRegion.tableData = ["TEST TABLE DATA"] as any;

        const newBaseline = {controlSections: ["NEWBASELINE"]} as any;
        mutations[RootMutation.SetCurrentRegionBaselineOptions](state, newBaseline);
        expect(state.currentProject!!.currentRegion.prevalenceGraphData).toStrictEqual([]);
        expect(state.currentProject!!.currentRegion.tableData).toStrictEqual([]);
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
        const project = mockProject();
        const state = mockRootState({
            projects: [project],
            currentProject: project
        });
        mutations[RootMutation.AddPrevalenceGraphData](state, ["some data"]);

        expect(state.currentProject!!.currentRegion.prevalenceGraphData).toStrictEqual(["some data"]);
    });

    it("adds prevalence graph config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddPrevalenceGraphConfig](state, {data: {whatever: 1}, layout: {something: "hi"}});

        expect(state.prevalenceGraphConfig).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

    it("adds cases averted graph config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddCasesGraphConfig](state, {data: {whatever: 1}, layout: {something: "hi"}});

        expect(state.casesGraphConfig).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

    it("adds table data", () => {
        const project = mockProject();
        const state = mockRootState({
            projects: [project],
            currentProject: project
        });
        mutations[RootMutation.AddTableData](state, ["some data"]);

        expect(state.currentProject!!.currentRegion.tableData).toStrictEqual(["some data"]);
    });

    it("adds impact table config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddImpactTableConfig](state, ["some data"]);

        expect(state.impactTableConfig).toStrictEqual(["some data"]);
    });

    it("adds cost table config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddCostTableConfig](state, ["some data"]);

        expect(state.costTableConfig).toStrictEqual(["some data"]);
    });

    it("adds cost cases graph config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddCostCasesGraphConfig](state, ["config data"]);

        expect(state.costCasesGraphConfig).toStrictEqual(["config data"]);
    });

    it("adds cost per case graph config", () => {
        const state = mockRootState();
        mutations[RootMutation.AddCostPerCaseGraphConfig](state, ["config data"]);

        expect(state.costPerCaseGraphConfig).toStrictEqual(["config data"]);
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
            .toEqual({budgetAllZones:2000000, ...newSettings});
    });

    it("updating the current region's intervention settings does nothing if not current project", () => {
        const state = mockRootState();
        const newSettings: DynamicFormData = {"c1": 3};
        mutations[RootMutation.SetCurrentRegionInterventionSettings](state, newSettings);
        expect(state.currentProject).toBeNull();
    });

    it("updates the current region's baseline settings", () => {
        const state = mockRootState({
            currentProject: new Project("my project", ["North region", "South region"],
                {controlSections: []}, {controlSections: []})
        });

        const newSettings: DynamicFormData = {"c1": 3};
        mutations[RootMutation.SetCurrentRegionBaselineSettings](state, newSettings);
        expect(state.currentProject!!.currentRegion.baselineSettings)
            .toEqual(newSettings);
    });

    it("updating the current region's baseline settings does nothing if no current project", () => {
        const state = mockRootState();
        const newSettings: DynamicFormData = {"c1": 3};
        mutations[RootMutation.SetCurrentRegionBaselineSettings](state, newSettings);
        expect(state.currentProject).toBeNull();
    });

    it("updates impact docs", () => {
        const state = mockRootState();
        mutations[RootMutation.UpdateImpactDocs](state, "impact docs");
        expect(state.impactDocs).toBe("impact docs");
    });

    it("updates cost docs", () => {
        const state = mockRootState();
        mutations[RootMutation.UpdateCostDocs](state, "cost docs");
        expect(state.costDocs).toBe("cost docs");
    });

    it("sets budget", () => {
        const state = mockRootState({
            currentProject: mockProject()
        });
        mutations[RootMutation.SetBudget](state, 42);

        expect(state.currentProject!!.budget).toBe(42);
    });

    it("updates strategies", () => {
        const project = mockProject();
        const state = mockRootState({
            currentProject: project
        });
        mutations[RootMutation.UpdateStrategies](state, ["some strategies"]);

        expect(state.currentProject!!.strategies).toStrictEqual(["some strategies"]);
    });

    it("dismisses errors", () => {
        const state = mockRootState({
            errors: [mockError("TEST ERROR")]
        });
       mutations[RootMutation.DismissErrors](state);

       expect(state.errors).toStrictEqual([]);
    });

    it("sets versions", () => {
        const state = mockRootState();
        const versions = {
            data: "20230421",
            mintr: "1.2.3",
            mint: "4.5.6"
        };
        mutations[RootMutation.SetVersions](state, versions);

        expect(state.versions).toBe(versions);
    });
});
