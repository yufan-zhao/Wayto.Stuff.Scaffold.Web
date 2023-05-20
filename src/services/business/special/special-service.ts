import type { IHttpRequest, IHttpResponse, SpecialNode } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class SpecialService extends ServiceBase
{
    /**
     * 根据父id获取体系节点列表
     * @param specialTypeId 体系类型id
     * @param parentId 父id
     * @param level 层级，从1开始
     * @returns 
     */
    @httpConfig({method: "GET", url: "/special/getSpecial", schema: "/serverApi"})
    public async getSpecialListByParentId(specialTypeId: number, parentId: number = 0, level: number = 1): Promise<Array<SpecialNode>>
    {
        const results: Array<SpecialNode> = [];
        const res = await this.request({params: {specialTypeId, level, id: parentId}});
        res.content.forEach((item: any, i: number) =>
        {
            if (item.level === 3)
            {
                results.push({
                    specialTypeId: specialTypeId,
                    id: item.id,
                    parentId: parentId,
                    level: item.level,
                    code: item.specialNum,
                    name: item.name,
                    deservedScore: item.deservedScore,
                    weight: item.weight,
                    tag: Boolean(item.tag)
                });
            }
            else
            {
                results.push({
                    specialTypeId: specialTypeId,
                    id: item.id,
                    parentId: parentId,
                    level: item.level,
                    children: [],
                    code: item.specialNum,
                    name: item.name,
                    deservedScore: item.deservedScore,
                    weight: item.weight,
                    loading: false,
                    tag: Boolean(item.tag)
                });
            }
        });
        // 排序
        results.sort((a, b) =>
        {
            try
            {
                let aCodeArr = a.code.split(".");
                let bCodeArr = b.code.split(".");
                for (let i = 0; i < aCodeArr.length; i++)
                {
                    let item = aCodeArr[i];
                    let jtem = bCodeArr[i];
                    if (Number(item) > Number(jtem))
                    {
                        return 1;
                    }
                }
                return -1;
            }
            catch(err)
            {
                return 0;
            }
        });
        return results;
    }

    /**
     * 新增体系节点
     * @param node 
     * @returns 
     */
    @httpConfig({method: "POST", url: "/special/save", schema: "/serverApi"})
    public async addSpecialNodeByParentId(node: SpecialNode): Promise<IHttpResponse>
    {
        const requestData: IHttpRequest =
        {
            data:
            {
                param:
                {
                    name: node.name,
                    remark: node.remark,
                    specialNum: node.code,
                    deservedScore: node.deservedScore,
                    weight: node.weight,
                    specialTypeId: node.specialTypeId,
                    tag: node.tag ? 1 : 0
                },
                paramExt:
                {
                    level: node.level,
                    parentId: node.parentId
                }
            }
        };
        const res = await this.request(requestData);
        return res;
    }

    /**
     * 修改体系节点
     * @param node 
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/special/updateById", schema: "/serverApi"})
    public async editSpecialNodeById(node: SpecialNode): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: node.id,
                    name: node.name,
                    remark: node.remark,
                    specialNum: node.code,
                    deservedScore: node.deservedScore,
                    weight: node.weight ? Number(node.weight) : null,
                    specialTypeId: node.specialTypeId,
                    tag: node.tag ? 1 : 0
                },
                paramExt:
                {
                    level: node.level,
                    parentId: node.parentId
                }
            }
        });
        return res;
    }

    /**
     * 删除体系节点
     * @param id 
     * @param level 节点级别
     * @param specialTypeId 体系分类id
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/special/deleteSpecial", schema: "/serverApi"})
    public async deleteById(id: number, level: number, specialTypeId: number): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                id: id,
                level: level,
                specialTypeId
            },
            serializeType: "form"
        });
        return res;
    }
    
    /**
     * 删除体系节点
     * @param id 
     * @param level 节点级别
     * @param specialTypeId 体系分类id
     * @returns 
     */
    @httpConfig({method: "GET", url: "/special/getKnowledgeSpecial", schema: "/serverApi"})
    public async getKnowledgeSpecial(specialTypeId: number, basicId?: number): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                specialTypeId,
                basicId
            }
        });
        return res.content;
    }
}
