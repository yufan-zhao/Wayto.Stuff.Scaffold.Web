
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class KnowledgeService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/knowledge/system/pageDetails", schema: "/serverApi"})
    public async pagintrain(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 1; // 安全培训
        let filtersdata =
        {
            data:
            {
                knowledgeType: 1,
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/pageDetails", schema: "/serverApi"})
    public async paginatlas(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 2; // 标准图集
        let filtersdata =
        {
            data:
            {
                knowledgeType: 2,
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/pageDetails", schema: "/serverApi"})
    public async pagincase(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 3; // 优秀案例
        let filtersdata =
        {
            data:
            {
                knowledgeType: 3,
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/pageDetails", schema: "/serverApi"})
    public async paginservice(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 4; // 安全服务
        let filtersdata =
        {
            data:
            {
                knowledgeType: 4,
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/pageDetails", schema: "/serverApi"})
    public async paginKnow(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        // filters.data.knowledgeType = 4; // 安全服务
        let filtersdata =
        {
            data:
            {
                knowledgeType: 5,
                ...filters.data,
                ...filters.params
            }
        };
        const res = await this.request(filtersdata);
        
        return res;
    }
    @httpConfig({method: "GET",url: "/knowledge/system/listDetails", schema: "/serverApi"})
    public async listDetails(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/list", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/knowledge/system/getDetailById", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/knowledge/system/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/knowledge/system/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/knowledge/system/virtualRemoveById", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/knowledge/system/updateLookNumbr", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/knowledge/system/updateLike", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/knowledge/system/updateFollow", schema: "/serverApi"})
    public async updateFollow(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
}
