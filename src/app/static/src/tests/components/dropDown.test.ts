import Vue from "vue";
import {shallowMount} from "@vue/test-utils";
import {store} from "../../app/store";
import dropDown from "../../app/components/dropDown.vue";

describe("drop down", () => {

    it("renders text and extra css classes", () => {
        const wrapper = shallowMount(dropDown, {
            store, propsData: {
                text: "test text",
                parentClass: "test-parent",
                toggleClass: "test-toggle"
            }
        });
        expect(wrapper.find(".dropdown").classes()).toStrictEqual(["dropdown", "test-parent"]);
        expect(wrapper.find(".dropdown-toggle").classes()).toStrictEqual(["dropdown-toggle", "test-toggle"]);
        expect(wrapper.find(".dropdown-toggle").text()).toBe("test text");
    });

    it("toggles dropdown on click", async () => {
        const wrapper = shallowMount(dropDown, {store, propsData: {text: "text"}});
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu", "show"]);
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);
    });

    it("closes dropdown on blur", async () => {
        const wrapper = shallowMount(dropDown, {store, propsData: {text: "text"}});
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu", "show"]);
        wrapper.find(".dropdown-toggle").trigger("blur");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);
    });
});
