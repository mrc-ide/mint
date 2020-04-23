import Vue from "vue";
import app from "./components/app.vue";
import {store} from "./store";
import {router} from "./router";

export const mint = new Vue({
    el: "#app",
    render: h => h(app),
    store,
    router
});
