import Vue from "vue";
import {shallowMount} from "@vue/test-utils";
import stepButton from "../../app/components/stepButton.vue";

describe("step button", () => {

    it("adds active class", () => {
        const active = shallowMount(stepButton, {
            propsData: {
                active: true
            }
        });

        const inActive = shallowMount(stepButton, {
            propsData: {
                active: false
            }
        });

        expect(active.find(".step").classes()).toContain("active");
        expect(inActive.find(".step").classes()).not.toContain("active");
    });

    it("emits click event on click", async () => {
        const wrapper = shallowMount(stepButton, {
            propsData: {
                active: true
            }
        });
        wrapper.find(".step").trigger("click");

        await Vue.nextTick();

        expect(wrapper.emitted("click")).toBeDefined();
    });
});


