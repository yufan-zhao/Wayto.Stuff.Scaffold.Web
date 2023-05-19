import { Type } from "uxmid-core";

/**
 * 综合得分规则颜色
 */
enum SPECIAL_RULE_COLOR
{
    /**
     * 绿色
     */
    GREEN = 1,
    /**
     * 蓝色
     */
    BLUE = 2,
    /**
     * 黄色
     */
    YELLOW = 3,
    /**
     * 橙色
     */
    ORANGE = 4,
    /**
     * 红色
     */
    RED = 5,
    /**
     * 青色
     */
    CYAN = 6,
    /**
     * 紫色
     */
    PURPLE= 7
}

Type.setMetadata(SPECIAL_RULE_COLOR,
{
    GREEN:
    {
        alias: "绿色"
    },
    BLUE:
    {
        alias: "蓝色"
    },
    YELLOW:
    {
        alias: "黄色"
    },
    ORANGE:
    {
        alias: "橙色"
    },
    RED:
    {
        alias: "红色"
    },
    CYAN:
    {
        alias: "青色"
    },
    PURPLE:
    {
        alias: "紫色"
    }
});

export default SPECIAL_RULE_COLOR;
