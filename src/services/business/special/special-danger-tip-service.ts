import type { IHttpRequest, IHttpResponse, SpecialDanger } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 隐患库服务
 */
@Injectable()
export default class SpecialDangerTipService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/sys/special/check/template/listDetails", schema: "/serverApi"})
    public async query(checkId: number)
    {
        const res = await this.request({params: {checkId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/special/check/template/save", schema: "/serverApi"})
    public async insert(data: any)
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    checkId: data.checkId,
                    enable: data.enable,
                    hazardLevel: data.hazardLevel,
                    questionDescription: data.questionDescription,
                    rectifyDescription: data.rectifyDescription,
                    deduction: Number(data.deduction),
                    checkDay: data.checkDay
                }
            }
        };
        const res = await this.request(req);
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/special/check/template/updateById", schema: "/serverApi"})
    public async update(data: any)
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    id: data.id,
                    checkId: data.checkId,
                    enable: data.enable,
                    hazardLevel: data.hazardLevel,
                    questionDescription: data.questionDescription,
                    rectifyDescription: data.rectifyDescription,
                    deduction: Number(data.deduction),
                    checkDay: data.checkDay
                }
            }
        };
        const res = await this.request(req);
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/special/check/template/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        const req: IHttpRequest =
        {
            params:
            {
                id
            }
        };
        const res = await this.request(req);
        return res;
    }
}
