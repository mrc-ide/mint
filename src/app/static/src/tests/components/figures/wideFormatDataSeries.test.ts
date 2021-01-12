import {useWideFormatData} from "../../../app/components/figures/graphs/wideFormatDataSeries";

describe("wide format data series", () => {

    const props = {
        series: [
            {
                x: ["Pyrethoid ITN"],
                id: "ITN"
            },
            {
                x: ["Switch to Pyrethoid-PBO ITN"],
                id: "PBO"
            }
        ],
        metadata: {
            cols: ["cases_averted"],
            id_col: "int",
            format: "wide" as "wide"
        },
        layout: {title: "Test title"},
        data: [
            {"int": "ITN", "net_use": 0, "cases_averted": 100, "cases_averted_low": 90, "cases_averted_high": 110},
            {"int": "ITN", "net_use": 0.1,"cases_averted": 110, "cases_averted_low": 100, "cases_averted_high": 120},
            {"int": "PBO", "net_use": 0, "cases_averted": 500,"cases_averted_low": 450, "cases_averted_high": 550},
            {"int": "PBO", "net_use": 0.1, "cases_averted": 600, "cases_averted_low": 550, "cases_averted_high": 650}
        ],
        settings: {
            net_use: 0
        }
    }

    it("filters rows by settings", () => {
        const dataSeries = useWideFormatData(props).dataSeries.value;
        expect(dataSeries.length).toBe(2);
        expect(dataSeries[0]).toEqual({
            id: "ITN",
            x: ["Pyrethoid ITN"],
            y: [100]
        });

        expect(dataSeries[1]).toEqual({
            id: "PBO",
            x: ["Switch to Pyrethoid-PBO ITN"],
            y: [500]
        });
    });

    it("does not include invalid series definitions", () => {
        const localProps = {
            ...props,
            series: [{name: "PBO"}]
        }
        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(0);
    });

    it("uses setting names to filter settings", () => {
        const localProps = {
            series: [
                {
                    x: ["ITN"],
                    id: "ITN"
                }
            ],
            metadata: {
                cols: ["cases_averted"],
                id_col: "int",
                format: "wide" as "wide",
                settings: ["netUse"]
            },
            layout: {title: "Test title"},
            data: [
                {"int": "ITN", "netUse": 0, "irsUse": 0, "cases_averted": 100},
                {"int": "ITN", "netUse": 0.1, "irsUse": 0, "cases_averted": 110},
            ],
            settings: {
                netUse: 0,
                irsUse: 0
            }
        };

        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(1);
        expect(dataSeries[0]).toEqual({
            id: "ITN",
            x: ["ITN"],
            y: [100]
        });
    });

    it("does not include series definitions with invalid ids", () => {
        const localProps = {
            ...props,
            series: [{id: "badid"}]
        }
        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(0);
    });

    it("includes series with explicit x,y ranges", () => {
        const localProps = {
            ...props,
            series: [{id: "ITN", x: ["ITN"]}, {name: "PBO", x: ["PBO"], y: [900]}]
        }
        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);

        expect(dataSeries[0]).toEqual({
            id: "ITN",
            x: ["ITN"],
            y: [100]
        });

        expect(dataSeries[1]).toEqual({
            name: "PBO",
            x: ["PBO"],
            y: [900]
        });
    });

    it("creates error bar if provided", () => {
        const localProps = {
            ...props,
            series: [{
                id: "ITN", x: ["ITN"], error_y: {
                    cols: ["cases_averted_high"],
                    colsminus: ["cases_averted_low"]
                }
            }]
        }
        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(1);

        expect(dataSeries[0]).toEqual({
            id: "ITN",
            x: ["ITN"],
            y: [100],
            error_y: {
                cols: ["cases_averted_high"],
                colsminus: ["cases_averted_low"],
                array: [110],
                arrayminus: [90]
            }
        });
    });

    it("uses formulae if provided", () => {
        const localProps = {
            ...props,
            series: [
                {
                    x: ["Pyrethoid ITN"],
                    id: "ITN",
                    y_formula: ["{cases_averted} - {cases_averted_low}"]
                },
                {
                    x: ["Switch to Pyrethoid-PBO ITN"],
                    id: "PBO",
                    y_formula: ["{cases_averted_high} - {cases_averted}"]
                }
            ]
        }
        const dataSeries = useWideFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);
        expect(dataSeries[0]).toEqual({
            id: "ITN",
            x: ["Pyrethoid ITN"],
            y: [10],
            y_formula: ["{cases_averted} - {cases_averted_low}"]
        });
        expect(dataSeries[1]).toEqual({
            id: "PBO",
            x: ["Switch to Pyrethoid-PBO ITN"],
            y: [50],
            y_formula: ["{cases_averted_high} - {cases_averted}"]
        });
    });
});
