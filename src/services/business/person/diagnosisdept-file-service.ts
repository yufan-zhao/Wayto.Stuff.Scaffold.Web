import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";

import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class DiagnosFileService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/diagnosisDeptFile/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/diagnosisDeptFile/getDiagnosisDeptFileList", schema: "/serverApi"})
    public async list(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request(data);
        
        return res;
    }
    
    // 诊治单位userId查询任务统计
    @httpConfig({method: "GET",url: "/diagnosisDeptFile/getDiagnosedCountByUserId", schema: "/serverApi"})
    public async getDiagnosedCountByUserId(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    @httpConfig({method: "POST",url: "/diagnosisDeptFile/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/diagnosisDeptFile/getDetailById", schema: "/serverApi"})
    public async detail(req: IHttpRequest): Promise<IHttpResponse>
    {
        
        const res = await this.request({data: req});
        console.log(res.content);
        
        return res;
    }

    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/diagnosisDeptFile/save", schema: "/serverApi"})
    public async insert(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        return res;
    }

    /**
     * 
     * @param req 编辑
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/diagnosisDeptFile/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/diagnosisDeptFile/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }
    
    /**
     * 
     * @param req 删除
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/user/resetPassword", schema: "/serverApi"})
    public async resetPsw(data: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(data);
        return res;
    }

    /**
     * 获取诊治组长或者诊治组员（3：组长，2组员）
     * @param req 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/diagnosisDeptFile/getLeaders", schema: "/serverApi"})
    public async getLeaders(data): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        return res;
    }
 
}
