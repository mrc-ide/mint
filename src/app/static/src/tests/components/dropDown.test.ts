import Vue from "vue";
import {mount, shallowMount} from "@vue/test-utils";
import dropDown from "../../app/components/dropDown.vue";

describe("drop down", () => {

    it("renders text and extra css classes", () => {
        const wrapper = shallowMount(dropDown, {
            propsData: {
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
        const wrapper = shallowMount(dropDown, {propsData: {text: "text"}});
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu", "show"]);
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);
    });

    it("closes dropdown on clicks outside the element", async () => {
        const fakeComponent = {
            components: {dropDown},
            template: "<div><span>another random element</span><drop-down></drop-down></div>"
        }
        const wrapper = mount(fakeComponent, {attachToDocument: true});
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu", "show"]);

        wrapper.find("span").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);

        // destroy wrapper to remove from DOM
        wrapper.destroy();
    });

    it("closes dropdown on navigation from within the dropdown", async () => {
        const fakeComponent = {
            components: {dropDown},
            template: "<drop-down><a href='http://somewhere.com' id='test'>some link</a></drop-down>"
        }
        const wrapper = mount(fakeComponent, {attachToDocument: true});
        wrapper.find(".dropdown-toggle").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu", "show"]);

        wrapper.find("#test").trigger("click");
        await Vue.nextTick();
        expect(wrapper.find(".dropdown-menu").classes()).toStrictEqual(["dropdown-menu"]);

        // destroy wrapper to remove from DOM
        wrapper.destroy();
    });
});
