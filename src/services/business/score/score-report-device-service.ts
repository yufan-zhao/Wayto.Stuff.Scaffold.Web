import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 现场主要设备
 * @service
 */
@Injectable()
export default class ScoreReportDeviceService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/supplementary/report/getListDetails", schema: "/serverApi"})
    public async query(consultPlanId: number)
    {
        let res = await this.request({
            params:
            {
                consultPlanId,
                type: 0
            }
        });
        return res;
    }

    @httpConfig({method: "POST", url: "/supplementary/report/saveOrUpdateRiskFacility", schema: "/serverApi"})
    public async insert(consultPlanId: number, content: string)
    {
        let res = await this.request({
            data:
            {
                consultPlanId,
                content,
                type: 0
            }
        });
        return res;
    }

    @httpConfig({method: "POST", url: "/supplementary/report/saveOrUpdateRiskFacility", schema: "/serverApi"})
    public async update(id: number, consultPlanId: number, content: string)
    {
        let res = await this.request({
            data:
            {
                id,
                consultPlanId,
                content,
                type: 0
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/supplementary/report/removeRiskFacilityById", schema: "/serverApi"})
    public async delete(id: number)
    {
        let res = await this.request({
            params: {id}
        });
        return res;
    }
}
