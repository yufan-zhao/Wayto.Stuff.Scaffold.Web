import { IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class RoleService extends ServiceBase
{
    /**
     * 获取当前角色列表
     * @returns 
     */
    @httpConfig({method: "GET", url: "/role/list", schema: "/serverApi"})
    public async list(): Promise<Array<{id: number; name: string; [property: string]: any}>>
    {
        const res = await this.request({});
        return res.content;
    }

    @httpConfig({method: "GET", url: "/role/getDetailById", schema: "/serverApi"})
    public async getDetailById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }

    @httpConfig({method: "POST", url: "/role/save", schema: "/serverApi"})
    public async insert(data: any)
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    name: data.name
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/role/updateById", schema: "/serverApi"})
    public async update(data: any)
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: data.id,
                    name: data.name
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/role/updateById", schema: "/serverApi"})
    public async updateRolePermission(roleId: number, permissionList: Array<any>, type: number = 1)
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: roleId
                },
                paramExt:
                {
                    permissionList: permissionList,
                    type: type
                }
            }
        });
        return res;
    }

    @httpConfig({method: "PUT", url: "/role/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }

    @httpConfig({method: "GET", url: "/role/getTemplateRole", schema: "/serverApi"})
    public async queryRoleTemplate(roleId: number)
    {
        const res = await this.request({params: {roleId}});
        return res;
    }

    @httpConfig({method: "GET", url: "/role/tree", schema: "/serverApi"})
    public async queryRoleTree(roleId: number)
    {
        const res = await this.request({params: {id: roleId}});
        return res;
    }
}
