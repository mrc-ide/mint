import {mockAxios, mockError, mockSuccess, mockFailure} from "../mocks";
import {expectAllDefined, expectEqualsFrozen} from "../testHelpers";
import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import {BaselineOptions} from "../../app/generated";

describe("actions", () => {

    beforeEach(() => {
        // stop apiService logging to console
        console.log = jest.fn();
        mockAxios.reset();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockClear();
    });

    const baselineOptions: BaselineOptions = {
        controlSections:
            [{
                label: "section",
                controlGroups: []
            }]
    };

    const interventionSettings: DynamicFormData = {
        irs_use: 0.6,
        net_use: 0.7
    };

    const state = {
        currentProject: {
            currentRegion: {
                baselineOptions,
                interventionSettings,
                prevalenceGraphData: [],
                impactTableData: [],
                costGraphData: []
            }
        }
    };

    it("implements all defined actions", () => {
        expectAllDefined(RootAction, actions);
    });

    it("fetches baseline options", async () => {
        const options: DynamicFormMeta = {"controlSections":[]};
        mockAxios.onGet("/baseline/options")
            .reply(200, mockSuccess(options));

        const commit = jest.fn();
        await (actions[RootAction.FetchBaselineOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddBaselineOptions);
        expect(commit.mock.calls[0][1]).toStrictEqual(options);
    });

    it("fetches intervention options", async () => {
        const options: DynamicFormMeta = {"controlSections":[]};
        mockAxios.onGet("/intervention/options")
            .reply(200, mockSuccess(options));

        const commit = jest.fn();
        await (actions[RootAction.FetchInterventionOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddInterventionOptions);
        expect(commit.mock.calls[0][1]).toStrictEqual(options);
    });

    it("fetches prevalence graph data", async () => {
        const url = "/impact/graph/prevalence/data";
        mockAxios.onPost(url, baselineOptions)
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit, state} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(baselineOptions));

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

    it("fetches impact table data", async () => {
        const url = "/impact/table/data";
        mockAxios.onPost(url, baselineOptions)
                .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableData] as any)({commit, state} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(baselineOptions));

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableData);
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

    it("FetchConfig fetches options and figures config", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.FetchConfig] as any)({dispatch} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchBaselineOptions);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchInterventionOptions);
        expect(dispatch.mock.calls[2][0]).toBe(RootAction.FetchPrevalenceGraphConfig);
        expect(dispatch.mock.calls[3][0]).toBe(RootAction.FetchImpactTableConfig);
        expect(dispatch.mock.calls[4][0]).toBe(RootAction.FetchCostCasesGraphConfig);
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
    });

    it("adds any error when fetching cost cases averted config", async () => {
        mockAxios.onGet("/cost/graph/cases-averted/config")
            .reply(500, mockFailure("TEST ERROR"));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostCasesGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddError);
        expect(commit.mock.calls[0][1]).toStrictEqual(mockError("TEST ERROR"));
    });

    it("fetches cost graph data", async () => {
        const url = "/cost/graph/data";
        const testData = [{cases_averted: 1, cost: 10}];
        const expectedSettings = {...baselineOptions, ...interventionSettings};
        mockAxios.onPost(url, expectedSettings)
            .reply(200, mockSuccess(testData));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostGraphData] as any)({commit, state} as any);

        expect(mockAxios.history.post[0].url).toBe(url);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(expectedSettings));

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostGraphData);
        expectEqualsFrozen(commit.mock.calls[0][1], testData);
    });

    it("adds any error when fetching cost graph data", async () => {
        mockAxios.onPost("/cost/graph/data")
            .reply(500, mockFailure("TEST ERROR"));

        const commit = jest.fn();
        await (actions[RootAction.FetchCostGraphData] as any)({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddError);
        expect(commit.mock.calls[0][1]).toStrictEqual(mockError("TEST ERROR"));
    });

    it("EnsureImpactData fetches all impact figure data if none already present", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchImpactTableData);
    });

    it("EnsureImpactData fetches all impact figure data if graph not already present", async () => {
        const dispatch = jest.fn();
        const stateWithoutImpactGraph = {
            currentProject: {
                currentRegion: {
                    baselineOptions: baselineOptions,
                    prevalenceGraphData: [],
                    impactTableData: ["TEST TABLE DATA"] as any
                }
            }
        };
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state: stateWithoutImpactGraph} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchImpactTableData);
    });

    it("EnsureImpactData fetches all impact figure data if table not already present", async () => {
        const dispatch = jest.fn();
        const stateWithoutImpactTable = {
            currentProject: {
                currentRegion: {
                    baselineOptions: baselineOptions,
                    prevalenceGraphData: ["TEST GRAPH DATA"] as any,
                    impactTableData: []
                }
            }
        };
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state: stateWithoutImpactTable} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchPrevalenceGraphData);
        expect(dispatch.mock.calls[1][0]).toBe(RootAction.FetchImpactTableData);

    });

    it("EnsureImpactData does not fetch impact figure data if all data already present", async () => {
        const dispatch = jest.fn();
        const stateWithAllImpactData = {
            currentProject: {
                currentRegion: {
                    baselineOptions: baselineOptions,
                    prevalenceGraphData: ["TEST GRAPH DATA"] as any,
                    impactTableData: ["TEST TABLE DATA"] as any
                }
            }
        };
        await (actions[RootAction.EnsureImpactData] as any)({dispatch, state: stateWithAllImpactData} as any);

        expect(dispatch.mock.calls.length).toBe(0);
    });

    it("EnsureCostEffectivenessData fetches cost effectiveness data if not already present", async () => {
        const dispatch = jest.fn();
        await (actions[RootAction.EnsureCostEffectivenessData] as any)({dispatch, state} as any);

        expect(dispatch.mock.calls[0][0]).toBe(RootAction.FetchCostGraphData);
    });

    it("EnsureCostEffectivenessData does not fetch cost effectiveness data if already present", async () => {
        const dispatch = jest.fn();
        const stateWithCostData = {
            currentProject: {
                currentRegion: {
                    baselineOptions: baselineOptions,
                    costGraphData: ["TEST COST DATA"]
                }
            }
        };
        await (actions[RootAction.EnsureCostEffectivenessData] as any)({dispatch, state: stateWithCostData} as any);

        expect(dispatch.mock.calls.length).toBe(0);
    });

});
