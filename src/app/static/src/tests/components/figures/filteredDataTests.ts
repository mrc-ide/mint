import {useFiltering} from "../../../app/components/figures/filteredData";

describe("use filtering", () => {

    it("returns no rows if there are invalid settings selected", () => {

        const props = {
            settings: {
                "intervention": "none",
                "net_use": null
            },
            data: [
                {"month": 1, "intervention": "none", "net_use": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "net_use": 0.1, "value": 0.2},
                {"month": 2, "intervention": "none", "net_use": 0, "value": 0.3},
                {"month": 2, "intervention": "none", "net_use": 0.1, "value": 0.4},
                {"month": 1, "intervention": "ITN", "net_use": 0, "value": 0.5},
                {"month": 1, "intervention": "ITN", "net_use": 0.1, "value": 0.6},
                {"month": 2, "intervention": "ITN", "net_use": 0, "value": 0.7},
                {"month": 2, "intervention": "ITN", "net_use": 0.1, "value": 0.8}
            ]
        }

        let result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(0);

        props.settings.net_use = "";
        result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(0);

        props.settings.net_use = 0;
        result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(2);

    });

    it("ignores settings that don't exist in the data", () => {

        const props = {
            settings: {
                "intervention": "none",
                "other_setting": 12
            },
            data: [
                {"month": 1, "intervention": "none", "net_use": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "net_use": 0.1, "value": 0.2},
                {"month": 2, "intervention": "none", "net_use": 0, "value": 0.3},
                {"month": 2, "intervention": "none", "net_use": 0.1, "value": 0.4},
                {"month": 1, "intervention": "ITN", "net_use": 0, "value": 0.5},
                {"month": 1, "intervention": "ITN", "net_use": 0.1, "value": 0.6},
                {"month": 2, "intervention": "ITN", "net_use": 0, "value": 0.7},
                {"month": 2, "intervention": "ITN", "net_use": 0.1, "value": 0.8}
            ]
        }

        const result = useFiltering(props);
        expect(result.filteredData.value.length).toBe(4);
    });

});
