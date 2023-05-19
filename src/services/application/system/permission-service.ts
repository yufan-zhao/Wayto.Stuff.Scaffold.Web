import { IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class PermissionService extends ServiceBase
{
    /**
     * 获取当前系统的全部权限和结构
     * @returns 
     */
    @httpConfig({method: "GET", url: "/permission/treeAll", schema: "/serverApi"})
    public async queryTreeAll()
    {
        const res = await this.request({});
        const results: Array<any> = [];

        if (Array.isArray(res.content))
        {
            let target = this.resolvePermissionTreeData(res.content);
            results.push(...target);
        }

        return results;
    }

    @httpConfig({method: "GET", url: "/permission/listDetails", schema: "/serverApi"})
    public async queryList(roleId: number, type: number)
    {
        const res = await this.request({
            params:
            {
                roleId,
                type
            }
        });
        const results: Array<any> = [];

        if (Array.isArray(res.content))
        {
            let target = this.resolvePermissionTreeData(res.content);
            results.push(...target);
        }

        return results;
    }

    @httpConfig({method: "GET", url: "/permission/tree", schema: "/serverApi"})
    public async queryTree(roleId: number, type: number = 2): Promise<IHttpResponse>
    {
        const res = await this.request({
            params:
            {
                roleId,
                type
            }
        });
        return res;
    }

    @httpConfig({method: "GET", url: "/permission/getMenu", schema: "/serverApi"})
    public async getMenu()
    {
        const res = await this.request({});
        // 获取到当前登录用户的菜单权限存放到上下文中
        this.applicationContext.permissionCodes = [];
        let result = [];
        if (Array.isArray(res.content))
        {
            let codes = this.resolveMenuPermissionData(res.content);
            result.push(...codes);
        }
        this.applicationContext.permissionCodes = result;

        return res;
    }

    private resolveMenuPermissionData(data: Array<any>, payload: Array<string> = []): Array<string>
    {
        for (let i = 0; i < data.length; i++)
        {
            let item = data[i];
            payload.push(item.code);

            if (Array.isArray(item.children) && item.children.length > 0)
            {
                this.resolveMenuPermissionData(item.children, payload);
            }
        }
        return payload;
    }

    private resolvePermissionTreeData(permissions: Array<any>, level = 0): Array<any>
    {
        const result: Array<any> = [];
        permissions.forEach(item =>
        {
            let target: any =
            {
                id: item.id,
                parentId: item.parentId,
                parentIds: item.parentIds,
                code: item.code,
                name: item.name,
                type: item.type,
                canSelectLevels: item.canSelectLevels,
                selectedDataIsolationLevel: item.selectedDataIsolationLevel
            };

            if (Array.isArray(item.children))
            {
                target.children = this.resolvePermissionTreeData(item.children, level + 1);
            }
            result.push(target);
        });
        return result;
    }
}
