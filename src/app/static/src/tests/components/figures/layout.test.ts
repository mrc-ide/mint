import {useLayout} from "../../../app/components/figures/graphs/layout";

describe("layout", () => {
    const settings = {zonal_budget: 1000};

    it("set y values for line shapes where y_formula is set", () => {
        const layout = {
            shapes: [
                {
                    type: "line",
                    y_formula: "{zonal_budget}",
                    x0: 0,
                    x1: 1
                },
                {
                    type: "line",
                    y_formula: "{zonal_budget} * 2",
                    x0: 0,
                    x1: 2
                }
            ]
        };

        const transformedLayout = useLayout({layout, settings});
        expect(transformedLayout.shapes).toStrictEqual([
            {...layout.shapes[0], y0: 1000, y1: 1000},
            {...layout.shapes[1], y0: 2000, y1: 2000}
        ]);
    });

    it("does not update non-line shapes", () => {
        const layout = {
            shapes: [
                {
                    type: "line",
                    y_formula: "{zonal_budget}",
                },
                {
                    type: "rect",
                    y_formula: "{zonal_budget} * 2"
                }
            ]
        };

        const transformedLayout = useLayout({layout, settings});
        expect(transformedLayout.shapes).toStrictEqual([
            {...layout.shapes[0], y0: 1000, y1: 1000},
            {...layout.shapes[1]}
        ]);
    });

    it("does nothing when y_formula is not set", () => {
        const layout = {
            shapes: [
                {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: 100,
                    y1: 200
                }
            ]
        };

        const transformedLayout = useLayout({layout, settings});
        expect(transformedLayout).toStrictEqual(layout);
    });
});
