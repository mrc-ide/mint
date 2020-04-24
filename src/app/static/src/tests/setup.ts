import Vue from "vue";
import Vuex from "vuex";
import CompositionApi from '@vue/composition-api'

// create mock element for app to attach to
const app = document.createElement('div');
app.setAttribute('id', 'app');
document.body.appendChild(app);

// implement innerText as its not implemented in jest/jsdom
// https://github.com/jsdom/jsdom/issues/1245
Object.defineProperty((global as any).Element.prototype, 'innerText', {
    get() {
        return this.textContent
    },
    set(value: string) {
        this.textContent = value
    },
    configurable: true
});
// createObjectURL is not implemented in jest/jsdom
// https://github.com/plotly/react-plotly.js/issues/115
window.URL.createObjectURL = function(object: any) {return ""};

Vue.use(Vuex);
Vue.use(CompositionApi);
