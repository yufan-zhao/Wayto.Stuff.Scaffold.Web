import { IHttpRequest, IHttpResponse, SpecialRuleInfo, SpecialRuleModule } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class SpecialRuleService extends ServiceBase
{
    /**
     * 分值列表
     * @param specialTypeId 体系类型id
     */
    @httpConfig({method: "GET", url: "/specialCustomRule/listDetails", schema: "/serverApi"})
    public async queryGeneralRules(specialTypeId: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {specialTypeId}});
        return res;
    }

    /**
     * 分值新增
     * @param data
     * @returns 
     */
    @httpConfig({method: "POST", url: "/specialCustomRule/save", schema: "/serverApi"})
    public async insertGeneralRule(data: any): Promise<IHttpResponse>
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    name: data.scoreName,
                    specialTypeId: data.specialTypeId,
                    type: data.type
                },
                paramExt:
                {
                    ruleModelInfos: data.modules.map(item =>
                    {
                        return {
                            modelId: item.moduleId,
                            weight: item.moduleWeight,
                            type: item.type
                        };
                    })
                }
            }
        };

        const res = await this.request(req);
        // console.log(JSON.stringify(req.data));
        return res;
    }
    
    @httpConfig({method: "PUT", url: "/specialCustomRule/updateBatchWeight", schema: "/serverApi"})
    public async updateGeneralRuleWeight(data: any)
    {
        const req: IHttpRequest =
        {
            data: data.map(item =>
            {
                return {
                    id: item.id,
                    weight: item.weight
                };
            })
        };
        // console.log(JSON.stringify(req.data));
        const res = await this.request(req);
        return res;
    }

    /**
     * 分值修改
     * @param data
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialCustomRule/updateById", schema: "/serverApi"})
    public async updateGeneralRule(data: any, deleteIds: Array<number>): Promise<IHttpResponse>
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    id: data.id,
                    name: data.scoreName,
                    specialTypeId: data.specialTypeId,
                    type: data.type
                },
                paramExt:
                {
                    deleteIds: deleteIds,
                    ruleModelInfos: data.modules.map(item =>
                    {
                        return {
                            id: item.moduleKeyId,
                            modelId: item.moduleId,
                            weight: item.moduleWeight,
                            type: item.type
                        };
                    })
                }
            }
        };
        const res = await this.request(req);
        // console.log(JSON.stringify(req));
        return res;
    }

    /**
     * 分值删除
     * @param id 
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialCustomRule/virtualRemoveById", schema: "/serverApi"})
    public async deleteGeneralRule(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 模块列表
     * @param specialTypeId 
     */
    @httpConfig({method: "GET", url: "/sys/special/custom/model/listDetails", schema: "/serverApi"})
    public async queryRuleModule(specialTypeId: number): Promise<Array<SpecialRuleModule>>
    {
        const result: Array<SpecialRuleModule> = [];

        const res = await this.request({params: {specialTypeId}});

        res.content.forEach(item =>
        {
            if (Array.isArray(item.modelInfoVos) && item.modelInfoVos.length > 0)
            {
                result.push({
                    moduleId: item.id,
                    moduleName: item.name,
                    specialTypeId: item.specialTypeId,
                    specials: item.modelInfoVos.map(jtem =>
                    {
                        return {
                            id: jtem.id,
                            modelId: jtem.modelId,
                            primarySpecialNodeId: jtem.parentSpecialId,
                            primarySpecialNodeName: jtem.parentSpecial.name,
                            weight: jtem.weight,
                            secondSpecials: jtem.sonSpecials,
                            secondSpecialNodeIds: Array.isArray(jtem.sonSpecials) ? jtem.sonSpecials.map(ktem => ktem.id) : []
                        };
                    })
                });
            }
            else
            {
                console.error("数据严重异常，出现了没有包含体系的模块。");
            }
        });

        return result;
    }

    @httpConfig({method: "GET", url: "/specialCustomRule/getSpecialCustomRuleDto/{specialTypeId}", schema: "/serverApi"})
    public async getSpecialCustomRuleDto(specialTypeId: number): Promise<Array<any>>
    {
        const res = await this.request({urlPath: {specialTypeId}});
        return res.content;
    }

    /**
     * 模块新增接口
     * @param data 
     */
    @httpConfig({method: "POST", url: "/sys/special/custom/model/save", schema: "/serverApi"})
    public async insertRuleModule(data: SpecialRuleModule): Promise<IHttpResponse>
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    name: data.moduleName,
                    specialTypeId: data.specialTypeId
                },
                paramExt:
                {
                    modelInfos: data.specials.map(item =>
                    {
                        return {
                            parentSpecialId: item.primarySpecialNodeId,
                            specialIds: item.secondSpecialNodeIds.join(","),
                            weight: item.weight
                        };
                    })
                }
            }
        };
        
        const res = await this.request(req);
        return res;
    }

    /**
     * 模块更新接口
     * @param data 
     */
    @httpConfig({method: "PUT", url: "/sys/special/custom/model/updateById", schema: "/serverApi"})
    public async updateRuleModule(data: SpecialRuleModule, deleteIds: Array<number>)
    {
        const req: IHttpRequest =
        {
            data:
            {
                param:
                {
                    id: data.moduleId,
                    name: data.moduleName,
                    specialTypeId: data.specialTypeId
                },
                paramExt:
                {
                    deleteIds: deleteIds,
                    modelInfos: data.specials.map(item =>
                    {
                        return {
                            id: item.id,
                            modelId: item.modelId,
                            parentSpecialId: item.primarySpecialNodeId,
                            specialIds: item.secondSpecialNodeIds.join(","),
                            weight: item.weight
                        };
                    })
                }
            }
        };
        
        const res = await this.request(req);
        return res;
    }

    /**
     * 模块删除接口
     * @param id 
     */
    @httpConfig({method: "PUT", url: "/sys/special/custom/model/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
