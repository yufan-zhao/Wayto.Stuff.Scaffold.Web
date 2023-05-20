import type { IHttpRequest, IHttpResponse, ScoreSpecialNode } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class ScoreService extends ServiceBase
{
    /**
     * 获取评分体系树节点列表
     * @param consultId 
     * @param specialTypeId 
     * @param specialIds 
     * @param parentId 
     * @param level 
     * @returns 
     */
    @httpConfig({method: "GET", url: "/special/getSpecial", schema: "/serverApi"})
    public async getScoreSpecialNodeTree(consultId: number, specialTypeId: number, specialIds: Array<number>, parentId: number = 0, level: number = 1): Promise<Array<ScoreSpecialNode>>
    {
        const results: Array<ScoreSpecialNode> = [];

        const res = await this.request({
            params:
            {
                consultId: consultId,
                specialTypeId: specialTypeId,
                specialIds: level === 1 ? specialIds.join(",") : undefined,
                level,
                id: parentId
            }
        });

        res.content.forEach((item: any, i: number) =>
        {
            if (item.level === 3)
            {
                results.push({
                    consultId: consultId,
                    specialTypeId: specialTypeId,
                    id: item.id,
                    parentId: parentId,
                    level: item.level,
                    code: item.specialNum,
                    name: item.name,
                    deservedScore: item.deservedScore,
                    actualScore: item.actualScore,
                    weight: item.weight,
                    label: item.label,
                    tag: Boolean(item.tag),
                    dangerCount: item.dangerCount,
                    labelCount: item.labelCount
                });
            }
            else
            {
                results.push({
                    consultId: consultId,
                    specialTypeId: specialTypeId,
                    id: item.id,
                    parentId: parentId,
                    level: item.level,
                    children: [],
                    code: item.specialNum,
                    name: item.name,
                    deservedScore: item.deservedScore,
                    actualScore: item.actualScore,
                    weight: item.weight,
                    label: item.label,
                    loading: false,
                    tag: Boolean(item.tag),
                    dangerCount: item.dangerCount,
                    labelCount: item.labelCount
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
     * 设置甩项
     * @param consultId 
     * @param specialId 
     * @param specialTypeId 
     * @param label 
     */
    @httpConfig({method: "GET", url: "/consultPlan/changeLabel", schema: "/serverApi"})
    public async setLabel(consultId: number, specialId: number, specialTypeId: number, label: boolean)
    {
        const res = await this.request({
            params:
            {
                consultId,
                specialId,
                specialTypeId,
                label
            }
        });
        return res;
    }

    @httpConfig({method: "GET", url: "/consultPlan/setConsultPlan", schema: "/serverApi"})
    public async finish(consultId: number, specialTypeId: number)
    {
        const res = await this.request({params: {consultId, specialTypeId}});
        return res;
    }

    /**
     * 检查指定评分节点的所有父节点是否允许甩项
     * @param currentTree 
     * @param targetNode 
     * @returns 返回匹配的树节点链
     */
    public checkParentsLabel(currentTree: Array<ScoreSpecialNode>, targetNode: ScoreSpecialNode, records: Array<boolean> = []): boolean
    {
        for (let i = 0; i < currentTree.length; i++)
        {
            let item = currentTree[i];
            records.push(item.label);
            
            if (item.id === targetNode.id)
            {
                // console.log(item.name, records);
                let self = records.pop();
                let result = records.reduce((pre, cur, i) =>
                {
                    if (cur)
                    {
                        pre += 1;
                    }
                    return pre;
                }, 0);
                return result > 0;
            }
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                let res = this.checkParentsLabel(item.children, targetNode, records);
                if (res)
                {
                    return res;
                }
            }
            records.pop();
        }
    }

    /**
     * 检查指定评分节点是否是甩项
     * @param currentTree 
     * @param targetNode 
     * @returns 返回匹配的树节点链
     */
    public checkSelfLabel(currentTree: Array<ScoreSpecialNode>, targetNode: ScoreSpecialNode): boolean
    {
        for (let i = 0; i < currentTree.length; i++)
        {
            let item = currentTree[i];
            
            if (item.id === targetNode.id)
            {
                return item.label;
            }
            else if (Array.isArray(item.children) && item.children.length > 0)
            {
                return this.checkSelfLabel(item.children, targetNode);
            }
        }
    }
}
