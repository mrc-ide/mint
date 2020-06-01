import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("actions", () => {

    const getStateWithBaselineOptions = async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchPrevalenceGraphConfig] as any)({commit} as any);
        const options = commit.mock.calls[0][1] as DynamicFormMeta;
        return {
            currentProject: {
                currentRegion: {
                    baselineOptions: options
                }
            }
        };
    };

    it("can get prevalence graph data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineOptions();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit, state} as any);

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

    it("can get cost graph data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineOptions();
        await (actions[RootAction.FetchCostGraphData] as any)({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostGraphData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "cases_averted",
                "cases_averted_error_minus",
                "cases_averted_error_plus",
                "cost",
                "efficacy",
                "efficacy_error_minus",
                "efficacy_error_plus",
                "intervention"]);
    });

    it("can get cost cases averted graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchCostCasesGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostCasesGraphConfig);
    });

    it("can get cost efficacy graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchCostEfficacyGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostEfficacyGraphConfig);
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

    it("can get intervention options", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchInterventionOptions] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddInterventionOptions);
        const options = commit.mock.calls[0][1] as DynamicFormMeta;
        expect(options.controlSections.length).toBe(3);
        expect(options.controlSections[0].label).toBe("Procurement and distribution");
    });

    it("can get impact table data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineOptions();
        await (actions[RootAction.FetchImpactTableData] as any)({commit, state} as any);

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
                "net_use",
                "prev_year_1",
                "prev_year_2",
                "prev_year_3"]);
    });

    it("can get cost table data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineOptions();
        await (actions[RootAction.FetchCostTableData] as any)({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostTableData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "cost",
                "cost_increment",
                "cost_per_case_averted",
                "intervention",
                "irs_use",
                "mean_cases_averted",
                "net_use"]);
    });

    it("can get cost table config", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchCostTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostTableConfig);
        expect(Object.keys(commit.mock.calls[0][1]).sort())
            .toEqual([
                "cost",
                "cost_increment",
                "cost_per_case_averted",
                "intervention",
                "irs_use",
                "mean_cases_averted",
                "net_use"]);
    });


});
