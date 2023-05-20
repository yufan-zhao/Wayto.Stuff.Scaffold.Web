
import type { IHttpRequest, IHttpResponse, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class WorkbenchService extends ServiceBase
{
    /**
     * 工作台：根据业主单位id获取客户体系类型
     * @param customerId 
     */
    @httpConfig({method: "GET",url: "/specialType/getBeanByCustomerId", schema: "/serverApi"})
    public async getBeanByCustomerId(customerId?: number)
    {
        const res = await this.request({
            params:
            {
                customerId
            }
        });
        return res;
    }

    // 项目列表
    @httpConfig({method: "GET",url: "/project/getProjectMapList", schema: "/serverApi"})
    public async getProjectMapList(customerId?: number): Promise<any>
    {
        const res = await this.request({
            params:
            {
                customerId
            }
        });
        return res.content;
    }

    // 项目详情
    @httpConfig({method: "GET",url: "/project/getDetailById", schema: "/serverApi"})
    public async getDetailById(id?: any): Promise<IHttpResponse>
    {
        const res = await this.request({data: {id}});
        return res.content;
    }

    // 项目类型统计
    @httpConfig({method: "GET",url: "/project/getProjectTypeStatisticsList", schema: "/serverApi"})
    public async getProjectTypeStatisticsList(filters?: any): Promise<any>
    {
        const res = await this.request({data: filters});
        
        return res.content;
    }

    // 工作台-按闭合情况-统计隐患数量及占比
    @httpConfig({method: "GET",url: "/specialCheckInfo/getWorkbenchHazardCountList", schema: "/serverApi"})
    public async getWorkbenchHazardCountList(req: any): Promise<any>
    {
        
        const res = await this.request({data: req});
        
        return res.content;
    }
   
    // 工作台--获取项目诊治统计
    @httpConfig({method: "GET",url: "/consultPlan/getHiddenDangerWorkbenchList", schema: "/serverApi"})
    public async getHiddenDangerWorkbenchList(req: any): Promise<any>
    {
        
        const res = await this.request(req);
        
        return res.content;
    }

    // 工作台--统计履职在岗离岗情况

    @httpConfig({method: "GET",url: "/performanceofduties/getPerformanceOfDutiesCountByUnit", schema: "/serverApi"})
    public async getPerformanceOfDutiesCountByUnit(req: any): Promise<any>
    {
        
        const res = await this.request({data: req});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/performanceofduties/getPerformanceOfDutiesCountByUnit", schema: "/serverApi"})
    public async getPerformanceOfDutiesCount(req: any)
    {
        const res = await this.request(req);
        
        return res.content;
    }

    // 工作台--业主id获取隐患百分比统计
    @httpConfig({method: "GET",url: "/stat/metadata/getDangerByCustomerDeptId", schema: "/serverApi"})
    public async getDangerByCustomerDeptId(req: any): Promise<any>
    {
        
        const res = await this.request({data: req});
        
        return res.content;
    }

    // 工作台--项目id获取隐患百分比统计
    @httpConfig({method: "GET",url: "/stat/metadata/getDangerByProjectId", schema: "/serverApi"})
    public async getDangerByProjectId(req: any): Promise<any>
    {
        
        const res = await this.request({data: req});
        
        return res.content;
    }

    // 工作台--排名榜
    @httpConfig({method: "GET",url: "/stat/metadata/getRedHeiBang", schema: "/serverApi"})
    public async getRedHeiBang(req: any): Promise<any>
    {
        const res = await this.request({data: req});
        
        return res.content;
    }

    @httpConfig({method: "GET",url: "/stat/metadata/getDangerByRedHeiBangId", schema: "/serverApi"})
    public async getDangerByRedHeiBangId(id: number, type: number, day: string, specialId?: number)
    {
        const res = await this.request({
            params:
            {
                id,
                type,
                day,
                specialId
            }
        });
        return res;
    }

    @httpConfig({method: "GET",url: "/stat/metadata/getTotalRanking", schema: "/serverApi"})
    public async getTotalRanking(specialTypeId: number, type: number, customerDeptId: number, day?: string)
    {
        let res = await this.request({
            params:
            {
                specialTypeId,
                type,
                customerDeptId,
                day
            }
        });
        return res;
    }

    @httpConfig({method: "GET", url: "/stat/metadata/getGrade", schema: "/serverApi"})
    public async getGrade(specialTypeId: number, customerDeptId: number, day?: string)
    {
        let res = await this.request({
            params:
            {
                specialTypeId,
                customerDeptId,
                day
            }
        });
        return res;
    }
}
