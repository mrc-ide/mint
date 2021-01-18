import {actions, RootAction} from "../../app/actions";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("actions", () => {

    const getStateWithBaselineSettings = async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchBaselineOptions] as any)({commit} as any);
        const options = commit.mock.calls[0][1] as DynamicFormMeta;
        const settings = {} as any;
        options.controlSections.forEach((section) => {
            section.controlGroups.forEach((group) => {
                group.controls.forEach((control) => {
                    settings[control.name] = control.value
                });
            });
        });
        return {
            currentProject: {
                currentRegion: {
                    baselineSettings: settings
                }
            }
        };
    };

    it("can get prevalence graph data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineSettings();
        await (actions[RootAction.FetchPrevalenceGraphData] as any)({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "intervention",
                "irsUse",
                "month",
                "netUse",
                "value"]);
    });

    it("can get prevalence graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchPrevalenceGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddPrevalenceGraphConfig);
        expect(commit.mock.calls[0][1].layout.title).toBeDefined(); // just confirm it's the expected type
    });

    it("can get cases averted graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchCasesGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCasesGraphConfig);
        expect(commit.mock.calls[0][1].layout.title).toBeDefined(); // just confirm it's the expected type
    });

    it("can get cost cases averted graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchCostCasesGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostCasesGraphConfig);
    });

    it("can get cost per case graph config", async () => {
        const commit = jest.fn();

        await (actions[RootAction.FetchCostPerCaseGraphConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostPerCaseGraphConfig);
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
        expect(options.controlSections[0].label).toBe("Intervention coverage potential");
    });

    it("can get table data", async () => {
        const commit = jest.fn();
        const state = await getStateWithBaselineSettings();
        await (actions[RootAction.FetchTableData] as any)({commit, state} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddTableData);
        const firstRow = commit.mock.calls[0][1][0];
        expect(Object.keys(firstRow).sort())
            .toEqual([
                "casesAverted",
                "casesAvertedErrorMinus",
                "casesAvertedErrorPlus",
                "casesAvertedPer1000",
                "casesAvertedPer1000ErrorMinus",
                "casesAvertedPer1000ErrorPlus",
                "intervention",
                "irsUse",
                "meanCases",
                "netUse",
                "prevYear1",
                "prevYear2",
                "prevYear3",
                "reductionInCases",
                "reductionInCasesErrorMinus",
                "reductionInCasesErrorPlus",
                "reductionInPrevalence"]);
    });

    it("can get impact table config", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchImpactTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddImpactTableConfig);
        expect(commit.mock.calls[0][1][0].valueCol)
            .toBe("intervention");
    });

    it("can get cost table config", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchCostTableConfig] as any)({commit} as any);

        expect(commit.mock.calls[0][0]).toBe(RootMutation.AddCostTableConfig);
        expect(commit.mock.calls[0][1][0].valueCol)
            .toBe("intervention");
    });

    it("can get docs", async () => {
        const commit = jest.fn();
        await (actions[RootAction.FetchDocs] as any)({commit} as any);

        expect(new Set(commit.mock.calls.map(call => call[0]))).toEqual(new Set([RootMutation.UpdateImpactDocs, RootMutation.UpdateCostDocs]));
        expect(commit.mock.calls[0][1]).toContain("<ul>");
        expect(commit.mock.calls[1][1]).toContain("<ul>");

    });

});
