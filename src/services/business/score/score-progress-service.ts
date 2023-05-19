import { IHttpRequest, IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 项目进度
 * @service
 */
@Injectable()
export default class ScoreProgressService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/projectschedule/listDetails", schema: "/serverApi"})
    public async query(consultPlanId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {consultPlanId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/projectschedule/save", schema: "/serverApi"})
    public async insert(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    ...data
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/projectschedule/updateById", schema: "/serverApi"})
    public async update(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    ...data
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/projectschedule/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
