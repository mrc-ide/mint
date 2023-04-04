import {mount} from "@vue/test-utils";
import StrategyTable from "../../../../app/components/figures/strategise/strategyTable.vue";
import {BTable} from "bootstrap-vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../../../mocks";

describe("strategy table", () => {

    it("renders table", () => {
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject("My Project", ["Avalon", "Atlantis", "Asgard"])
            })
        });
        store.state.currentProject!.regions[0].baselineSettings["population"] = 1000;
        store.state.currentProject!.regions[1].baselineSettings["population"] = 2000;
        store.state.currentProject!.regions[2].baselineSettings["population"] = 3000;
        const wrapper = mount(StrategyTable, {
            propsData: {
                strategy: {
                    costThreshold: 1,
                    interventions: [
                        {
                            zone: "Avalon",
                            intervention: "irs",
                            cost: 500,
                            casesAverted: 300,
                            casesAvertedErrorMinus: 295,
                            casesAvertedErrorPlus: 400
                        },
                        {
                            zone: "Atlantis",
                            intervention: "none",
                            cost: 0,
                            casesAverted: 0,
                            casesAvertedErrorMinus: 0,
                            casesAvertedErrorPlus: 0
                        },
                        {
                            zone: "Asgard",
                            intervention: "llin",
                            cost: 750,
                            casesAverted: 600,
                            casesAvertedErrorMinus: 590,
                            casesAvertedErrorPlus: 610
                        }
                    ]
                }
            },
            store
        });

        expect(wrapper.find(BTable).exists()).toBe(true);
        expect(wrapper.findAll("th").length).toBe(10);
        expect(wrapper.findAll("tbody tr").length).toBe(4);

        const firstRow = wrapper.findAll("tbody tr:first-child td");
        expect(firstRow.at(0).text()).toBe("Avalon");
        expect(firstRow.at(1).text()).toBe("IRS only");
        expect(firstRow.at(2).text()).toBe("1000");
        expect(firstRow.at(3).text()).toBe("300");
        expect(firstRow.at(3).find("abbr").attributes("title")).toBe("300 +100 / -5");
        expect(firstRow.at(4).text()).toBe("33.3%");
        expect(firstRow.at(4).find("abbr").attributes("title")).toBe("33.3% +11.9 / -4.1");
        expect(firstRow.at(5).text()).toBe("$500");
        expect(firstRow.at(6).text()).toBe("40%");
        expect(firstRow.at(7).text()).toBe("$2");
        expect(firstRow.at(7).find("abbr").attributes("title")).toBe("$2 +$0 / -$0");
        expect(firstRow.at(8).text()).toBe("$0.5");
        expect(firstRow.at(9).text()).toBe("0.3");
        expect(firstRow.at(9).find("abbr").attributes("title")).toBe("0.3 +0.1 / -0");
        expect(firstRow.at(1).classes()).toContain("table-irs");

        const secondRow = wrapper.findAll("tbody tr:nth-child(2) td");
        expect(secondRow.at(0).text()).toBe("Atlantis");
        expect(secondRow.at(1).text()).toBe("No intervention");
        expect(secondRow.at(2).text()).toBe("2000");
        expect(secondRow.at(3).text()).toBe("0");
        expect(secondRow.at(4).text()).toBe("0%");
        expect(secondRow.at(5).text()).toBe("$0");
        expect(secondRow.at(6).text()).toBe("0%");
        expect(secondRow.at(7).text()).toBe("NA");
        expect(secondRow.at(8).text()).toBe("$0");
        expect(secondRow.at(9).text()).toBe("0");
        expect(secondRow.at(1).classes()).toContain("table-none");

        const lastRow = wrapper.findAll("tbody tr:last-child td");
        expect(lastRow.at(0).text()).toBe("Total");
        expect(lastRow.at(1).text()).toBe("");
        expect(lastRow.at(2).text()).toBe("6000");
        expect(lastRow.at(3).text()).toBe("900");
        expect(lastRow.at(3).find("abbr").attributes("title")).toBe("900 +110 / -15");
        expect(lastRow.at(4).text()).toBe("100%");
        expect(lastRow.at(5).text()).toBe("$1,250");
        expect(lastRow.at(6).text()).toBe("100%");
        expect(lastRow.at(7).text()).toBe("");
        expect(lastRow.at(8).text()).toBe("");
        expect(lastRow.at(9).text()).toBe("");
    });

});
