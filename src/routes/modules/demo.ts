import { RouteConfig } from "vue-router";

const switchTable = () => import("/src/views/demo/switch-table/manage.vue");
const paginTable = () => import("/src/views/demo/pagin-table/manage.vue");

const children: Array<RouteConfig> =
[
    {
        name: "demo-switch-table",
        path: "/demo/switch-table",
        component: switchTable
    },
    {
        name: "demo-pagin-table",
        path: "/demo/pagin-table",
        component: paginTable
    }
];

export default children;
