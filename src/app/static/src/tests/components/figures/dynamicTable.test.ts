import dynamicTable from "../../../app/components/figures/dynamicTable.vue";

import {mount} from "@vue/test-utils";
import {ColumnDefinition, Data} from "../../../app/generated";
import Vue from "vue";

describe("dynamic table", () => {

    const data: Data = [
        {
            "intervention": "none",
            "net_use": "n/a",
            "cases_averted": 0,
            "prev": 0.111,
            "cases_averted_per_1000": 0
        },
        {
            "intervention": "none",
            "net_use": "0.4",
            "cases_averted": 0,
            "prev": 0.222,
            "cases_averted_per_1000": 0
        },
        {
            "intervention": "ITN",
            "net_use": "0.2",
            "cases_averted": 3,
            "prev": 0.311,
            "cases_averted_per_1000": 32
        },
        {
            "intervention": "ITN",
            "net_use": "0.4",
            "cases_averted": 3,
            "prev": 0.411,
            "cases_averted_per_1000": 37
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
        },
        {
            displayName: "Cost per 1000 cases averted",
            valueCol: "intervention",
            valueTransform: {
                "none": "({population} * {procure_people_per_net}) / {cases_averted_per_1000}",
                "ITN": "({population} * {procure_people_per_net} * 2) / {cases_averted_per_1000}",
            },
            transform: "round({} / 10) * 10",
            format: "0"
        }
    ];

    const settings = {
        net_use: 0.2,
        population: 50,
        procure_people_per_net: 100
    }

    it("adds headers from definitions", () => {
        const wrapper = mount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const headers = wrapper.findAll("th");
        expect(headers.length).toBe(7);
        expect(headers.at(0).text()).toContain("Intervention");
        expect(headers.at(1).text()).toContain("Net use");
        expect(headers.at(2).text()).toContain("Cases averted");
        expect(headers.at(3).text()).toContain("Prevalence");
        expect(headers.at(4).text()).toContain("Total costs");
        expect(headers.at(5).text()).toContain("Cost per case averted");
        expect(headers.at(6).text()).toContain("Cost per 1000 cases averted");
    });

    it("filters rows by settings", () => {
        const wrapper = mount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const rows = wrapper.findAll("tbody tr");
        expect(rows.length).toBe(2);
        expect(rows.at(0).find("td").text()).toBe("display name for none");
        expect(rows.at(0).findAll("td").at(1).text()).toBe("n/a");
        expect(rows.at(1).find("td").text()).toBe("display name for ITN");
        expect(rows.at(1).findAll("td").at(1).text()).toBe("0.2");
    });

    it("re-filters rows when settings change", async () => {
        const wrapper = mount(dynamicTable, {
            propsData: {data, config, settings}
        });
        expect(wrapper.findAll("tbody tr").length).toBe(2);
        await wrapper.setProps({settings: {...settings, net_use: 0.4}});
        expect(wrapper.findAll("tbody tr").length).toBe(3);
    });

    it("formats cells", () => {
        const wrapper = mount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const rows = wrapper.findAll("tbody tr");
        expect(rows.at(0).find("td").text()).toBe("display name for none");
        expect(rows.at(0).findAll("td").at(1).text()).toBe("n/a"); // net use
        expect(rows.at(0).findAll("td").at(2).text()).toBe("0"); // cases averted
        expect(rows.at(0).findAll("td").at(3).text()).toBe("0.11"); // prev
        expect(rows.at(0).findAll("td").at(4).text()).toBe("5k"); // total costs
        expect(rows.at(0).findAll("td").at(5).text()).toBe("n/a"); // costs per case averted
        expect(rows.at(0).findAll("td").at(6).text()).toBe("n/a"); // costs per 1000 cases averted

        expect(rows.at(1).find("td").text()).toBe("display name for ITN");
        expect(rows.at(1).findAll("td").at(1).text()).toBe("0.2"); // net use
        expect(rows.at(1).findAll("td").at(2).text()).toBe("3"); // cases averted
        expect(rows.at(1).findAll("td").at(3).text()).toBe("0.31"); // prev
        expect(rows.at(1).findAll("td").at(4).text()).toBe("10k"); // total costs
        expect(rows.at(1).findAll("td").at(5).text()).toBe("3.3k"); // costs per case averted
        expect(rows.at(1).findAll("td").at(6).text()).toBe("310"); // costs per 1000 cases averted
    });

    it("adds tooltips for cells with error values", () => {
        const data: Data = [
            {
                "intervention": "none",
                "net_use": "n/a",
                "cases_averted": 0,
                "cases_averted_error_minus": 0,
                "cases_averted_error_plus": 0,
                "prev": 0.111,
                "cases_averted_per_1000": 0
            },
            {
                "intervention": "none",
                "net_use": "0.4",
                "cases_averted": 0,
                "cases_averted_error_minus": 0,
                "cases_averted_error_plus": 0,
                "prev": 0.222,
                "cases_averted_per_1000": 0
            },
            {
                "intervention": "ITN",
                "net_use": "0.2",
                "cases_averted": 3,
                "cases_averted_error_minus": 1,
                "cases_averted_error_plus": 4,
                "prev": 0.311,
                "cases_averted_per_1000": 32
            },
            {
                "intervention": "ITN",
                "net_use": "0.4",
                "cases_averted": 3,
                "cases_averted_error_minus": 2,
                "cases_averted_error_plus": 5,
                "prev": 0.411,
                "cases_averted_per_1000": 37
            },
            {
                "intervention": "IRS",
                "net_use": "0.2",
                "cases_averted": 5,
                "cases_averted_error_minus": 5,
                "cases_averted_error_plus": 8,
                "prev": 0.411,
                "cases_averted_per_1000": 37
            },
        ];
        const config: ColumnDefinition[] = [
            {
                displayName: "Intervention",
                valueCol: "intervention",
                valueTransform: {
                    "none": "'display name for none'",
                    "ITN": "'display name for ITN'",
                    "IRS": "'display name for IRS'"
                }
            },
            {
                displayName: "Cases averted",
                valueCol: "cases_averted",
                error: {
                    minus: {
                        valueCol: "cases_averted_error_minus"
                    },
                    plus: {
                        valueCol: "cases_averted_error_plus"
                    }
                },
            },
            {
                displayName: "Cost per case averted",
                valueCol: "intervention",
                valueTransform: {
                    "none": "{population} * {procure_people_per_net} / {cases_averted}",
                    "ITN": "{population} * {procure_people_per_net} * 2 / {cases_averted}",
                    "IRS": "{population} * {procure_people_per_net} * 2 / {cases_averted}"
                },
                error: {
                    minus: {
                        valueTransform: {
                            "none": "{population} * {procure_people_per_net} / {cases_averted_error_plus}",
                            "ITN": "{population} * {procure_people_per_net} * 2 / {cases_averted_error_plus}",
                            "IRS": "{population} * {procure_people_per_net} * 2 / {cases_averted_error_plus}"
                        }
                    },
                    plus: {
                        valueTransform: {
                            "none": "{population} * {procure_people_per_net} / {cases_averted_error_minus}",
                            "ITN": "{population} * {procure_people_per_net} * 2 / {cases_averted_error_minus}",
                            "IRS": "{population} * {procure_people_per_net} * 2 / {cases_averted_error_minus}"
                        }
                    }
                },
                format: "0.0a"
            }
        ];
        const wrapper = mount(dynamicTable, {
            propsData: {data, config, settings}
        });
        const rows = wrapper.findAll("tbody tr");

        expect(rows.at(0).find("td").text()).toBe("display name for none");
        expect(rows.at(0).findAll("td").at(1).text()).toBe("0"); // cases averted
        expect(rows.at(0).findAll("td").at(1).find("abbr").attributes().title).toBe("0 +0 / -0");
        expect(rows.at(0).findAll("td").at(2).text()).toBe("n/a"); // costs per case averted
        expect(rows.at(0).findAll("td").at(2).contains("abbr")).toBe(false);

        expect(rows.at(1).find("td").text()).toBe("display name for ITN");
        expect(rows.at(1).findAll("td").at(1).find("abbr").text()).toBe("3"); // cases averted
        expect(rows.at(1).findAll("td").at(1).find("abbr").attributes().title).toBe("3 +1 / -2");
        expect(rows.at(1).findAll("td").at(2).find("abbr").text()).toBe("3.3k"); // costs per case averted
        expect(rows.at(1).findAll("td").at(2).find("abbr").attributes().title).toBe("3.3k +6.7k / -833.3");

        expect(rows.at(2).find("td").text()).toBe("display name for IRS");
        expect(rows.at(2).findAll("td").at(1).find("abbr").text()).toBe("5"); // cases averted
        expect(rows.at(2).findAll("td").at(1).find("abbr").attributes().title).toBe("5 +3 / -0");
        expect(rows.at(2).findAll("td").at(2).find("abbr").text()).toBe("2.0k"); // costs per case averted
        expect(rows.at(2).findAll("td").at(2).find("abbr").attributes().title).toBe("2.0k +0.0 / -750.0");

    });
});
