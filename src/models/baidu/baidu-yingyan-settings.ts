/**
 * 百度云服务配置
 */
export default interface IBaiduYingyanSettings
{
    /**
     * 用户的AK，授权使用
     */
    ak: string;
    /**
     * service的ID，service 的唯一标识
     */
    serviceId: number;
    /**
     * 神奇的mcode，百度鹰眼文档上似乎只有ios sdk才用到，但是不知道是怎么配置的，web端也要用
     */
    mcode: string;
    /**
     * 用户的权限签名，若用户所用AK的校验方式为SN校验时该参数必须。
     * @see https://lbsyun.baidu.com/index.php?title=webapi/appendix#service-page-anchor2
     */
    sn?: string;
}
