import {useLongFormatData} from "../../../app/components/figures/longFormatDataSeries";

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
    }

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
    
    it("returns null for invalid series definitions", () => {
        const localProps = {
            ...props,
            series: [{id: "none"}, {name: "ITN"}]
        }
        const dataSeries = useLongFormatData(localProps).dataSeries.value;
        expect(dataSeries.length).toBe(2);
        expect(dataSeries[0]).toEqual({
            id: "none",
            x: [1, 2],
            y: [0.1, 0.3]
        });
        expect(dataSeries[1]).toBe(null);
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

});

