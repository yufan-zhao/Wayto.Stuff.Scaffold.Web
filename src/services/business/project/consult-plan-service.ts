
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";
import { PermissionCode } from "src/enums";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class ConsultPlanService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/consultPlan/pageDetails", schema: "/serverApi"})
    public async paginIncomplement(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        let data = {
            ...filters.data,
            ...filters.params,
            status: 0,
            menuCode: PermissionCode.DATA_ZZJH
        };
        const res = await this.request({data});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/pageDetails", schema: "/serverApi"})
    public async paginComplement(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        let data = {
            ...filters.data,
            ...filters.params,
            status: 2,
            menuCode: PermissionCode.DATA_ZZJH
        };
        filters.data.status = 2;
        const res = await this.request({data});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/pageDetails", schema: "/serverApi"})
    public async paginRecify(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        let data = {
            ...filters.data,
            ...filters.params,
            status: 2,
            menuCode: PermissionCode.DATA_YHZG
        };
        const res = await this.request({data});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/pageDetails", schema: "/serverApi"})
    public async paginReport(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        let data = {
            ...filters.data,
            ...filters.params,
            status: 1,
            notarizeStatus: 0,
            menuCode: PermissionCode.DATA_ZZBG
        };
        const res = await this.request({data});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/diagnosisReportSearch", schema: "/serverApi"})
    public async listReport(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        let data = {
            ...filters,
            // ...filters.params,
            status: 1,
            notarizeStatus: 0
        };
        const res = await this.request({data});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/consultPlan/listDetails", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        console.log(res.content);
        
        return res;
    }

    /**
     * 人员资料库分页
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/consultPlan/page", schema: "/serverApi"})
    public async dataPage(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        console.log(res.content);
        
        return res;
    }

    @httpConfig({method: "POST",url: "/consultPlan/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        console.log(res.content);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/getDetailById", schema: "/serverApi"})
    public async detail(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    @httpConfig({method: "GET",url: "/consultPlan/getEvaluationOpinionsById", schema: "/serverApi"})
    public async getEvaluationOpinionsById(consultId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {consultId}});
        return res.content;
    }

    @httpConfig({method: "GET",url: "/consultPlan/getFileListByConsultId", schema: "/serverApi"})
    public async getFileListByConsultId(params: any): Promise<IHttpResponse>
    {
        const res = await this.request({params});
        console.log(res);
        
        return res.content;
    }

    /**
     * 
     * @param req 确认报告
     * @returns 
     */
    @httpConfig({method: "GET", url: "/consultPlan/affirmConsultPlan", schema: "/serverApi"})
    public async affirmConsultPlan(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
 
    /**
     * 
     * @param req 确认报告
     * @returns 
     */
    @httpConfig({method: "GET", url: "/consultPlan/goBackNotarizeStatus", schema: "/serverApi"})
    public async goBackNotarizeStatus(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
  
    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/consultPlan/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/consultPlan/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/consultPlan/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 整改意见
     * 
     * @param req 
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/consultPlan/updateEvaluationOpinions", schema: "/serverApi"})
    public async updateEvaluationOpinions(data: number): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }

    /**
     * 开始诊治
     * @param consultId 诊治id
     */
    @httpConfig({method: "GET", url: "/consultPlan/startConsult", schema: "/serverApi"})
    public async startConsult(consultId: number)
    {
        const res = await this.request({params: {consultId}});
        return res;
    }

    /**
     * 导出单个报告
     * @param consultId 诊治id
     */
    @httpConfig({method: "GET", url: "/consultPlan/exportReportWordByConsultId", schema: "/serverApi"})
    public async exportReportWordByConsultId(consultId: number,options)
    {
        const res = await this.request({params: {consultId, options: options.join(",")}});
        return res;
    }

    /**
     * 导出PPT
     * @param consultId 诊治id
     */
    @httpConfig({method: "GET", url: "/consultPlan/exportReportPPTByReportId", schema: "/serverApi"})
    public async exportReportPPTByReportId(reportId: number,options?)
    {
        const res = await this.request({params: {reportId, options}});
        return res;
    }

    /**
     * 导出多个报告
     * @param consultId 诊治id
     */
    @httpConfig({method: "GET", url: "/consultPlan/exportReportByReportIds", schema: "/serverApi"})
    public async exportReportByReportIds(reportIds,options)
    {
        console.log(reportIds,options);
        
        const res = await this.request({serializeType: "application/zip",params: {reportIds: reportIds.join(","), options: options.join(",")}});
        return res;
    }
 
    /**
     * 导出隐患报告
     * @param consultId 诊治id
     */
    @httpConfig({method: "GET", url: "/consultPlan/exportDangerWordByConsultId", schema: "/serverApi"})
    public async exportDangerWordByConsultId(consultId: number,options)
    {
        const res = await this.request({params: {consultId, options: options.join(",")}});
        return res;
    }
     
    /**
     * 批量保存文件列表
     * @param 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/report/file/save", schema: "/serverApi"})
    public async saveBatchProjectFile(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res.content;
    }

    /**
     * 文件列表
     * @param 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/report/file/getFileListByConsultId", schema: "/serverApi"})
    public async getConsultFileListById(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }
    
    /**
     * 删除文件
     * @param 
     * @returns 
     */
    @httpConfig({method: "PUT",url: "/report/file/virtualRemoveById", schema: "/serverApi"})
    public async fileRemoveById(id?: any): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        
        return res;
    }
}
