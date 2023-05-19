import { IHttpRequest, IHttpResponse, SpecialDanger } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class SpecialColorService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/color/setting/listDetails", schema: "/serverApi"})
    public async query()
    {
        let res = await this.request({});
        return res;
    }

    @httpConfig({method: "POST", url: "/color/setting/save", schema: "/serverApi"})
    public async insert(data: any)
    {
        let res = await this.request({
            data: data
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/color/setting/updateById", schema: "/serverApi"})
    public async update(data: any)
    {
        let res = await this.request({
            data: data
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/color/setting/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        let res = await this.request({
            params:
            {
                id
            }
        });
        return res;
    }
}
