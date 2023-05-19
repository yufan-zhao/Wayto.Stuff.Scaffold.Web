import { Type } from "uxmid-core";

/**
 * 诊治状态
 */
enum CONSULT_STATUS
{
    /**
     * 未诊治
     */
    UNDO = 0,
    /**
     * 诊治中
     */
    DOING = 1,
    /**
     * 已诊治
     */
    DONE = 2
}
Type.setMetadata(CONSULT_STATUS,
{
    UNDO:
    {
        alias: "未诊治"
    },
    DOING:
    {
        alias: "诊治中"
    },
    DONE:
    {
        alias: "已诊治"
    }
});

export default CONSULT_STATUS;
