import { RouteConfig } from "vue-router";
import { PermissionCode } from "src/enums";

const workbench = () => import("/src/views/workbench/workbench.vue");
const statistic = () => import("/src/views/workbench/statistic.vue");

const children: Array<RouteConfig> =
[
    {
        name: "workbench-index",
        path: "/workbench/index",
        component: workbench,
        meta:
        {
            code: PermissionCode.BBTJ
        }
    },
    {
        name: "workbench-statistic",
        path: "/workbench/statistic",
        component: statistic
    }
];

export default children;
