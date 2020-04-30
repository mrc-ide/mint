import Vue from "vue";
import {shallowMount} from "@vue/test-utils";
import verticalTabs from "../../app/components/verticalTabs.vue";

describe("vertical tabs", () => {

    beforeAll(() => {
        // JSDOM doesn't implement layout so this is always zero by default
        // https://github.com/testing-library/react-testing-library/issues/353
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {configurable: true, value: 100})
    })

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', 0)
    });

    const getWrapper = () => {
       return shallowMount(verticalTabs, {
            propsData: {
                tabs: ["one", "two"],
                activeTab: "one"
            }
        });
    }

    it("displays tabs and active tab", () => {
        const wrapper = getWrapper();
        const tabs = wrapper.findAll("a.nav-link");
        expect(tabs.at(0).text()).toBe("one");
        expect(tabs.at(0).classes()).toContain("active");

        expect(tabs.at(1).text()).toBe("two");
        expect(tabs.at(1).classes()).not.toContain("active");
    });

    it("emits tab-selected event when tab is clicked", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("a").at(0).trigger("click");

        await Vue.nextTick();
        expect(wrapper.emitted("tab-selected")!![0][0]).toBe("one");
    });

    it("adds col styling", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(".col").attributes().style)
            .toBe("position: absolute; top: 0px; left: 0px; padding-left: 42px;");
    });

    it("calculates tab translation", async () => {
        const wrapper = getWrapper();

        await Vue.nextTick();
        expect(wrapper.find(".nav-tabs").attributes().style)
            .toBe("z-index: 999; height: 42px; transform-origin: 0 0; transform: translate(0, 100px) rotate(-90deg);");

    });

    it("re-calculates tab translation if tabs change", async () => {
        const wrapper = getWrapper();

        await Vue.nextTick();
        expect(wrapper.find(".nav-tabs").attributes().style)
            .toBe("z-index: 999; height: 42px; transform-origin: 0 0; transform: translate(0, 100px) rotate(-90deg);");

        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {configurable: true, value: 50});

        wrapper.setProps({tabs: []});

        await Vue.nextTick();
        await Vue.nextTick(); // wait 2 ticks because that's what the watcher does internally

        expect(wrapper.find(".nav-tabs").attributes().style)
            .toBe("z-index: 999; height: 42px; transform-origin: 0 0; transform: translate(0, 50px) rotate(-90deg);");

    });

});
