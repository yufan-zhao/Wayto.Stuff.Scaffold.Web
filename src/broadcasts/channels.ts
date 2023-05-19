export default class BroadcastChannels
{
    /**
     * 用户登录频道
     * @public
     * @static
     * @readonly
     * @returns {string} 频道名称
     */
    public static readonly LOGIN: string = "application://user/login";

    /**
     * 用户登出频道
     * @public
     * @static
     * @readonly
     * @returns {string} 频道名称
     */
    public static readonly LOGOUT: string = "application://user/logout";

    /**
     * 用户修改密码
     * @public
     * @static
     * @readonly
     * @returns {string} 频道名称
     */
    public static readonly UPDATE_PASSWORD: string = "application://user/update-password";

    /**
     * 用户TOKEN刷新
     * @public
     * @static
     * @readonly
     * @returns {string} 频道名称
     */
    public static readonly REFRESH: string = "application://user/refresh";

    public static readonly PERMISSION: string = "application://user/permission";
}
