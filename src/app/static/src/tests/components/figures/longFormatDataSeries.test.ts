import {useLongFormatData} from "../../../app/components/figures/graphs/longFormatDataSeries";

describe("long format data series", () => {

    const props = {
        series: [
            {
                id: "none"
            },
            {
                id: "ITN"
            }
        ],
        metadata: {
            x_col: "month",
            y_col: "value",
            id_col: "intervention",
            format: "long" as "long"
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
        ],
        settings: {
            net_use: 0
        }
    };

    it("filters rows by settings", () => {
        const dataSeries = useLongFormatData(props).dataSeries.value;
        expect(dataSeries.length).toBe(2);
        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1, 2],
            y: [0.1, 0.3]
        });

        expect(dataSeries[1]).toEqual({
            id: "ITN",
            x: [1, 2],
            y: [0.5, 0.7]
        });
    });

    it("does not filter if settings are null", () => {
        const localProps = {
            ...props,
            settings: null
        };

        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);
        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1, 1, 2, 2],
            y: [0.1, 0.2, 0.3, 0.4]
        });

        expect(dataSeries[1]).toEqual({
            id: "ITN",
            x: [1, 1, 2, 2],
            y: [0.5, 0.6, 0.7, 0.8]
        });
    });
    
    it("does not include invalid series definitions", () => {
        const localProps = {
            ...props,
            series: [{name: "ITN"}]
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(0);
    });

    it("does not include series definitions with invalid ids", () => {
        const localProps = {
            ...props,
            series: [{id: "badid"}]
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(0);
    });

    it("includes series with explicit x,y ranges", () => {
        const localProps = {
            ...props,
            series: [{id: "none"}, {name: "ITN", x: [1,2], y: [0.01, 0.02]}]
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);

        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1, 2],
            y: [0.1, 0.3]
        });

        expect(dataSeries[1]).toEqual({
            name: "ITN",
            x: [1, 2],
            y: [0.01, 0.02]
        });
    });

    it("includes error_x values when defined", () => {
        const localProps = {
            ...props,
            series: [
                {
                    id: "none"
                },
                {
                    id: "ITN",
                    error_x: {
                        type: "data",
                        col: "error_plus",
                        colminus: "error_minus"
                    }
                }
            ],
            data: [
                {"month": 1, "intervention": "none", "value": 0.1},
                {"month": 2, "intervention": "none", "value": 0.3},
                {"month": 1, "intervention": "ITN",  "value": 0.5, "error_plus": 0.05, "error_minus": 0.06},
                {"month": 2, "intervention": "ITN", "value": 0.7, "error_plus": 0.07, "error_minus": 0.08},
            ],
            settings: null
        };
        const dataSeries = useLongFormatData(localProps).dataSeries.value;

        expect(dataSeries.length).toBe(2);

        expect(dataSeries[0]).toStrictEqual({
            id: "none",
            x: [1, 2],
            y: [0.1, 0.3]
        });

        expect(dataSeries[1]).toStrictEqual({
            id: "ITN",
            x: [1, 2],
            y: [0.5, 0.7],
            error_x: {
                type: "data",
                col: "error_plus",
                colminus: "error_minus",
                array: [0.05, 0.07],
                arrayminus: [0.06, 0.08]
            }
        });
    });

});

