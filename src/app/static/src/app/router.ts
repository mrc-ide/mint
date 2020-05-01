import Vue from "vue";
import VueRouter from "vue-router";
// @ts-ignore
const projectListPage = () => import("./components/projectListPage.vue");
// @ts-ignore
const regionPage = () => import("./components/regionPage.vue");

const routes = [
    {path: "/", component: projectListPage},
    {path: "/projects/:project/regions/:region", component: regionPage}
];

export const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VueRouter);
