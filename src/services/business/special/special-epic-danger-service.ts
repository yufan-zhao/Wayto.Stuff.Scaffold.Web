import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 体系危大工程类别服务
 * @service
 */
@Injectable()
export default class SpecialEpicDangerService extends ServiceBase
{
    @httpConfig({method: "GET", url: "/sys/special/danger/getSpecialDangerList/{specialTypeId}", schema: "/serverApi"})
    public async getSpecialDangerList(specialTypeId: number)
    {
        let res = await this.request({
            urlPath:
            {
                specialTypeId
            }
        });
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/special/danger/save", schema: "/serverApi"})
    public async save(data: {name: string; specialTypeId: number; type: boolean})
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

    @httpConfig({method: "PUT", url: "/sys/special/danger/updateById", schema: "/serverApi"})
    public async updateById(data: {id: number; name: string; specialTypeId: number})
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

    @httpConfig({method: "PUT", url: "/sys/special/danger/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
