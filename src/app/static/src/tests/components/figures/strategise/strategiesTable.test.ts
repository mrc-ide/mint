import {mount, shallowMount} from "@vue/test-utils";
import StrategiesTable from "../../../../app/components/figures/strategise/strategiesTable.vue";
import {BTable} from "bootstrap-vue";

describe("strategies table", () => {

    const strategies = [
        {
            costThreshold: 1,
            interventions: [
                {zone: "Region A", intervention: "irs-llin-pbo", casesAverted: 60, cost: 600},
                {zone: "Region B", intervention: "irs-llin", casesAverted: 40, cost: 400}
            ]
        },
        {
            costThreshold: 0.95,
            interventions: [
                {zone: "Region A", intervention: "pbo-llin", casesAverted: 35, cost: 300},
                {zone: "Region B", intervention: "llin", casesAverted: 15, cost: 200}
            ]
        }
    ];

    it("renders table", () => {
        const wrapper = mount(StrategiesTable, {propsData: {strategies}});
        expect(wrapper.find(BTable).exists()).toBe(true);
        expect(wrapper.findAll("tbody tr").length).toBe(2);
        expect(wrapper.findAll("th").length).toBe(6);
        const row1 = wrapper.findAll("tbody tr:first-child td");
        expect(row1.at(0).text()).toBe("Strategy 1");
        expect(row1.at(1).text()).toBe("100%");
        expect(row1.at(2).text()).toBe("Pyrethroid-PBO ITN with IRS*");
        expect(row1.at(2).classes()).toContain("table-danger");
        expect(row1.at(3).text()).toBe("Pyrethroid LLIN with IRS*");
        expect(row1.at(3).classes()).toContain("table-warning");
        expect(row1.at(4).text()).toBe("100");
        expect(row1.at(5).text()).toBe("$1,000");
    });

    it("emits strategy-selected event", () => {
        const items = [
            {
                maximum_cost_vs_budget: '100%'
            },
            {
                maximum_cost_vs_budget: '95%'
            }
        ];
        const wrapper = shallowMount(StrategiesTable, {
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
        expect(wrapper.emitted("strategy-selected")).toStrictEqual([[strategies[1]]])
    });

});
