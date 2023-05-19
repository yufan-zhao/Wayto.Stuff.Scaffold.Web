
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class HiddenService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/publicity/imple/meet/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/publicity/imple/meet/listDetails", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    /**
     * 获取问题隐患等级统计
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/publicity/imple/meet/getDangerStats", schema: "/serverApi"})
    public async getDangerStats(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    @httpConfig({method: "POST",url: "/publicity/imple/meet/exportUser", schema: "/serverApi"})
    public async exportUser(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({data: req});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/publicity/imple/meet/getDetailById", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/publicity/imple/meet/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/publicity/imple/meet/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/publicity/imple/meet/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

}
