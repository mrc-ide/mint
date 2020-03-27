import Vue from "vue";
import Vuex from "vuex";

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

Vue.use(Vuex);