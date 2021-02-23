import Vue from "vue";
import VueRouter from "vue-router";
import projectListPage from "./components/projectListPage.vue";
import accessibilityPage from "./components/accessibilityPage.vue"
// @ts-ignore Dynamic imports not supported error
const regionPage = () => import("./components/regionPage.vue");


const routes = [
    {path: "/", component: projectListPage},
    {path: "/projects/:project/regions/:region", component: regionPage},
    {path: "/accessibility", component: accessibilityPage}
];

export const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VueRouter);
