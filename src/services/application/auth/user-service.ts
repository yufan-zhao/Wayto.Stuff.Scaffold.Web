import { Injectable, BroadcastManager, Broadcast, Map, Logger } from "uxmid-core";
import { httpConfig } from "src/common/http";
import ServiceBase from "../../service-base";
import type { IHttpResponse, IHttpRequest, LoginBroadcastMapKeys } from "src/models";
import { BroadcastChannels } from "src/broadcasts";
import { ExtendUtils } from "src/common/utils";

@Injectable()
export default class UserService extends ServiceBase
{
    @httpConfig({method: "PUT", url: "/user/updatePassword", schema: "/serverApi"})
    public async editCurrentUserPassword(newPwd: string, oldPwd: string): Promise<IHttpResponse>
    {
        const res = await this.request({
            params:
            {
                newPassword: newPwd,
                oldPassword: oldPwd
            }
        });
        return res;
    }
}
