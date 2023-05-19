
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class ProjectService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/project/file/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/file/listDetails", schema: "/serverApi"})
    public async listDetails(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/file/list", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/file/getProjectFileListById", schema: "/serverApi"})
    public async getProjectFileListById(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    /**
     * 人员资料库分页
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/project/file/page", schema: "/serverApi"})
    public async dataPage(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "POST",url: "/project/file/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/file/getDetailById", schema: "/serverApi"})
    public async detail(req: IHttpRequest): Promise<IHttpResponse>
    {
        
        const res = await this.request({data: req});
        
        return res;
    }

    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/project/file/save", schema: "/serverApi"})
    public async insert(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(req);
        return res;
    }

    /**
     * 
     * @param req 编辑
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/project/file/updateById", schema: "/serverApi"})
    public async update(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(req);
        return res;
    }

    /**
     * 
     * @param req 删除
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/project/file/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 
     * @param 获取诊治信息 删除
     * @returns 
     */
    @httpConfig({method: "GET", url: "/project/file/getProjectConsultList", schema: "/serverApi"})
    public async getProjectConsultList(projectId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {projectId}});
        return res.content;
    }
}
