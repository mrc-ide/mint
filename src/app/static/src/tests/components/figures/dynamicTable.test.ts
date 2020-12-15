import dynamicTable from "../../../app/components/figures/dynamicTable.vue";

import {shallowMount} from "@vue/test-utils";
import {ColumnDefinition, Data} from "../../../app/generated";

describe("dynamic table", () => {

    const data: Data = [
        {
            "intervention": "none",
            "net_use": "n/a",
            "cases_averted": 0,
            "prev": 0.111
        },
        {
            "intervention": "none",
            "net_use": "0.4",
            "cases_averted": 0,
            "prev": 0.222
        },
        {
            "intervention": "ITN",
            "net_use": "0.2",
            "cases_averted": 3,
            "prev": 0.311
        },
        {
            "intervention": "ITN",
            "net_use": "0.4",
            "cases_averted": 3,
            "prev": 0.411
        }];

    const config: ColumnDefinition[] = [
        {
            displayName: "Intervention",
            valueCol: "intervention",
            valueTransform: {
                "none": "'display name for none'",
                "ITN": "'display name for ITN'"
            }
        },
        {
            displayName: "Net use",
            valueCol: "net_use"
        },
        {
            displayName: "Cases averted",
            valueCol: "cases_averted"
        },
        {
            displayName: "Prevalence",
            valueCol: "prev",
            precision: 2
        },
        {
            displayName: "Total costs",
            valueCol: "intervention",
            valueTransform: {
                "none": "{population} * {procure_people_per_net}",
                "ITN": "{population} * {procure_people_per_net} * 2",
            },
            format: "0a"
        },
        {
            displayName: "Cost per case averted",
            valueCol: "intervention",
            valueTransform: {
                "none": "({population} * {procure_people_per_net})/{cases_averted}",
                "ITN": "({population} * {procure_people_per_net} * 2)/{cases_averted}",
            },
            format: "0.0a"
        }
    ];

    const settings = {
        net_use: 0.2,
        population: 50,
        procure_people_per_net: 100
    }

    it("adds headers from definitions", () => {
        const wrapper = shallowMount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const headers = wrapper.findAll("th");
        expect(headers.length).toBe(6);
        expect(headers.at(0).text()).toBe("Intervention");
        expect(headers.at(1).text()).toBe("Net use");
        expect(headers.at(2).text()).toBe("Cases averted");
        expect(headers.at(3).text()).toBe("Prevalence");
        expect(headers.at(4).text()).toBe("Total costs");
        expect(headers.at(5).text()).toBe("Cost per case averted");
    });

    it("filters rows by settings", () => {
        const wrapper = shallowMount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const rows = wrapper.findAll("tbody tr");
        expect(rows.length).toBe(2);
        expect(rows.at(0).find("td").text()).toBe("display name for none");
        expect(rows.at(0).findAll("td").at(1).text()).toBe("n/a");
        expect(rows.at(1).find("td").text()).toBe("display name for ITN");
        expect(rows.at(1).findAll("td").at(1).text()).toBe("0.2");
    });

    it("formats cells", () => {
        const wrapper = shallowMount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const rows = wrapper.findAll("tbody tr");
        expect(rows.at(0).find("td").text()).toBe("display name for none");
        expect(rows.at(0).findAll("td").at(1).text()).toBe("n/a"); // net use
        expect(rows.at(0).findAll("td").at(2).text()).toBe("0"); // cases averted
        expect(rows.at(0).findAll("td").at(3).text()).toBe("0.11"); // prev
        expect(rows.at(0).findAll("td").at(4).text()).toBe("5k"); // total costs
        expect(rows.at(0).findAll("td").at(5).text()).toBe("n/a"); // costs per case averted

        expect(rows.at(1).find("td").text()).toBe("display name for ITN");
        expect(rows.at(1).findAll("td").at(1).text()).toBe("0.2"); // net use
        expect(rows.at(1).findAll("td").at(2).text()).toBe("3"); // cases averted
        expect(rows.at(1).findAll("td").at(3).text()).toBe("0.31"); // prev
        expect(rows.at(1).findAll("td").at(4).text()).toBe("10k"); // total costs
        expect(rows.at(1).findAll("td").at(5).text()).toBe("3.3k"); // costs per case averted
    });

});
