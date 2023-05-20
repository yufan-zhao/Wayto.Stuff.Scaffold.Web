
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class ConstructService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/constructiondept/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/constructiondept/listDetails", schema: "/serverApi"})
    public async list(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res;
    }

    /**
     * 人员资料库分页
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/constructiondept/page", schema: "/serverApi"})
    public async dataPage(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "POST",url: "/constructiondept/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/constructiondept/getDetailById", schema: "/serverApi"})
    public async detail(req: IHttpRequest): Promise<IHttpResponse>
    {
        
        const res = await this.request({data: req});
        
        return res;
    }

    // 整改记录详情
    @httpConfig({method: "GET",url: "/constructiondept/getCorrectionRecordDetails", schema: "/serverApi"})
    public async getCorrectionRecordDetails(data: any): Promise<IHttpResponse>
    {
        
        const res = await this.request({data});
        
        return res.content;
    }

    // 整改记录详情统计
    @httpConfig({method: "GET",url: "/constructiondept/getCorrectionRecordTj", schema: "/serverApi"})
    public async getCorrectionRecordTj(data: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    /**
     * 
     * @param req 新增
     * @returns 
     */
    @httpConfig({method: "POST", url: "/constructiondept/save", schema: "/serverApi"})
    public async save(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        return res;
    }

    /**
     * 
     * @param req 编辑
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/constructiondept/updateById", schema: "/serverApi"})
    public async updateById(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        return res;
    }

    /**
     * 
     * @param req 删除
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/constructiondept/virtualRemoveById", schema: "/serverApi"})
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

}
