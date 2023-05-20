import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class RoleTemplateService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/roleTemplate/listDefaultTemplateRole", schema: "/serverApi"})
    public async queryDefaultRoleTemplate()
    {
        const res = await this.request({});
        return res;
    }
}
