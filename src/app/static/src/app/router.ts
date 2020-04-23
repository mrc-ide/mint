import Vue from "vue";
import VueRouter from "vue-router";
import projectListPage from "./components/projectListPage.vue";
import regionPage from "./components/regionPage.vue";

const routes = [
    {path: "/", component: projectListPage},
    {path: "/projects/:project/regions/:region", component: regionPage}
]

export const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VueRouter);
