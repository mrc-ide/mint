import {useLayout} from "../../../app/components/figures/graphs/layout";

describe("layout", () => {
    const settings = {zonal_budget: 1000};

    describe("evaluate shapes", () => {

        it("sets y values for line shapes where y_formula is set", () => {
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
            } as any;

            const transformedLayout = useLayout({layout, settings}, []);
            expect(transformedLayout.shapes).toStrictEqual([
                {...layout.shapes[0], y0: 1000, y1: 1000},
                {...layout.shapes[1], y0: 2000, y1: 2000}
            ]);
        });

        it("removes shapes when evaluation is undefined", () => {
            const layout = {
                shapes: [
                    {
                        type: "line",
                        y_formula: "{not_a_setting}",
                        x0: 0,
                        x1: 1
                    },
                    {
                        type: "line",
                        y_formula: "{zonal_budget}",
                        x0: 0,
                        x1: 1
                    }
                ]
            } as any;

            const transformedLayout = useLayout({layout, settings}, []);
            expect(transformedLayout.shapes).toStrictEqual([
                {...layout.shapes[1], y0: 1000, y1: 1000}
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
            } as any;

            const transformedLayout = useLayout({layout, settings}, []);
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
            } as any;

            const transformedLayout = useLayout({layout, settings}, []);
            expect(transformedLayout).toStrictEqual(layout);
        });

    });

    describe("evaluate ranges", () => {
        it("evaluates series range for y axis", () => {
            const layout = {
                yaxis: {
                    rangemode: "series",
                    autorange: true,
                }
            } as any;
            const series = [
                {y: [10,100,50]},
                {y: [1,2,3]}
            ];
            const transformedLayout = useLayout({layout, settings}, series);
            expect(transformedLayout.yaxis.autorange).toBe(false);
            expect(transformedLayout.yaxis.range).toStrictEqual([0, 102]);
        });

        it("evaluates series range for x axis", () => {
            const layout = {
                xaxis: {
                    rangemode: "series",
                    autorange: true,
                }
            } as any;
            const series = [
                {x: [0,1,2]},
                {x: [10,200,50]}
            ];
            const transformedLayout = useLayout({layout, settings}, series);
            expect(transformedLayout.xaxis.autorange).toBe(false);
            expect(transformedLayout.xaxis.range).toStrictEqual([0, 204]);
        });

        it("if there are  negative values, sets min to lowest", () => {
            const layout = {
                yaxis: {
                    rangemode: "series",
                    autorange: true,
                }
            } as any;
            const series = [
                {y: [10,90,-5]},
                {y: [1,2,3,-10]}
            ];
            const transformedLayout = useLayout({layout, settings}, series);
            expect(transformedLayout.yaxis.autorange).toBe(false);
            expect(transformedLayout.yaxis.range).toStrictEqual([-10, 92]);
        });

        it("does nothing if rangemode is not 'series'", () => {
            const layout = {
                yaxis: {
                    rangemode: "tozero",
                    autorange: true,
                },
                xaxis: {
                    autorange: true
                }
            } as any;
            const series = [
                {x: [0], y: [1]}
            ];
            const transformedLayout = useLayout({layout, settings}, series);
            expect(transformedLayout.yaxis).toStrictEqual({rangemode: "tozero", autorange: true});
            expect(transformedLayout.xaxis).toStrictEqual({autorange: true});
        });
    });
});
