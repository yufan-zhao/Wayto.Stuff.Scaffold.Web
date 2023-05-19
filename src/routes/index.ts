import { RouteConfig } from "vue-router";
import { ApplicationContext } from "src/application";
import { RouteUtils } from "src/common/utils";
import menus from "./menus";
import workbench from "./modules/workbench";
import demo from "./modules/demo";
import project from "./modules/project";
import user from "./modules/user";
import features from "./modules/features";

const dashboard = () => import("src/views/dashboard.vue"); // iview dashboard后台管理系统布局组合组件
const login = () => import("src/views/login/ux-login.vue");
const score = () => import("src/views/score/score.vue");

const routes: Array<RouteConfig> =
[
    {
        path: "/",
        redirect: to =>
        {
            const context = ApplicationContext.current;
            const targetRouteName = RouteUtils.findFirstRouteName(context.menus);
            if (targetRouteName)
            {
                return {name: targetRouteName};
            }
            else
            {
                console.error("默认根路由异常", context.menus);
            }
        }
    },
    {
        name: "login",
        path: "/login",
        component: login
    },
    {
        name: "score",
        path: "/score",
        component: score
    },
    {
        name: "demo",
        path: "/demo",
        component: dashboard,
        children: [...demo]
    },
    {
        name: "workbench",
        path: "/workbench",
        component: dashboard,
        children: [...workbench]
    },
    {
        name: "project",
        path: "/project",
        component: dashboard,
        children: [...project]
    },
    {
        name: "user",
        path: "/user",
        component: dashboard,
        children: [...user]
    },
    {
        name: "features",
        path: "/features",
        component: dashboard,
        children: [...features]
    },
    {
        name: "error-no-auth",
        path: "/error-no-auth",
        component: () => import("src/views/error/no-auth.vue")
    }
];

export
{
    routes,
    menus
};
