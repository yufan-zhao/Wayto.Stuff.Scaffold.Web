import type { IHttpRequest, IHttpResponse, SpecialDanger } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class SpecialDangerService extends ServiceBase
{
    /**
     * 根据指定的体系树节点id获取指定的隐患列表
     * @param specialNodeId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/specialCheck/listDetails", schema: "/serverApi"})
    public async getSpecialDangersBySpecialNodeId(specialId: number)
    {
        const results: Array<SpecialDanger> = [];
        const res = await this.request({params: {specialId: specialId}});
        res.content.forEach((item: any) =>
        {
            results.push({
                id: item.id,
                specialNodeId: specialId,
                dangerLevels: item.hazardIds.split(",").map((item: string) => Number(item)),
                dangerLevelAlias: item.hazardName,
                content: item.standard,
                enable: item.enable,
                tag: Boolean(item.tag)
            });
        });
        return results;
    }

    /**
     * 新增体系隐患
     * @param data 
     */
    @httpConfig({method: "POST", url: "/specialCheck/save", schema: "/serverApi"})
    public async insert(data: SpecialDanger): Promise<IHttpResponse>
    {
        const requestData: IHttpRequest =
        {
            data:
            {
                param:
                {
                    enable: data.enable,
                    hazardIds: data.dangerLevels.join(","),
                    specialId: data.specialNodeId,
                    standard: data.content,
                    tag: data.tag ? 1 : 0
                }
            }
        };
        const res = await this.request(requestData);
        return res;
    }

    @httpConfig({method: "PUT", url: "/specialCheck/updateById", schema: "/serverApi"})
    public async update(data: SpecialDanger)
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: data.id,
                    enable: data.enable,
                    hazardIds: data.dangerLevels.join(","),
                    specialId: data.specialNodeId,
                    standard: data.content,
                    tag: data.tag ? 1 : 0
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/specialCheck/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
