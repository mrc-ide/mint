import {mount} from "@vue/test-utils";
import StrategiesTable from "../../../../app/components/figures/strategise/strategiesTable.vue";
import {BTable} from "bootstrap-vue";

describe("strategies table", () => {

    it("renders table", () => {
        const wrapper = mount(StrategiesTable, {
            propsData: {
                strategies: [
                    {
                        costThreshold: 1,
                        strategy: {
                            casesAverted: 100,
                            cost: 1000,
                            interventions: [
                                {zone: "Region A", intervention: "irs-llin-pbo"},
                                {zone: "Region B", intervention: "irs-llin"}
                            ]
                        }
                    },
                    {
                        costThreshold: 0.95,
                        strategy: {
                            casesAverted: 50,
                            cost: 500,
                            interventions: [
                                {zone: "Region A", intervention: "pbo-llin"},
                                {zone: "Region B", intervention: "llin"}
                            ]
                        }
                    }
                ]
            }
        });
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

});
