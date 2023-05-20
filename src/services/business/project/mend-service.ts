
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class HiddenService extends ServiceBase
{
    // 整改回复表
    @httpConfig({method: "GET",url: "/mend/info/pageDetails", schema: "/serverApi"})
    public async pagin(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }

    @httpConfig({method: "GET",url: "/mend/info/listDetails", schema: "/serverApi"})
    public async list(filters?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: filters});
        
        return res;
    }
    /**
     * 新增
     * @param req 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/mend/info/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/mend/info/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/mend/info/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

}
