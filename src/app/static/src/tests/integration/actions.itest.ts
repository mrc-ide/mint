import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";

describe("actions", () => {

    it("can get prevalence graph data", async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {country: "Malawi"} as any;

        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit, state, dispatch} as any, {});

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData);
        const firstRow = commit.mock.calls[0][1][0]
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "intervention",
                "irs_use",
                "month",
                "net_use",
                "prevalence",
                "resistance",
                "value"]);
    });

});
