import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 体系正负面清单项服务
 * @service
 */
@Injectable()
export default class SpecialListItemService extends ServiceBase
{
    /**
     * 获取正面清单项列表
     * @param typeId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/sys/specialListItem/getPlusPoint/{listId}", schema: "/serverApi"})
    public async queryPositiveItemList(typeId: number)
    {
        const res = await this.request({urlPath: {listId: typeId}});
        return res;
    }

    /**
     * 获取负面清单项列表
     * @param typeId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/sys/specialListItem/getMinusPoint/{listId}", schema: "/serverApi"})
    public async queryNegativeItemList(typeId: number)
    {
        const res = await this.request({urlPath: {listId: typeId}});
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/specialListItem/savePlusPoint", schema: "/serverApi"})
    public async insertPositiveItem(data: any)
    {
        const res = await this.request({data: data});
        return res;
    }

    @httpConfig({method: "POST", url: "/sys/specialListItem/saveMinusPoint", schema: "/serverApi"})
    public async insertNegativeItem(data: any)
    {
        const res = await this.request({data: data});
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/specialListItem/updatePlusPoint/{id}", schema: "/serverApi"})
    public async updatePositiveItem(data: any)
    {
        const res = await this.request({data: data, urlPath: {id: data.id}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/specialListItem/updateMinusPoint/{id}", schema: "/serverApi"})
    public async updateNegativeItem(data: any)
    {
        const res = await this.request({data: data, urlPath: {id: data.id}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/sys/specialListItem/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
