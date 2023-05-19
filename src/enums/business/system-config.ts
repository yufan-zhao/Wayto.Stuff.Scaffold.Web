import { Type } from "uxmid-core";

/**
 * 系统设置-基础设置枚举
 * @enum
 */
enum SYSTEM_CONFIG_TYPE
{
    /**
     * 项目类型
     */
    PROJECT_TYPE = 1,
    /**
     * 施工阶段
     */
    CONSTRUCTION_STAGE = 2,
    /**
     * 隐患类型
     */
    HAZARD_TYPE = 3,
    /**
     * 问题隐患等级
     */
    HAZARD_LEVEL = 4,
    /**
     * 工具类型
     */
    TOOL_TYPE = 5,
    /**
     * 工具存放地
     */
    TOOL_CRIB = 6,
    /**
     * 标准图集类型
     */
    STANDARD_ATLAS_TYPE = 7,
    /**
     * 安全培训类型
     */
    SAFETY_TRAINING = 8,
    /**
     * 组名设置
     */
    GROUP_NAME = 9,
    /**
     * 诊治类型
     */
    DIAGNOSIS_TYPE = 10,
    /**
     * 合同类型
     */
    CONTRACT_TYPE = 11,
    /**
     * 行政区域
     */
    AD_AREA = 12,
    /**
     * 履职职位
     */
    POSITION_SETTING = 13
}
Type.setMetadata(SYSTEM_CONFIG_TYPE,
{
    PROJECT_TYPE:
    {
        alias: "项目类型"
    },
    CONSTRUCTION_STAGE:
    {
        alias: "施工阶段"
    },
    HAZARD_TYPE:
    {
        alias: "隐患类型"
    },
    HAZARD_LEVEL:
    {
        alias: "问题隐患等级"
    },
    TOOL_TYPE:
    {
        alias: "工具类型"
    },
    TOOL_CRIB:
    {
        alias: "工具存放地"
    },
    STANDARD_ATLAS_TYPE:
    {
        alias: "标准图集类型"
    },
    SAFETY_TRAINING:
    {
        alias: "安全培训类型"
    },
    GROUP_NAME:
    {
        alias: "组名设置"
    },
    DIAGNOSIS_TYPE:
    {
        alias: "诊治类型"
    },
    CONTRACT_TYPE:
    {
        alias: "合同类型"
    },
    AD_AREA:
    {
        alias: "行政区域"
    },
    POSITION_SETTING:
    {
        alias: "履职职位"
    }
});

export default SYSTEM_CONFIG_TYPE;
