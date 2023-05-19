import { IHttpRequest, IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 项目亮点
 * @service
 */
@Injectable()
export default class ScoreHighlightsService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/projecthighlights/listDetails", schema: "/serverApi"})
    public async query(consultPlanId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {consultPlanId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/projecthighlights/save", schema: "/serverApi"})
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

    @httpConfig({method: "PUT", url: "/projecthighlights/updateById", schema: "/serverApi"})
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

    @httpConfig({method: "PUT", url: "/projecthighlights/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
