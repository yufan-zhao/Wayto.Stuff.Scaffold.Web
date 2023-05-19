import { Type } from "uxmid-core";

/**
 * 分值类型
 */
enum SPECIAL_RULE_TYPE
{
    /**
     * 其他
     */
    OTHER = 0,
    /**
     * 监理
     */
    SUPERVISOR = 1,
    /**
     * 施工
     */
    CONSTRUCTOR = 2,
    /**
     * 代建单位
     */
    CONSTRUCTION_UNIT = 3
}

Type.setMetadata(SPECIAL_RULE_TYPE,
{
    OTHER:
    {
        alias: "其他"
    },
    SUPERVISOR:
    {
        alias: "监理"
    },
    CONSTRUCTOR:
    {
        alias: "施工"
    },
    CONSTRUCTION_UNIT:
    {
        alias: "代建单位"
    }
});

export default SPECIAL_RULE_TYPE;
