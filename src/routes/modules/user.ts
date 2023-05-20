import { RouteConfig } from "vue-router";
import { PermissionCode } from "src/enums";

const userRectify = () => import("/src/views/user/rectify/manage.vue");
const userConstruction = () => import("/src/views/user/construction/manage.vue");
const userOwner = () => import("/src/views/user/owner/manage.vue");

const children: Array<RouteConfig> =
[
    {
        name: "user-rectify",
        path: "/user/rectify",
        component: userRectify,
        meta:
        {
            code: PermissionCode.USER_RECTIFY
        }
    },
    {
        name: "user-construction",
        path: "/user/construction",
        component: userConstruction,
        meta:
        {
            code: PermissionCode.USER_CONSTRUCTION
        }
    },
    {
        name: "user-owner",
        path: "/user/owner",
        component: userOwner,
        meta:
        {
            code: PermissionCode.USER_OWNER
        }
    }
];

export default children;
