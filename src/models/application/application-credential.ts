import { ICredential } from "uxmid-core";

/**
 * 登录广播信息
 * @type credentialId 凭证
 * @type userId 登录用户id
 * @type realname 登录用户名字
 * @type mobile 登录用户手机号
 * @type avatarUrl 登录用户头像url地址
 */
type LoginBroadcastMapKeys = "credentialId" | "userId" | "realname" | "mobile" | "avatarUrl";

/**
 * 表示一个凭证。
 * @interface
 */
export default interface IApplicationCredential extends ICredential
{
    token?: string;

    /**
     * 当前token获取时的毫秒数
     */
    tokenTime?: number;

    /**
     * 用户对象
     */
    user?: any;
}

export
{
    LoginBroadcastMapKeys
};
