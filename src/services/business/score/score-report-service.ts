import { IHttpRequest, IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 补充报告
 * @service
 */
@Injectable()
export default class ScoreReportService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/supplementary/report/listDetails", schema: "/serverApi"})
    public async query(consultPlanId: number)
    {
        const res = await this.request({params: {consultPlanId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/supplementary/report/save", schema: "/serverApi"})
    public async insert(data: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(data);
        return res;
    }

    @httpConfig({method: "PUT", url: "/supplementary/report/updateById", schema: "/serverApi"})
    public async update(data: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(data);
        return res;
    }

    @httpConfig({method: "PUT", url: "/supplementary/report/updateById", schema: "/serverApi"})
    public async delete(id: number, itemId: number, riskDetails: Array<any>, isRisk: boolean): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id,
                    isRisk
                },
                paramExt:
                {
                    // deleteIds: [itemId],
                    riskDetails: riskDetails.filter(item =>
                    {
                        return item.id !== itemId;
                    })
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/supplementary/report/virtualRemoveById", schema: "/serverApi"})
    public async deleteById(itemId: number)
    {
        const res = await this.request({
            params:
            {
                id: itemId
            }
        });
        return res;
    }
}
