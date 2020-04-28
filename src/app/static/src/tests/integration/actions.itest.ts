import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("actions", () => {

    it("can get prevalence graph data", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "intervention",
                "irs_use",
                "month",
                "net_use",
                "value"]);
    });

    it("can get prevalence graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchPrevalenceGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphConfig);
        expect(commit.mock.calls[0][1].layout.title).toBeDefined(); // just confirm it's the expected type
    });

    it("can get baseline options", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchBaselineOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddBaselineOptions);
        const options = commit.mock.calls[0][1] as DynamicFormMeta;
        expect(options.controlSections.length).toBe(3);
        expect(options.controlSections[0].label).toBe("Site Inputs");
    });

    it("can get impact table data", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableData] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "cases_averted",
                "intervention",
                "irs_use",
                "net_use",
                "prev_year_1",
                "prev_year_2",
                "prev_year_3"]);
    });

    it("can get impact table config", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableConfig);
        expect(Object.keys(commit.mock.calls[0][1]).sort())
            .toEqual([
                "cases_averted",
                "intervention",
                "irs_use",
                "net_use",
                "prev_year_1",
                "prev_year_2",
                "prev_year_3"]);
    });

});
