import {FilteringProps, useFiltering} from "../../../app/components/figures/filteredData";
import {WideFormatMetadata} from "../../../app/generated";

describe("use filtering", () => {

    it("returns no rows if there are invalid settings selected", () => {

        const props: FilteringProps = {
            settings: {
                "intervention": "none",
                "netUse": ""
            },
            data: [
                {"month": 1, "intervention": "none", "netUse": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": 0.1, "value": 0.2},
                {"month": 2, "intervention": "none", "netUse": 0, "value": 0.3},
                {"month": 2, "intervention": "none", "netUse": 0.1, "value": 0.4},
                {"month": 1, "intervention": "ITN", "netUse": 0, "value": 0.5},
                {"month": 1, "intervention": "ITN", "netUse": 0.1, "value": 0.6},
                {"month": 2, "intervention": "ITN", "netUse": 0, "value": 0.7},
                {"month": 2, "intervention": "ITN", "netUse": 0.1, "value": 0.8}
            ]
        }

        let result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(0);

        props.settings!!.netUse = "";
        result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(0);

        props.settings!!.netUse = 0;
        result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(2);

    });

    it("includes values where a setting is n/a", () => {

        const props: FilteringProps = {
            settings: {
                "netUse": 0
            },
            data: [
                {"month": 1, "intervention": "none", "netUse": "n/a", "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": "n/a", "value": 0.2},
                {"month": 2, "intervention": "none", "netUse": "n/a", "value": 0.3},
                {"month": 2, "intervention": "none", "netUse": "n/a", "value": 0.4},
                {"month": 1, "intervention": "ITN", "netUse": 0, "value": 0.5},
                {"month": 1, "intervention": "ITN", "netUse": 0.1, "value": 0.6},
                {"month": 2, "intervention": "ITN", "netUse": 0, "value": 0.7},
                {"month": 2, "intervention": "ITN", "netUse": 0.1, "value": 0.8}
            ]
        }

        const result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(6);
    });


    it("ignores settings that don't exist in the data", () => {

        const props = {
            settings: {
                "intervention": "none",
                "other_setting": 12
            },
            data: [
                {"month": 1, "intervention": "none", "netUse": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": 0.1, "value": 0.2},
                {"month": 2, "intervention": "none", "netUse": 0, "value": 0.3},
                {"month": 2, "intervention": "none", "netUse": 0.1, "value": 0.4},
                {"month": 1, "intervention": "ITN", "netUse": 0, "value": 0.5},
                {"month": 1, "intervention": "ITN", "netUse": 0.1, "value": 0.6},
                {"month": 2, "intervention": "ITN", "netUse": 0, "value": 0.7},
                {"month": 2, "intervention": "ITN", "netUse": 0.1, "value": 0.8}
            ]
        }

        const result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(4);
    });

    it("ignores settings not included in setting names", () => {
        const localProps = {
            data: [
                {"month": 1, "intervention": "none", "netUse": 0, "irsUse": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": 0.1, "irsUse": 0, "value": 0.2},
            ],
            settings: {
                netUse: 0,
                irsUse: 1
            },
            metadata: {
                settings: ["netUse"]
            } as WideFormatMetadata
        };

        const result = useFiltering(localProps).filteredData.value
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({
            intervention: "none",
            irsUse: 0,
            month: 1,
            netUse: 0,
            value: 0.1
        });
    });

});
