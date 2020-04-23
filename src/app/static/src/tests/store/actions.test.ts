import {mockAxios, mockSuccess} from "../mocks";
import {expectEqualsFrozen} from "../testHelpers";
import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {ActionHandler} from "vuex";
import {RootState} from "../../app/store";

describe("actions", () => {

    beforeEach(() => {
        // stop apiService logging to console
        console.log = jest.fn();
        mockAxios.reset();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockClear();
    });

    it("fetches prevalence graph data", async () => {
        mockAxios.onPost("/graph/prevalence/data")
            .reply(200, mockSuccess([{prev: 1, net_use: 0.2, resistance: "low"}]));

        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit} as any, new FormData());

        expect(commit.mock.calls[0][0]).toBe(RootMutation.PrevalenceGraphDataFetched)
        expectEqualsFrozen(commit.mock.calls[0][1], [{prev: 1, net_use: 0.2, resistance: "low"}]);
    });

});
