import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";
import { ExtendUtils } from "src/common/utils";
import { IViewCascaderData, IHttpResponse } from "src/models";

import ServiceBase from "../../service-base";

@Injectable()
export default class OrgService extends ServiceBase
{
    /**
     * 获取组织树，包含根节点
     * @returns 
     */
    @httpConfig({method: "GET", url: "/userGroup/treeAll", schema: "/serverApi"})
    public async tree(): Promise<any>
    {
        const res = await this.request({});
        return res.content[0];
    }

    /**
     * 新增组织
     * @param data 
     */
    @httpConfig({method: "POST", url: "/userGroup/save", schema: "/serverApi"})
    public async insert(data: any)
    {
        data.code = ExtendUtils.uuid();
        const res = await this.request({data: {
            param: data
        }});
        return res;
    }

    /**
     * 编辑组织
     * @param data 
     */
    @httpConfig({method: "PUT", url: "/userGroup/updateById", schema: "/serverApi"})
    public async update(data: any)
    {
        const res = await this.request({data: {
            param: data
        }});
        return res;
    }

    /**
     * 删除指定组织
     * @param id 
     */
    @httpConfig({method: "PUT", url: "/userGroup/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 获取组织部门select组件级联数据源
     * @public
     */
    @httpConfig({method: "GET", url: "/userGroup/treeAll", schema: "/serverApi"})
    public async getTreeCascader(): Promise<Array<IViewCascaderData>>
    {
        const res = await this.request({});
        const orgList = res.content[0].children;
        return this.resolveTreeCascaderData(orgList);
    }

    /**
     * 递归处理级联数据
     * @param orgList 
     */
    private resolveTreeCascaderData(orgList: Array<any>): Array<IViewCascaderData>
    {
        let results: Array<IViewCascaderData> = [];
        orgList.forEach(item =>
        {
            let target: any =
            {
                label: item.name,
                value: item.id,
                parentId: item.parentId
            };
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                target.children = this.resolveTreeCascaderData(item.children);
            }
            results.push(target);
        });
        return results;
    }
}
