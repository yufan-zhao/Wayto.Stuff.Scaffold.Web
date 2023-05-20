import { RouteConfig } from "vue-router";
import { PermissionCode } from "src/enums";

const projectManage = () => import("/src/views/project/manage/manage.vue");
const projectPlanCalendar = () => import("/src/views/project/plan/manage-calendar.vue");
const projectPlanIncomplete = () => import("/src/views/project/plan/manage-incomplete.vue");
const projectPlanComplete = () => import("/src/views/project/plan/manage-complete.vue");
const projectRectify = () => import("/src/views/project/rectify/manage.vue");
const projectReport = () => import("/src/views/project/report/manage.vue");

const children: Array<RouteConfig> =
[
    {
        name: "project-manage",
        path: "/project/manage",
        component: projectManage,
        meta:
        {
            code: PermissionCode.PROJECT
        }
    },
    {
        name: "project-plan-calendar",
        path: "/project/plan/calendar",
        component: projectPlanCalendar,
        meta:
        {
            code: PermissionCode.PLAN_CALENDAR
        }
    },
    {
        name: "project-plan-incomplete",
        path: "/project/plan/incomplete",
        component: projectPlanIncomplete,
        meta:
        {
            code: PermissionCode.PLAN_INCOMPLETE
        }
    },
    {
        name: "project-plan-complete",
        path: "/project/plan/complete",
        component: projectPlanComplete,
        meta:
        {
            code: PermissionCode.PLAN_COMPLETE
        }
    },
    {
        name: "project-rectify",
        path: "/project/rectify",
        component: projectRectify,
        meta:
        {
            code: PermissionCode.RECTIFY
        }
    },
    {
        name: "project-report",
        path: "/project/report",
        component: projectReport,
        meta:
        {
            code: PermissionCode.REPORT
        }
    }
];

export default children;
