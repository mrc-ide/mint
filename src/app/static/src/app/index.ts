import Vue from "vue";
import app from "./components/app.vue";
import {store} from "./store";

export const mint = new Vue({
    el: "#app",
    render: h => h(app),
    store
});
