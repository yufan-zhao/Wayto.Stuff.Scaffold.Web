
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class ProjectService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/project/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/listDetails", schema: "/serverApi"})
    public async listDetails(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/list", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    // 施工方
    @httpConfig({method: "GET",url: "/project/getConstructionUnitList", schema: "/serverApi"})
    public async getConstructionDeptList(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }
    // 监理单位列表
    @httpConfig({method: "GET",url: "/project/getSupervisingUnitList", schema: "/serverApi"})
    public async getSupervisingUnitList(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    /**
     * 人员资料库分页
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/project/page", schema: "/serverApi"})
    public async dataPage(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "POST",url: "/project/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/project/getDetailById", schema: "/serverApi"})
    public async detail(req: IHttpRequest): Promise<IHttpResponse>
    {
        
        const res = await this.request(req);
        
        return res;
    }

    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/project/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/project/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/project/virtualRemoveById", schema: "/serverApi"})
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
    @httpConfig({method: "GET", url: "/project/getProjectConsultList", schema: "/serverApi"})
    public async getProjectConsultList(projectId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {projectId}});
        return res.content;
    }

    /**
     * 
     * @param 获取诊治信息 删除
     * @returns 
     */
    @httpConfig({method: "GET", url: "/project/getProjectPlanList", schema: "/serverApi"})
    public async getProjectPlanList(projectId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {projectId}});
        return res.content;
    }
    
    /**
     * 批量保存文件列表
     * @param 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/project/file/saveBatchProjectFile", schema: "/serverApi"})
    public async saveBatchProjectFile(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res.content;
    }

    /**
     * 批量导出文件
     * @param 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/project/projectExport", schema: "/serverApi"})
    public async projectExport(projectIds: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: { projectIds }});
        return res.content;
    }

    /**
     * 批量导出文件
     * @param 
     * @returns 
     */
    @httpConfig({method: "UPLOAD", url: "/project/uploadProject", schema: "/serverApi"})
    public async uploadProject(files: any): Promise<IHttpResponse>
    {
        console.log(files);
        
        const res = await this.request({files});
        return res.content;
    }
}
