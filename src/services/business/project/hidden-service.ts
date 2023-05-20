
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class HiddenService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/specialCheckInfo/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/specialCheckInfo/listDetails", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    /**
     * 获取隐患等级统计
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCheckInfo/getHazardByConsultId", schema: "/serverApi"})
    public async getDangerStats(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    /**
     * 根据诊治id 查整改通知
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCheckInfo/getDangerTree", schema: "/serverApi"})
    public async getDangerTree(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return !res.content.msg ? res.content : [];
    }

    /**
     * 隐患统计：获取层级的统计
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCheckInfo/getDangerLevel", schema: "/serverApi"})
    public async getDangerLevel(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return !res.content.msg ? res.content : [];
    }
 
    /**
     * 根据项目id：获取层级的统计
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCheckInfo/getDangerLevelBy", schema: "/serverApi"})
    public async getDangerLevelBy(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        let bool = res.content instanceof Array;
        
        return bool ? res.content : [];
    }

    /**
     * 
     * @param req 根据项目id获取问题隐患等级统计
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCheckInfo/getHazardByProjectId", schema: "/serverApi"})
    public async getDangerStatsBy(data?)
    {
        
        const res = await this.request({data});
        
        return res.content;
    }

    /**
     * 
     * @param req 根据项目id获取隐患详情
     * @returns 
     */
    @httpConfig({method: "GET", url: "/specialCheckInfo/getDangerTreeBy", schema: "/serverApi"})
    public async getDangerTreeBy(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        let bool = res.content instanceof Array;
        
        return bool ? res.content : [];
    }

    /**
     * 
     * @param req 编辑
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialCheckInfo/updateById", schema: "/serverApi"})
    public async update(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        return res;
    }

    /**
     * 
     * @param req 删除
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialCheckInfo/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

}
