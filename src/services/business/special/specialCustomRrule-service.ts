
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class SpecialCustomRruleService extends ServiceBase
{

    /**
     * 获取自定义得分详情
     * @param consultId specialTypeId 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCustomRule/getCustomRuleScore", schema: "/serverApi"})
    public async getCustomRuleScore(data?: any): Promise<Array<any>>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    /**
     * 根据诊治id 查整改通知
     * @param filters 
     * @returns 
     */
    @httpConfig({method: "GET",url: "/specialCustomRrule/getDangerTree", schema: "/serverApi"})
    public async getDangerTree(data?): Promise<IHttpResponse>
    {
        const res = await this.request({data});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/specialCustomRrule/getDetailById", schema: "/serverApi"})
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
    @httpConfig({method: "POST", url: "/specialCustomRrule/save", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/specialCustomRrule/updateById", schema: "/serverApi"})
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
    @httpConfig({method: "PUT", url: "/specialCustomRrule/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

}
