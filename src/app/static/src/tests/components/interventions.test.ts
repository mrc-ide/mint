import Vue from "vue";
import {mount} from "@vue/test-utils";
import interventions from "../../app/components/interventions.vue";

describe("interventions", () => {

    it("initialises tabs", () => {
        const wrapper = mount(interventions);
        const tabs = wrapper.findAll("a");
        expect(tabs.at(0).text()).toBe("Table");
        expect(tabs.at(0).classes()).not.toContain("active");
        expect(tabs.at(1).text()).toBe("Graphs");
        expect(tabs.at(1).classes()).toContain("active");
    });

    it("can change tab", async () => {
        const wrapper = mount(interventions);
        const tabs = wrapper.findAll("a");
        expect(tabs.at(1).classes()).toContain("active");

        tabs.at(0).trigger("click");

        await Vue.nextTick();
        expect(tabs.at(1).classes()).not.toContain("active");
        expect(tabs.at(0).classes()).toContain("active");
    });

});
