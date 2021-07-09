import {shallowMount} from "@vue/test-utils";
import StrategisePage from "../../app/components/strategisePage.vue";
import LoadingSpinner from "../../app/components/loadingSpinner.vue";
import Vuex from "vuex";
import {RootAction} from "../../app/actions";
import StrategiesTable from "../../app/components/figures/strategise/strategiesTable.vue";

describe("strategise page", () => {

    it("displays spinner if no strategies available", () => {
        const mockAction = jest.fn();
        const store = new Vuex.Store({
            state: {
                currentProject: {
                    strategies: []
                }
            },
            actions: {
                [RootAction.Strategise]: mockAction
            }
        });
        const wrapper = shallowMount(StrategisePage, {store});
        expect(mockAction.mock.calls.length).toBe(1);
        expect(wrapper.find(LoadingSpinner).exists()).toBe(true);
        expect(wrapper.find(StrategiesTable).exists()).toBe(false);
    });

    it("displays table if strategies are available", () => {
        const store = new Vuex.Store({
            state: {
                currentProject: {
                    strategies: [
                        {
                            costThreshold: 1,
                            strategy: {}
                        }
                    ]
                }
            },
            actions: {
                [RootAction.Strategise]: jest.fn()
            }
        });
        const wrapper = shallowMount(StrategisePage, {store});
        expect(wrapper.find(StrategiesTable).exists()).toBe(true);
        expect(wrapper.find(LoadingSpinner).exists()).toBe(false);
    });

});
