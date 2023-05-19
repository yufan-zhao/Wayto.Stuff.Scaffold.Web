import { IBroadcastReceiver, BroadcastContext, Receivable, Map } from "uxmid-core";
import dayjs from "dayjs";

import BroadcastChannels from "./channels";
import { ApplicationContext } from "src/application";
import { menus } from "src/routes";
import { IApplicationCredential, LoginBroadcastMapKeys, Events } from "src/models";
import { PermissionService } from "src/services";
import { RouteUtils } from "src/common/utils";

@Receivable(BroadcastChannels.LOGOUT)
@Receivable(BroadcastChannels.LOGIN)
@Receivable(BroadcastChannels.REFRESH)
@Receivable(BroadcastChannels.UPDATE_PASSWORD)
@Receivable(BroadcastChannels.PERMISSION)
export default class UserMessageReceiver implements IBroadcastReceiver
{
    /**
     * 当接收到广播时调用的方法。
     * @param  {BroadcastContext} context 广播上下文实例。
     * @returns {void} void
     */
    public async receive(context: BroadcastContext): Promise<void>
    {
        switch(context.uri)
        {
            case BroadcastChannels.LOGOUT:
            {
                // 释放系统凭据
                ApplicationContext.current.credential = null;

                // 清空登录权限码
                ApplicationContext.current.permissionCodes = [];

                // 跳转登录页
                if (ApplicationContext.current.router)
                {
                    ApplicationContext.current.router.replace("/login");
                }
                break;
            }
            case BroadcastChannels.UPDATE_PASSWORD:
            {
                ApplicationContext.current.eventProvider.dispatchEvent(Events.ON_UPDATE_PASSWORD, null);
                break;
            }
            case BroadcastChannels.REFRESH:
            {
                // 更新当前token时间
                let currentCredential: IApplicationCredential = ApplicationContext.current.credential;
                currentCredential.tokenTime = dayjs().valueOf();
                // console.log("更新token时间", currentCredential);
                ApplicationContext.current.credential = currentCredential;
                break;
            }
            case BroadcastChannels.PERMISSION:
            {
                const permissionService = ApplicationContext.current.serviceFactory.default.resolve<PermissionService>(PermissionService);
                await permissionService.getMenu();
                break;
            }
            case BroadcastChannels.LOGIN:
            {
                // 获取登录信息
                const extras = <Map<LoginBroadcastMapKeys, string>>context.extras;
                // const { access_token: credentialId, user } = extras.get("loginRes");
                const credentialId = extras.get("credentialId");
                const userId = extras.get("userId");
                const realname = extras.get("realname");
                const mobile = extras.get("mobile");
                const avatarUrl = extras.get("avatarUrl");

                // !! 生成凭据，并保存至上下文中
                const userProfile: any =
                {
                    id: userId,
                    username: "",
                    realname: realname,
                    mobile: mobile,
                    orgId: "",
                    filePath: avatarUrl
                };
                const credential: IApplicationCredential =
                {
                    userId: userId,
                    credentialId: credentialId,
                    user: userProfile,
                    tokenTime: dayjs().valueOf()
                };
                ApplicationContext.current.credential = credential;

                const permissionService = ApplicationContext.current.serviceFactory.default.resolve<PermissionService>(PermissionService);
                await permissionService.getMenu();

                let filteredMenus = RouteUtils.loadMenus(menus, ApplicationContext.current.permissionCodes);
                ApplicationContext.current.menus = filteredMenus;

                ApplicationContext.current.router.push("/");
                break;
            }
        }
    }
}
