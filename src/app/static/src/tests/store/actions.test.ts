import {mockAxios, mockSuccess} from "../mocks";
import {expectAllDefined, expectEqualsFrozen} from "../testHelpers";
import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("actions", () => {

    beforeEach(() => {
        // stop apiService logging to console
        console.log = jest.fn();
        mockAxios.reset();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockClear();
    });

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
        mockAxios.onPost("/impact/graph/prevalence/data")
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData)
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
        mockAxios.onPost("/impact/table/data")
                .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableData] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableData)
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

});
