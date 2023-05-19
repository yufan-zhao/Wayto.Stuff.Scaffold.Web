import { IApplicationMenu } from "src/models";
import { PermissionCode } from "src/enums";

const menus: Array<IApplicationMenu> =
[
    // {
    //     label: "报表统计",
    //     routeName: "workbench-statistic",
    //     icon: "icon-icon_gjbb",
    //     iconColor: "#45c7a0",
    //     hideTab: true
    // },
    {
        label: "驾驶舱",
        routeName: "workbench-index",
        icon: "icon-icon_gjbb",
        iconColor: "#45c7a0",
        hideTab: true,
        code: PermissionCode.BBTJ
    },
    {
        label: "项目诊治",
        code: [PermissionCode.PROJECT, PermissionCode.PLAN, PermissionCode.REPORT, PermissionCode.RECTIFY],
        children:
        [
            {
                label: "项目管理",
                icon: "icon-icon_gzt",
                iconColor: "#6d89ea",
                code: PermissionCode.PROJECT,
                tabChildren:
                [
                    {
                        label: "项目管理",
                        routeName: "project-manage",
                        code: PermissionCode.PROJECT
                    }
                ]
            },
            {
                label: "诊治计划",
                icon: "icon-icon_zhenzhijihua",
                iconColor: "#f2ba66",
                code: PermissionCode.PLAN,
                tabChildren:
                [
                    {
                        label: "诊治日历",
                        routeName: "project-plan-calendar",
                        code: PermissionCode.PLAN_CALENDAR
                    },
                    {
                        label: "未诊治",
                        routeName: "project-plan-incomplete",
                        code: PermissionCode.PLAN_INCOMPLETE
                    },
                    {
                        label: "已诊治",
                        routeName: "project-plan-complete",
                        code: PermissionCode.PLAN_COMPLETE
                    }
                ]
            },
            {
                label: "诊治报告",
                icon: "icon-icon_zhenzhibaogao",
                iconColor: "#47c89f",
                code: PermissionCode.REPORT,
                tabChildren:
                [
                    {
                        label: "诊治报告",
                        routeName: "project-report",
                        code: PermissionCode.REPORT
                    }
                ]
            },
            {
                label: "隐患整改",
                icon: "icon-icon_yinhuanzhenggai",
                iconColor: "#ff7374",
                code: PermissionCode.RECTIFY,
                tabChildren:
                [
                    {
                        label: "隐患整改",
                        routeName: "project-rectify",
                        code: PermissionCode.RECTIFY
                    }
                ]
            }
        ]
    },
    {
        label: "用户管理",
        code: [PermissionCode.USER_RECTIFY, PermissionCode.USER_CONSTRUCTION, PermissionCode.USER_OWNER],
        children:
        [
            {
                label: "诊治单位",
                icon: "icon-icon_zhenzhidanwei",
                iconColor: "#4d84e8",
                code: PermissionCode.USER_RECTIFY,
                tabChildren:
                [
                    {
                        label: "诊治单位",
                        routeName: "user-rectify",
                        code: PermissionCode.USER_RECTIFY
                    }
                ]
            },
            {
                label: "施工单位",
                icon: "icon-icon_shigongdanwei",
                iconColor: "#19c3e4",
                code: PermissionCode.USER_CONSTRUCTION,
                tabChildren:
                [
                    {
                        label: "施工单位",
                        routeName: "user-construction",
                        code: PermissionCode.USER_CONSTRUCTION
                    }
                ]
            },
            {
                label: "业主单位",
                icon: "icon-icon_yezhudanwei",
                iconColor: "#ff9a31",
                code: PermissionCode.USER_OWNER,
                tabChildren:
                [
                    {
                        label: "业主单位",
                        routeName: "user-owner",
                        code: PermissionCode.USER_OWNER
                    }
                ]
            }
        ]
    },
    {
        label: "其他功能",
        code: [PermissionCode.TOOL, PermissionCode.KNOWLEDGE, PermissionCode.SUGGESTION, PermissionCode.SYSTEM],
        children:
        [
            {
                label: "工器具管理",
                icon: "icon-icon_gongqijuguanli",
                iconColor: "#6d89ea",
                code: PermissionCode.TOOL,
                tabChildren:
                [
                    {
                        label: "工器具管理",
                        routeName: "features-tool",
                        code: PermissionCode.TOOL
                    }
                ]
            },
            {
                label: "知识体系",
                icon: "icon-icon_zhishitixi",
                iconColor: "#45c7a0",
                code: PermissionCode.KNOWLEDGE,
                tabChildren:
                [
                    {
                        label: "安全培训",
                        routeName: "features-knowledge-train",
                        code: PermissionCode.KNOWLEDGE_TRAIN
                    },
                    {
                        label: "标准图集",
                        routeName: "features-knowledge-atlas",
                        code: PermissionCode.KNOWLEDGE_ATLAS
                    },
                    {
                        label: "优秀案例",
                        routeName: "features-knowledge-case",
                        code: PermissionCode.KNOWLEDGE_CASE
                    },
                    {
                        label: "安全服务",
                        routeName: "features-knowledge-service",
                        code: PermissionCode.KNOWLEDGE_SERVICE
                    },
                    {
                        label: "安全知识",
                        routeName: "features-knowledge-know"
                        // code: PermissionCode.KNOWLEDGE_SERVICE_ZS
                    },
                    {
                        label: "安全日历",
                        routeName: "features-knowledge-daily"
                        // code: PermissionCode.KNOWLEDGE_SERVICE_RL
                    }
                ]
            },
            {
                label: "意见建议",
                icon: "icon-icon_yijianjianyi",
                iconColor: "#ff9832",
                code: PermissionCode.SUGGESTION,
                tabChildren:
                [
                    {
                        label: "意见建议",
                        routeName: "features-suggestion",
                        code: PermissionCode.SUGGESTION
                    }
                ]
            },
            {
                label: "系统设置",
                icon: "icon-icon_xitongshezhi",
                iconColor: "#4d6987",
                code: PermissionCode.SYSTEM,
                tabChildren:
                [
                    {
                        label: "组织架构",
                        routeName: "features-system-org",
                        code: PermissionCode.SYSTEM_ORG
                    },
                    {
                        label: "角色权限",
                        routeName: "features-system-role",
                        code: PermissionCode.SYSTEM_ROLE
                    },
                    {
                        label: "基础设置",
                        routeName: "features-system-config",
                        code: PermissionCode.SYSTEM_CONFIG
                    },
                    {
                        label: "标准体系",
                        routeName: "features-system-special-standard",
                        code: PermissionCode.SYSTEM_STANDARD
                    },
                    {
                        label: "客户体系",
                        routeName: "features-system-special-customer",
                        code: PermissionCode.SYSTEM_CUSTOMER
                    }
                ]
            }
        ]
    }
];

export default menus;
