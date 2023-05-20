import { RouteConfig } from "vue-router";
import { PermissionCode } from "src/enums";

// 工器具
const featuresTool = () => import("/src/views/features/tool/manage.vue");
// 知识体系
const featuresKnowledgeTrain = () => import("/src/views/features/knowledge/manage-train.vue");
const featuresKnowledgeAtlas = () => import("/src/views/features/knowledge/manage-atlas.vue");
const featuresKnowledgeCase = () => import("/src/views/features/knowledge/manage-case.vue");
const featuresKnowledgeKnow = () => import("/src/views/features/knowledge/manage-know.vue");
const featuresKnowledgeService = () => import("/src/views/features/knowledge/manage-service.vue");
const featuresKnowledgeDaily = () => import("/src/views/features/knowledge/manage-daily.vue");
// 意见建议
const featuresSuggestion = () => import("/src/views/features/suggestion/manage.vue");
// 系统设置
const featuresSystemOrg = () => import("/src/views/features/system/org.vue");
const featuresSystemRole = () => import("/src/views/features/system/role.vue");
const featuresSystemConfig = () => import("/src/views/features/system/config.vue");
const featuresSystemSpecialStandard = () => import("/src/views/features/system/special-standard.vue");
const featuresSystemSpecialCustomer = () => import("/src/views/features/system/special-customer.vue");

const children: Array<RouteConfig> =
[
    {
        name: "features-tool",
        path: "/features/tool",
        component: featuresTool,
        meta:
        {
            code: PermissionCode.TOOL
        }
    },
    {
        name: "features-knowledge-train",
        path: "/features/knowledge/train",
        component: featuresKnowledgeTrain,
        meta:
        {
            code: PermissionCode.KNOWLEDGE_TRAIN
        }
    },
    {
        name: "features-knowledge-atlas",
        path: "/features/knowledge/atlas",
        component: featuresKnowledgeAtlas,
        meta:
        {
            code: PermissionCode.KNOWLEDGE_ATLAS
        }
    },
    {
        name: "features-knowledge-know",
        path: "/features/knowledge/know",
        component: featuresKnowledgeKnow
        // meta:
        // {
        //     // code: PermissionCode.KNOWLEDGE_KNOW
        // }
    },
    {
        name: "features-knowledge-case",
        path: "/features/knowledge/case",
        component: featuresKnowledgeCase,
        meta:
        {
            code: PermissionCode.KNOWLEDGE_CASE
        }
    },
    {
        name: "features-knowledge-service",
        path: "/features/knowledge/service",
        component: featuresKnowledgeService,
        meta:
        {
            code: PermissionCode.KNOWLEDGE_SERVICE
        }
    },
    {
        name: "features-knowledge-daily",
        path: "/features/knowledge/daily",
        component: featuresKnowledgeDaily,
        meta:
        {
            // code: PermissionCode.KNOWLEDGE_SERVICE
        }
    },
    {
        name: "features-suggestion",
        path: "/features/suggestion",
        component: featuresSuggestion,
        meta:
        {
            code: PermissionCode.SUGGESTION
        }
    },
    {
        name: "features-system-org",
        path: "/features/system/org",
        component: featuresSystemOrg,
        meta:
        {
            code: PermissionCode.SYSTEM_ORG
        }
    },
    {
        name: "features-system-role",
        path: "/features/system/role",
        component: featuresSystemRole,
        meta:
        {
            code: PermissionCode.SYSTEM_ROLE
        }
    },
    {
        name: "features-system-config",
        path: "/features/system/config",
        component: featuresSystemConfig,
        meta:
        {
            code: PermissionCode.SYSTEM_CONFIG
        }
    },
    {
        name: "features-system-special-standard",
        path: "/features/system/special/standard",
        component: featuresSystemSpecialStandard,
        meta:
        {
            code: PermissionCode.SYSTEM_STANDARD
        }
    },
    {
        name: "features-system-special-customer",
        path: "/features/system/special/customer",
        component: featuresSystemSpecialCustomer,
        meta:
        {
            code: PermissionCode.SYSTEM_CUSTOMER
        }
    }
];

export default children;
