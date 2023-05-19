
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class ToolsService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/tools/instruments/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/tools/instruments/listDetails", schema: "/serverApi"})
    public async listDetails(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        return res.content;
    }

    @httpConfig({method: "GET",url: "/tools/instruments/list", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    @httpConfig({method: "POST",url: "/tools/instruments/getLyghjl", schema: "/serverApi"})
    public async getLyghjl(req: any): Promise<IHttpResponse>
    {
        const res = await this.request(
        {
            serializeType: "application/x-www-form-urlencoded",
            // "content-type": "application/x-www-form-urlencoded",
            data: req
        });
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/tools/instruments/getDetailById", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/tools/instruments/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/tools/instruments/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/tools/instruments/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 
     * @param req 领用
     * @returns 
     */
    @httpConfig({method: "POST", url: "/tools/return/record/addReceive", schema: "/serverApi"})
    public async addReceive(data): Promise<IHttpResponse>
    {
        const res = await this.request({serializeType: "application/x-www-form-urlencoded", data});
        return res;
    }

    /**
     * 
     * @param req 归还
     * @returns 
     */
    @httpConfig({method: "POST", url: "/tools/return/record/addReturn", schema: "/serverApi"})
    public async addReturn(data): Promise<IHttpResponse>
    {
        const res = await this.request({serializeType: "application/x-www-form-urlencoded", data});
        return res;
    }
    /**
     * 
     * @param req 导出Excel
     * @returns 
     */
    @httpConfig({method: "POST", url: "/tools/instruments/exportExcel", schema: "/serverApi"})
    public async exportExcel(data): Promise<IHttpResponse>
    {
        const res = await this.request({serializeType: "application/x-www-form-urlencoded", data});
        return res;
    }
    /**
     * 
     * @param req 导出Excel
     * @returns 
     */
    @httpConfig({method: "UPLOAD", url: "/tools/instruments/uploadTools", schema: "/serverApi"})
    public async uploadTools(files): Promise<IHttpResponse>
    {
        const res = await this.request({files});
        return res;
    }
}
