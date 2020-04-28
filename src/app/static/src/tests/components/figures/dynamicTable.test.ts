import dynamicTable from "../../../app/components/figures/dynamicTable.vue";

import {shallowMount} from "@vue/test-utils";
import {Data, TableDefinition} from "../../../app/generated";

describe("dynamic table", () => {

    const data: Data = [
        {
            "intervention": "none",
            "net_use": 0.2,
            "cases_averted": 0,
            "prev": 0.1
        },
        {
            "intervention": "none",
            "net_use": 0.4,
            "cases_averted": 1,
            "prev": 0.2
        },
        {
            "intervention": "ITN",
            "net_use": 0.2,
            "cases_averted": 2,
            "prev": 0.3
        },
        {
            "intervention": "ITN",
            "net_use": 0.4,
            "cases_averted": 3,
            "prev": 0.4
        }];

    const columns: TableDefinition = {
        "intervention": "Intervention",
        "net_use": "Historic net use",
        "prev": "Prevalence",
        "cases_averted": "Cases averted"
    }

    const settings = {
        net_use: 0.2
    }

    it("filters rows by settings", () => {
        const wrapper = shallowMount(dynamicTable, {
            propsData: {data, columns, settings}
        });
        const rows = wrapper.findAll("tbody tr");
        expect(rows.length).toBe(2);
        expect(rows.at(0).find("td").text()).toBe("none");
        expect(rows.at(0).findAll("td").at(3).text()).toBe("0");
        expect(rows.at(1).find("td").text()).toBe("ITN");
        expect(rows.at(1).findAll("td").at(3).text()).toBe("2");
    });

    it("adds headers from definitions", () => {
        const wrapper = shallowMount(dynamicTable, {
            propsData: {data, columns, settings}
        });
        const headers = wrapper.findAll("th");
        expect(headers.length).toBe(4);
        expect(headers.at(0).text()).toBe("Intervention");
        expect(headers.at(1).text()).toBe("Historic net use");
        expect(headers.at(2).text()).toBe("Prevalence");
        expect(headers.at(3).text()).toBe("Cases averted");
    });
});
