import {mockAxios, mockSuccess} from "../mocks";
import {expectAllDefined, expectEqualsFrozen} from "../testHelpers";
import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";

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

    it("fetches prevalence graph data", async () => {
        mockAxios.onPost("/impact/graph/prevalence/data")
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit} as any, new FormData());

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData)
        expectEqualsFrozen(commit.mock.calls[0][1], [{prev: 1, net_use: 0.2, resistance: "low"}]);
    });

    it("fetches prevalence graph config", async () => {
        mockAxios.onGet("/impact/graph/prevalence/config")
            .reply(200, mockSuccess({data: {whatever: 1}, layout: {something: "hi"}}));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphConfig] as any)({commit} as any, new FormData());

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphConfig)
        expect(commit.mock.calls[0][1]).toStrictEqual({data: {whatever: 1}, layout: {something: "hi"}});
    });

});
