import { IHttpResponse, SpecialType } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

/**
 * 13体系类型
 * @service
 */
@Injectable()
export default class SpecialTypeService extends ServiceBase
{
    /**
     * 获取体系类型列表
     * @param customerId 
     * @returns 
     */
    public async specialTypes(customerId?: number): Promise<Array<SpecialType>>
    {
        let isCustomer = typeof customerId === "number";
        let results: Array<SpecialType>;

        // 根据customerId区分获取默认体系类型还是客户体系类型
        if (isCustomer)
        {
            results = await this.getSpecialTypeList(customerId);
        }
        else
        {
            results = await this.getSpecialTypeList();
        }
        return results;
    }

    /**
     * 获取体系分类列表
     * @param customerId 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/specialType/getSpecialTypeList", schema: "/serverApi"})
    public async getSpecialTypeList(customerId: number = 0): Promise<Array<SpecialType>>
    {
        const res = await this.request({params: {customerId}});
        return res.content.map((item: any): SpecialType =>
        {
            return {
                isCustomer: customerId !== 0,
                id: item.id,
                name: item.typeName,
                code: item.typeNumber,
                isList: item.isList
            };
        });
    }

    /**
     * 客户体系类型新增
     * @param customerId 客户id
     * @param specialTypeId 关联的项目类型id作为体系id，应该是projectTypeId
     * @param name 新的名称替代关联的项目类型名称
     * @returns 
     */
    @httpConfig({method: "POST", url: "/specialType/saveCustomerSpecialType", schema: "/serverApi"})
    public async saveCustomerSpecialType(customerId: number, specialTypeId: number, name: string): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                customerId,
                specialTypeId,
                name
            },
            serializeType: "form"
        });
        return res;
    }

    /**
     * 删除接口
     * @param id 
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialType/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 设置体系类型是否有正负面反馈
     * @param specialTypeId 
     */
    @httpConfig({method: "PUT", url: "/sys/specialList/updateListStatus/{specialTypeId}", schema: "/serverApi"})
    public async setSpecialTypeStatus(specialTypeId: number, isList: boolean = true)
    {
        const res = await this.request({urlPath: {specialTypeId}, params: {isList}});
        return res;
    }
}
