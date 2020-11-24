import Vue from "vue";
import {mount, shallowMount} from "@vue/test-utils";
import {BCollapse} from "bootstrap-vue";
import {InfoIcon, ChevronDownIcon, ChevronUpIcon} from "vue-feather-icons";
import collapsibleDocs from "../../app/components/collapsibleDocs.vue";

describe("collapsible docs", () => {

    it("renders collapsed by default", async () => {
        const wrapper = shallowMount(collapsibleDocs, {
            propsData: {
                docs: "<span>test text</span>"
            }
        });

        await Vue.nextTick();

        expect(wrapper.findAll(InfoIcon).length).toBe(1);
        expect(wrapper.find("a").text()).toBe("how to interpret these figures");
        expect(wrapper.find("span").html()).toBe("<span>test text</span>");
        expect(wrapper.findAll(ChevronDownIcon).length).toBe(1);
        expect(wrapper.findAll(ChevronUpIcon).length).toBe(0);
        expect(wrapper.find(BCollapse).props("visible")).toBe(false);
    });

    it("can toggle documentation", async () => {
        const wrapper = shallowMount(collapsibleDocs, {
            propsData: {
                docs: "<span>test text</span>"
            }
        });

        await Vue.nextTick();

        wrapper.find("a").trigger("click");

        await Vue.nextTick();

        expect(wrapper.findAll(ChevronDownIcon).length).toBe(0);
        expect(wrapper.findAll(ChevronUpIcon).length).toBe(1);
        expect(wrapper.find(BCollapse).props("visible")).toBe(true);

        wrapper.find("a").trigger("click");

        await Vue.nextTick();

        expect(wrapper.findAll(ChevronDownIcon).length).toBe(1);
        expect(wrapper.findAll(ChevronUpIcon).length).toBe(0);
        expect(wrapper.find(BCollapse).props("visible")).toBe(false);
    });


});
