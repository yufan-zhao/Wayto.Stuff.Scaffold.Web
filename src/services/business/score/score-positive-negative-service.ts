import { IHttpRequest, IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class ScorePositiveNegativeService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/sys/specialList/getPlusSpecialListDetails", schema: "/serverApi"})
    public async getPlusSpecialListDetails(consultId: number, specialTypeId: number)
    {
        const res = await this.request({
            params:
            {
                consultId,
                specialTypeId
            }
        });
        return res;
    }

    /**
     * 减分项详情：获取整改详情统计
     * @param consultId 
     */
    @httpConfig({method: "GET", url: "/consultPlan/getItemInfoMendsStats/{consultId}/{specialTypeId}" , schema: "/serverApi"})
    public async getItemInfoMendsStats(consultId: number, specialTypeId: number)
    {
        const res = await this.request({
            urlPath:
            {
                consultId,
                specialTypeId
            }
        });
        return res;
    }

    /**
     * 减分项详情：获取整改详情集合
     * @param consultId 
     * @param mendStatus 
     */
    @httpConfig({method: "GET", url: "/consultPlan/getItemInfoMendsAll/{consultId}/{specialTypeId}" , schema: "/serverApi"})
    public async getItemInfoMends(consultId: number, specialTypeId?: number)
    {
        const res = await this.request({
            urlPath:
            {
                consultId: consultId,
                specialTypeId
            }
        });
        return res;
    }
}
