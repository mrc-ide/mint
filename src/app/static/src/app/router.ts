import Vue from "vue";
import VueRouter from "vue-router";
import projectListPage from "./components/projectListPage.vue";
import accessibilityPage from "./components/accessibilityPage.vue";
import privacyPage from "./components/privacyPage.vue";

const regionPage = () => import("./components/regionPage.vue");
const strategisePage = () => import("./components/strategisePage.vue");

const routes = [
    {path: "/", component: projectListPage},
    {path: "/projects/:project/regions/:region", component: regionPage},
    {path: "/accessibility", component: accessibilityPage},
    {path: "/privacy", component: privacyPage},
    {path: "/strategise", component: strategisePage}
];

export const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VueRouter);
