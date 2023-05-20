
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class SafetyService extends ServiceBase
{

    @httpConfig({method: "GET",url: "/safety/knowledge/pageDetails", schema: "/serverApi"})
    public async paginKnow(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 4; // 安全服务
        let filtersdata =
        {
            data:
            {
                
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }
    @httpConfig({method: "GET",url: "/safety/knowledge/listDetails", schema: "/serverApi"})
    public async listDetails(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/safety/knowledge/list", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/safety/knowledge/getDetailById", schema: "/serverApi"})
    public async detail(req: any): Promise<IHttpResponse>
    {
        
        const res = await this.request({data: req});
        
        return res.content;
    }

    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/safety/knowledge/save", schema: "/serverApi"})
    public async insert(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }

    /**
     * 
     * @param req 编辑
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/safety/knowledge/updateById", schema: "/serverApi"})
    public async update(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }

    /**
     * 
     * @param req 删除
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/safety/knowledge/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 查看
     * @param req 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/safety/knowledge/updateLookNumbr", schema: "/serverApi"})
    public async updateLookNumbr(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
     
    /**
     * 点赞
     * @param req
     * @returns 
     */
    @httpConfig({method: "POST", url: "/safety/knowledge/updateLike", schema: "/serverApi"})
    public async updateLike(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
     
    /**
     * 关注
     * @param req 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/safety/knowledge/updateFollow", schema: "/serverApi"})
    public async updateFollow(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }

    @httpConfig({method: "GET", url: "/safety/calendar/listDetails", schema: "/serverApi"})
    public async calendarListDetails(filters?: any)
    {
        const res = await this.request({data: filters});
        return res.content;
    }
}
