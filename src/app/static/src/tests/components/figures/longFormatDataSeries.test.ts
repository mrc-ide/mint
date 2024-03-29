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
            {"month": 1, "intervention": "none", "netUse": 0, "value": 0.1},
            {"month": 1, "intervention": "none", "netUse": 0.1, "value": 0.2},
            {"month": 2, "intervention": "none", "netUse": 0, "value": 0.3},
            {"month": 2, "intervention": "none", "netUse": 0.1, "value": 0.4},
            {"month": 1, "intervention": "ITN", "netUse": 0, "value": 0.5},
            {"month": 1, "intervention": "ITN", "netUse": 0.1, "value": 0.6},
            {"month": 2, "intervention": "ITN", "netUse": 0, "value": 0.7},
            {"month": 2, "intervention": "ITN", "netUse": 0.1, "value": 0.8}
        ],
        settings: {
            netUse: 0
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

    it("uses setting names to filter settings", () => {
        const localProps = {
            series: [
                {
                    id: "none"
                }
            ],
            metadata: {
                x_col: "month",
                y_col: "value",
                id_col: "intervention",
                format: "long" as "long",
                settings: ["netUse"]
            },
            data: [
                {"month": 1, "intervention": "none", "netUse": 0, "irsUse": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": 0.1, "irsUse": 0, "value": 0.2},
            ],
            settings: {
                netUse: 0,
                irsUse: 1
            }
        };

        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(1);
        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1],
            y: [0.1]
        });
    });

    it("uses setting names to filter settings", () => {
        const localProps = {
            series: [
                {
                    id: "none"
                }
            ],
            metadata: {
                x_col: "month",
                y_col: "value",
                id_col: "intervention",
                format: "long" as "long",
                settings: ["netUse"]
            },
            data: [
                {"month": 1, "intervention": "none", "netUse": 0, "irsUse": 0, "value": 0.1},
                {"month": 1, "intervention": "none", "netUse": 0.1, "irsUse": 0, "value": 0.2},
            ],
            settings: {
                netUse: 0,
                irsUse: 1
            }
        };

        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(1);
        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1],
            y: [0.1]
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

    it("includes series with y axis given as formula", () => {
        const localProps = {
            ...props,
            series: [{id: "ITN", y_formula: ["1+2", "2+3"]}]
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(1);

        expect(dataSeries[0]).toEqual({
            id: "ITN",
            y_formula: ["1+2", "2+3"],
            x: [1, 2],
            y: [3, 5]
        });
    });

    it("calculates x axis values from formula", () => {
        const localProps = {
            ...props,
            metadata: {
                ...props.metadata,
                x_formula: ["{month} * 2"]
            }
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);

        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [2, 4],
            y: [0.1, 0.3]
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
                {"month": 1, "intervention": "ITN",  "value": 0.5, "error_plus": 1.25, "error_minus": 0.5},
                {"month": 2, "intervention": "ITN", "value": 0.7, "error_plus": 3, "error_minus": 2},
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
            id: "ITN", // intervention
            x: [1, 2], // month
            y: [0.5, 0.7], // value
            error_x: {
                type: "data",
                col: "error_plus",
                colminus: "error_minus",
                array: [0.25, 1],
                arrayminus: [0.5, 0]
            }
        });
    });

    it("includes error_x formulas ", () => {
        const localProps = {
            ...props,
            series: [
                {
                    id: "ITN",
                    error_x: {
                        type: "data",
                        cols: ["{error_plus} * 10"],
                        colsminus: ["{error_minus} * 100"]
                    }
                }
            ],
            data: [
                {"month": 1, "intervention": "ITN",  "value": 0.5, "error_plus": 0.125, "error_minus": 0.005},
                {"month": 2, "intervention": "ITN", "value": 0.7, "error_plus": 0.3, "error_minus": 0.02},
            ],
            settings: null
        };
        const dataSeries = useLongFormatData(localProps).dataSeries.value;

        expect(dataSeries.length).toBe(1);

        expect(dataSeries[0]).toStrictEqual({
            id: "ITN", // intervention
            x: [1, 2], // month
            y: [0.5, 0.7], // value
            error_x: {
                type: "data",
                cols: ["{error_plus} * 10"],
                colsminus: ["{error_minus} * 100"],
                array: [0.25, 1],
                arrayminus: [0.5, 0]
            }
        });
    });

});
