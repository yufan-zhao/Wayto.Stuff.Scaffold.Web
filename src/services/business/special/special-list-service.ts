import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 体系正负面类型服务
 * @service
 */
@Injectable()
export default class SpecialListService extends ServiceBase
{
    /**
     * 查询侧栏树
     * @param specialTypeId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/sys/specialList/getSpecial", schema: "/serverApi"})
    public async tree(specialTypeId: number, type: boolean = false)
    {
        const res = await this.request({params: {specialTypeId, type: !type}});
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/specialList/save", schema: "/serverApi"})
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

    @httpConfig({method: "PUT", url: "/sys/specialList/updateById", schema: "/serverApi"})
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

    @httpConfig({method: "PUT", url: "/sys/specialList/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
