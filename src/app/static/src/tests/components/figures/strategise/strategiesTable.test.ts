import {mount} from "@vue/test-utils";
import StrategiesTable from "../../../../app/components/figures/strategise/strategiesTable.vue";
import {BTable} from "bootstrap-vue";

describe("strategies table", () => {

    const strategies = [
        {
            costThreshold: 1,
            interventions: [
                {
                    zone: "Region A",
                    intervention: "irs-llin-pbo",
                    casesAverted: 60,
                    casesAvertedErrorMinus: 55,
                    casesAvertedErrorPlus: 75,
                    cost: 600
                },
                {
                    zone: "Region B",
                    intervention: "irs-llin",
                    casesAverted: 40,
                    casesAvertedErrorMinus: 30,
                    casesAvertedErrorPlus: 45,
                    cost: 400
                }
            ]
        },
        {
            costThreshold: 0.95,
            interventions: [
                {
                    zone: "Region A",
                    intervention: "irs",
                    casesAverted: 35,
                    casesAvertedErrorMinus: 30,
                    casesAvertedErrorPlus: 45,
                    cost: 300
                },
                {
                    zone: "Region B",
                    intervention: "irs-llin-pbo",
                    casesAverted: 15,
                    casesAvertedErrorMinus: 5,
                    casesAvertedErrorPlus: 20,
                    cost: 200
                }
            ]
        },
        {
            costThreshold: 0.9,
            interventions: [
                {
                    zone: "Region A",
                    intervention: "pyrrole-pbo",
                    casesAverted: 34,
                    casesAvertedErrorMinus: 30,
                    casesAvertedErrorPlus: 45,
                    cost: 250
                },
                {
                    zone: "Region B",
                    intervention: "irs-pyrrole-pbo",
                    casesAverted: 14,
                    casesAvertedErrorMinus: 5,
                    casesAvertedErrorPlus: 20,
                    cost: 150
                }
            ]
        }
    ];

    it("renders table", () => {
        const wrapper = mount(StrategiesTable, {propsData: {strategies}});
        expect(wrapper.find(BTable).exists()).toBe(true);

        expect(wrapper.findAll("th").length).toBe(6);
        const rows = wrapper.findAll("tbody tr");
        expect(rows.length).toBe(3);
        const row1 = rows.at(0).findAll("td");
        expect(row1.at(0).text()).toBe("Strategy 1");
        expect(row1.at(1).text()).toBe("100%");
        expect(row1.at(2).text()).toBe("Pyrethroid-PBO ITN with IRS");
        expect(row1.at(2).classes()).toContain("table-irs-llin-pbo");
        expect(row1.at(3).text()).toBe("Pyrethroid-only ITN with IRS");
        expect(row1.at(3).classes()).toContain("table-irs-llin");
        expect(row1.at(4).text()).toBe("100");
        expect(row1.at(4).find("abbr").attributes("title")).toBe("100 +20 / -15");
        expect(row1.at(5).text()).toBe("$1,000");

        const row2 = rows.at(1).findAll("td");
        expect(row2.at(0).text()).toBe("Strategy 2");
        expect(row2.at(1).text()).toBe("95%");
        expect(row2.at(2).text()).toBe("IRS only");
        expect(row2.at(2).classes()).toContain("table-irs");
        expect(row2.at(3).text()).toBe("Pyrethroid-PBO ITN with IRS");
        expect(row2.at(3).classes()).toContain("table-irs-llin-pbo");
        expect(row2.at(4).text()).toBe("50");
        expect(row2.at(4).find("abbr").attributes("title")).toBe("50 +15 / -15");
        expect(row2.at(5).text()).toBe("$500");

        const row3 = rows.at(2).findAll("td");
        expect(row3.at(0).text()).toBe("Strategy 3");
        expect(row3.at(1).text()).toBe("90%");
        expect(row3.at(2).text()).toBe("Pyrethroid-pyrrole ITN only");
        expect(row3.at(2).classes()).toContain("table-pyrrole-pbo");
        expect(row3.at(3).text()).toBe("Pyrethroid-pyrrole ITN with IRS");
        expect(row3.at(3).classes()).toContain("table-irs-pyrrole-pbo");
        expect(row3.at(4).text()).toBe("48");
        expect(row3.at(4).find("abbr").attributes("title")).toBe("48 +17 / -13");
        expect(row3.at(5).text()).toBe("$400");
    });

    it("emits strategy-selected event", () => {
        const items = [
            {maximum_cost_vs_budget: '100%'},
            {maximum_cost_vs_budget: '95%'}
        ];
        const wrapper = mount(StrategiesTable, {
            propsData: {
                strategies
            },
            computed: {
                items() {
                    return items;
                }
            }
        });
        wrapper.find(BTable).vm.$emit("row-selected", [items[1]]);
        expect(wrapper.emitted("strategy-selected")).toStrictEqual([[strategies[1]]]);
    });

});
