import { Injectable, BroadcastManager, Broadcast, Map, Logger } from "uxmid-core";
import { httpConfig } from "src/common/http";
import ServiceBase from "../../service-base";
import type { IHttpResponse, IHttpRequest, LoginBroadcastMapKeys } from "src/models";
import { BroadcastChannels } from "src/broadcasts";
import { ExtendUtils } from "src/common/utils";

@Injectable()
export default class AuthService extends ServiceBase
{
    /**
     * 登录
     * @public
     * @async
     * @param username
     * @param password
     * @param isVerifyCode 是否需要验证码，默认为false
     * @param verifyCodeId 图形验证码id
     * @param verifyCode 图形验证码值
     * @returns {Promise<void>}
     */
    @httpConfig({method: "POST", url: "/oauth/token", schema: "/serverApi"})
    public async login(username: string, password: string, isVerifyCode: boolean = false, verifyCodeId?: string, verifyCode?: string): Promise<void>
    {
        // 登录之前清空上次的凭证
        this.applicationContext.credential = null;
        const loginReq: IHttpRequest =
        {
            serializeType: "application/x-www-form-urlencoded",
            data:
            {
                client_id: "oauth-client-id",
                client_secret: "oauth-client-secret",
                grant_type: "password",
                terminal: "web",
                username,
                password,
                isVerifyCode,
                verifyCodeId,
                verifyCode
            }
        };

        try
        {
            Logger.debug("[UserService] login", "请求报文：", loginReq);
            const res = await this.request(loginReq);
            Logger.debug("[UserService] login", "返回报文：", res);

            const broadcastMsg = new Map<LoginBroadcastMapKeys, string>();
            broadcastMsg.set("credentialId", res.content.access_token);
            broadcastMsg.set("userId", res.content.user.userId);
            broadcastMsg.set("realname", res.content.user.name);
            broadcastMsg.set("mobile", res.content.user.mobile);
            broadcastMsg.set("avatarUrl", res.content.user.headImgUrl);
            const loginMessage = new Broadcast(BroadcastChannels.LOGIN, broadcastMsg);
            BroadcastManager.instance.send(loginMessage); // !! 重要：保存用户凭据至上下文中
        }
        catch(err)
        {
            // return err.msg || "服务器异常";
            throw new Error(err.msg || "服务器异常");
        }
    }

    /**
     * 获取图形验证码
     * @public
     * @async
     * @returns {Promise<IHttpResponse>}
     */
    @httpConfig({method: "GET", url: "/free/getVerifyImg", schema: "/serverApi"})
    public async getVerifyImg(width?: number, height?: number): Promise<{verifyCodeId: string; blobUrl: string}>
    {
        let verifyCodeId = ExtendUtils.uuid();
        const { content } = await this.request({
            params:
            {
                verifyCodeId: verifyCodeId,
                width,
                height
            },
            responseType: "blob"
        });
        const blobUrl = window.URL.createObjectURL(content);
        return {blobUrl, verifyCodeId};
    }

    /**
     * 校验token是否有效
     * @param token 
     */
    @httpConfig({method: "POST", url: "/oauth/check_token", schema: "/serverApi"})
    public async checkToken(token: string): Promise<boolean>
    {
        try
        {
            const res = await this.request({
                params:
                {
                    "token": token
                }
            });
            const refreshMsg = new Broadcast(BroadcastChannels.REFRESH, null);
            BroadcastManager.instance.send(refreshMsg);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }

    /**
     * 获取手机验证码
     * @deprecated
     * @public
     * @param {object} params
     * @returns {Promise<IHttpResponse>}
     */
    @httpConfig({method: "GET", url: "/findPwdMsgCode", schema: "/serverApi"})
    public async findPwdMsgCode(params): Promise<IHttpResponse>
    {
        const { username: userName, mobile } = params;
        const res = await this.request({
            urlPath:
            {
                userName,
                mobile
            }
        });
        return res;
    }

    /**
     * 找回密码
     * @deprecated
     * @public
     * @param {object} params
     * @returns {Promise<IHttpResponse>}
     */
    @httpConfig({method: "GET", url: "/findPassword", schema: "/serverApi"})
    public async findPassword(params): Promise<IHttpResponse>
    {
        const res = await this.request({
            data: params
        });
        return res;
    }
}
