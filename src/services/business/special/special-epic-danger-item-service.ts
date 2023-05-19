import { IHttpRequest, IHttpResponse, SpecialDanger } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 体系危大工程项服务
 * @service
 */
@Injectable()
export default class SpecialEpicDangerItemService extends ServiceBase
{
    /**
     * 获取危大工程项列表
     * @param dangerId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/sys/special/danger/item/list", schema: "/serverApi"})
    public async query(dangerId: number)
    {
        const res = await this.request({params: {dangerId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/special/danger/item/save", schema: "/serverApi"})
    public async insert(data: any)
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

    @httpConfig({method: "PUT", url: "/sys/special/danger/item/updateById", schema: "/serverApi"})
    public async update(data: any)
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

    @httpConfig({method: "PUT", url: "/sys/special/danger/item/updateById", schema: "/serverApi"})
    public async delete(id: number, itemId: number)
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: id
                },
                paramExt:
                {
                    deleteIds: [itemId]
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/special/danger/item/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
