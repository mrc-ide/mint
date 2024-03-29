import {mockAxios, mockError, mockFailure, mockRootState, mockSuccess} from "../mocks";
import {expectAllDefined, expectEqualsFrozen} from "../testHelpers";
import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {router} from "../../app/router";
import {Project} from "../../app/models/project";
import {currentMintVersion} from "../../app/mintVersion";

describe("actions", () => {

    beforeEach(() => {
        // stop apiService logging to console
        console.log = jest.fn();
        mockAxios.reset();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockClear();
    });

    const baselineSettings: DynamicFormData = {
        population: 1000
    };

    const interventionSettings: DynamicFormData = {
        irs_use: 0.6,
        net_use: 0.7
    };

    const region = {
        baselineSettings,
        interventionSettings,
        tableData: []
    };

    const state = {
        currentProject: {
            currentRegion: region,
            regions: [
                region
            ],
            budget: 10_000
        }
    };

    async function expectAddsErrorOn500(action: any, url: string, post: boolean = false) {
        mockAxios.reset();

        const failure = mockFailure("TEST ERROR");
        if (post) {
            mockAxios.onPost(url).reply(500, failure);
        } else {
            mockAxios.onGet(url).reply(500, failure);
        }

        const commit = jest.fn();
        await action({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddError);
        expect(commit.mock.calls[0][1]).toStrictEqual(mockError("TEST ERROR"));
    }

    it("implements all defined actions", () => {
        expectAllDefined(RootAction, actions);
    });

    it("SetCurrentRegion sets current region if valid", async () => {
        const commit = jest.fn();
        const proj = new Project("p 1", ["r 1"], {controlSections: []}, {controlSections: []})
        const state = mockRootState({
            projects: [proj]
        })
        await (actions[RootAction.SetCurrentRegion] as any)({commit, state} as any,
            {project: "p-1", region: "r-1"});
        expect(commit.mock.calls.length).toBe(2);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.SetCurrentProject);
        expect(commit.mock.calls[0][1]).toEqual(proj);
        expect(commit.mock.calls[1][0]).toBe(RootMutation.SetCurrentRegion);
        expect(commit.mock.calls[1][1]).toEqual(proj.regions[0]);
    });

    it("SetCurrentRegion navigates home if there is no matching project", async () => {
        const commit = jest.fn();
        await router.push({path: "/project/p-1/regions/r-1"});
        const state = mockRootState({
            projects: [new Project("project", ["r 1"], {controlSections: []}, {controlSections: []})]
        })
        await (actions[RootAction.SetCurrentRegion] as any)({commit, state} as any,
            {project: "p-1", region: "r-1"});
        expect(commit.mock.calls.length).toBe(0);
        expect(router.currentRoute.fullPath).toBe("/");
    });

    it("SetCurrentRegion navigates home if there is no matching region", async () => {
        const commit = jest.fn();
        const state = mockRootState({
            projects: [new Project("p 1", ["region"], {controlSections: []}, {controlSections: []})]
        })
        await router.push({path: "/project/p-1/regions/r-1"});
        await (actions[RootAction.SetCurrentRegion] as any)({commit, state} as any,
            {project: "p-1", region: "r-1"});
        expect(commit.mock.calls.length).toBe(0);
        expect(router.currentRoute.fullPath).toBe("/");
    });

    it("fetches baseline options", async () => {
        const options: DynamicFormMeta = {"controlSections": []};
        mockAxios.onGet("/baseline/options")
            .reply(200, mockSuccess(options));

        const commit = jest.fn();
        await (actions[RootAction.FetchBaselineOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddBaselineOptions);
        expect(commit.mock.calls[0][1]).toStrictEqual(options);
    });

    it("fetches cases averted graph config", async () => {
        mockAxios.onGet("/impact/graph/cases-averted/config")
            .reply(200, mockSuccess({data: {whatever: 1}, layout: {something: "hi"}}));

        const commit = jest.fn();
        await (actions[RootAction.FetchCasesGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCasesGraphConfig)
        expect(commit.mock.calls[0][1]).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

    it("fetches intervention options", async () => {
        const options: DynamicFormMeta = {"controlSections": []};
        mockAxios.onGet("/intervention/options")
            .reply(200, mockSuccess(options));

        const commit = jest.fn();
        await (actions[RootAction.FetchInterventionOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddInterventionOptions);
        expect(commit.mock.calls[0][1]).toStrictEqual(options);
    });

    it("fetches prevalence graph data", async () => {
        const url = "/impact/graph/prevalence/data";
        mockAxios.onPost(url, baselineSettings)
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit, state} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(baselineSettings));

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData);
        expectEqualsFrozen(commit.mock.calls[0][1], [{prev: 1, net_use: 0.2, resistance: "low"}]);
    });

    it("fetches prevalence graph config", async () => {
        mockAxios.onGet("/impact/graph/prevalence/config")
            .reply(200, mockSuccess({data: {whatever: 1}, layout: {something: "hi"}}));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphConfig)
        expect(commit.mock.calls[0][1]).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

    it("fetches table data", async () => {
        const url = "/table/data";
        mockAxios.onPost(url, baselineSettings)
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchTableData] as any)({commit, state} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(baselineSettings));

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddTableData);
        expectEqualsFrozen(commit.mock.calls[0][1], [{prev: 1, net_use: 0.2, resistance: "low"}]);
    });

    it("fetches impact table config", async () => {
        mockAxios.onGet("/impact/table/config")
            .reply(200, mockSuccess({net_use: "Net use"}));

        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableConfig)
        expectEqualsFrozen(commit.mock.calls[0][1], {net_use: "Net use"});
    });

    it("fetches cost table config", async () => {
        const testConfig = {net_use: "Net use"};
        const url = "/cost/table/config";
        mockAxios.onGet(url)
            .reply(200, mockSuccess(testConfig));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostTableConfig);
        expectEqualsFrozen(commit.mock.calls[0][1], testConfig);

        await expectAddsErrorOn500(actions[RootAction.FetchCostTableConfig], url);
    });

    it("FetchConfig fetches figures config", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.FetchConfig] as any)({dispatch} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphConfig);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchCasesGraphConfig);
        expect(dispatch.mock.calls[2][0]).toBe(RootAction.FetchImpactTableConfig);
        expect(dispatch.mock.calls[3][0]).toBe(RootAction.FetchCostCasesGraphConfig);
        expect(dispatch.mock.calls[4][0]).toBe(RootAction.FetchCostPerCaseGraphConfig);
        expect(dispatch.mock.calls[5][0]).toBe(RootAction.FetchCostTableConfig);
    });

    it("fetches cost cases averted config", async () => {
        const url = "/cost/graph/cases-averted/config";
        const testConfig = {data: {test: 1}, layout: {test_layout: "TEST"}};
        mockAxios.onGet(url)
            .reply(200, mockSuccess(testConfig));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostCasesGraphConfig] as any)({commit} as any);

        expect(mockAxios.history.get[0].url).toBe(url);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostCasesGraphConfig);
        expect(commit.mock.calls[0][1]).toStrictEqual(testConfig);

        await expectAddsErrorOn500(actions[RootAction.FetchCostCasesGraphConfig], url);
    });

    it("fetches cost per case config", async () => {
        const url = "/cost/graph/per-case/config";
        const testConfig = {data: {test: 1}, layout: {test_layout: "TEST"}};
        mockAxios.onGet(url)
            .reply(200, mockSuccess(testConfig));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostPerCaseGraphConfig] as any)({commit} as any);

        expect(mockAxios.history.get[0].url).toBe(url);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostPerCaseGraphConfig);
        expect(commit.mock.calls[0][1]).toStrictEqual(testConfig);

        await expectAddsErrorOn500(actions[RootAction.FetchCostPerCaseGraphConfig], url);
    });

    it("EnsureImpactData fetches all impact figure data if none already present", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchTableData);
    });

    it("EnsureImpactData fetches all impact figure data if table not already present", async () => {
        const dispatch = jest.fn();
        const stateWithoutImpactTable = {
            currentProject: {
                currentRegion: {
                    baselineSettings,
                    prevalenceGraphData: ["TEST GRAPH DATA"] as any,
                    tableData: []
                }
            }
        };
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state: stateWithoutImpactTable} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchTableData);

    });

    it("EnsureImpactData does not fetch impact figure data if all data already present", async () => {
        const dispatch = jest.fn();
        const stateWithAllImpactData = {
            currentProject: {
                currentRegion: {
                    baselineSettings,
                    prevalenceGraphData: ["TEST GRAPH DATA"] as any,
                    tableData: ["TEST TABLE DATA"] as any
                }
            }
        };
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state: stateWithAllImpactData} as any);

        expect(dispatch.mock.calls.length).toBe(0);
    });

    it("EnsureCostEffectivenessData fetches cost effectiveness data if not already present", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.EnsureCostEffectivenessData] as any)({dispatch, state} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchTableData);
    });

    it("EnsureCostEffectivenessData does not fetch cost effectiveness data if already present", async () => {
        const dispatch = jest.fn();
        const stateWithCostData = {
            currentProject: {
                currentRegion: {
                    baselineSettings,
                    tableData: ["TEST COST DATA"]
                }
            }
        };
        await (actions[RootAction.EnsureCostEffectivenessData] as any)({dispatch, state: stateWithCostData} as any);

        expect(dispatch.mock.calls.length).toBe(0);
    });

    it("can fetch docs", async () => {
        const commit = jest.fn();
        const state = mockRootState();

        mockAxios.onGet("/impact/docs")
            .reply(200, mockSuccess("impact docs"));

        mockAxios.onGet("/cost/docs")
            .reply(200, mockSuccess("cost docs"));

        await (actions[RootAction.FetchDocs] as any)({commit, state} as any);

        expect(commit.mock.calls.length).toBe(2);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.UpdateImpactDocs);
        expect(commit.mock.calls[0][1]).toBe("impact docs");
        expect(commit.mock.calls[1][0]).toBe(RootMutation.UpdateCostDocs);
        expect(commit.mock.calls[1][1]).toBe("cost docs");
    });

    it("SetCurrentRegionBaselineSettings commits settings and fetches data", async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = mockRootState();

        await (actions[RootAction.SetCurrentRegionBaselineSettings] as any)({commit, state, dispatch} as any);

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.SetCurrentRegionBaselineSettings);

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchTableData);
    });

    it("fetches strategies", async () => {
        const url = "/strategise";
        const strategies = [{costThreshold: 1}];
        mockAxios.onPost(url)
            .reply(200, mockSuccess(strategies));
        const commit = jest.fn();
        const mockRegion = {interventionSettings: {budgetAllZones: 42}};
        const mockState = {
            currentProject: {
                currentRegion: mockRegion,
                regions: [
                    mockRegion,
                    mockRegion
                ],
                budget: 10_000
            }
        };

        await (actions[RootAction.Strategise] as any)({commit, state: mockState} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
            budget: 10000,
            zones: [
                {interventionSettings: {budgetAllZones: 42}},
                {interventionSettings: {budgetAllZones: 42}},
            ]
        }));
        expect(commit.mock.calls.length).toBe(2);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.UpdateStrategies);
        expect(commit.mock.calls[0][1]).toEqual([]);
        expect(commit.mock.calls[1][0]).toBe(RootMutation.UpdateStrategies);
        expect(commit.mock.calls[1][1]).toEqual(strategies);
    });

    it("adds error if fails to fetch strategies", async () => {
        const url = "/strategise";
        const failure = mockFailure("TEST ERROR");
        mockAxios.onPost(url).reply(500, failure);
        const commit = jest.fn();

        await (actions[RootAction.Strategise] as any)({commit, state} as any);

        expect(commit.mock.calls[1][0]).toBe(RootMutation.AddError);
        expect(commit.mock.calls[1][1]).toStrictEqual(mockError("TEST ERROR"));
    });

    it("dismisses errors", () => {
        const commit = jest.fn();
        (actions[RootAction.DismissErrors] as any)({
            commit,
            state: {...state, errors: [mockError("TEST ERROR")]}
        });

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.DismissErrors);
    });

    it("fetches version", async () => {
        const commit = jest.fn();
        const url = "/version";
        const version = {data: "20230421", mintr: "1.2.3"};
        mockAxios.onGet(url).reply(200, mockSuccess(version));

        await (actions[RootAction.FetchVersion] as any)({commit} as any);

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.SetVersions);
        expect(commit.mock.calls[0][1]).toStrictEqual({...version, mint: currentMintVersion});
    });

    it("FetchVersions commits error", async () => {
        const commit = jest.fn();
        const url = "/version";
        mockAxios.onGet(url).reply(500, mockFailure("TEST ERROR"));

        await (actions[RootAction.FetchVersion] as any)({commit} as any);

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddError);
        expect(commit.mock.calls[0][1]).toStrictEqual(mockError("TEST ERROR"));
    });
});
