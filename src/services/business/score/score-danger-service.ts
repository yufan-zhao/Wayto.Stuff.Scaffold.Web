import { IHttpRequest, IHttpResponse, ScoreSpecialDanger } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";

@Injectable()
export default class ScoreDangerService extends ServiceBase
{
    /**
     * 获取指定的评分体系隐患列表
     * @param scoreSpecialId 
     * @param consultId
     * @returns 
     */
    @httpConfig({method: "GET", url: "/specialCheckInfo/getCheckInfo", schema: "/serverApi"})
    public async getTargetScoreDangers(scoreSpecialId: number, consultId: number): Promise<Array<ScoreSpecialDanger>>
    {
        const results: Array<ScoreSpecialDanger> = [];

        const res = await this.request({
            params:
            {
                specialId: scoreSpecialId,
                consultId
            }
        });

        if (Array.isArray(res.content))
        {
            res.content.forEach(item =>
            {
                // 隐患可选列表
                let dangerLevelOptions = item.hazards.map((hazardItem ,i) =>
                {
                    return {
                        name: hazardItem.name,
                        value: hazardItem.id
                    };
                });
                results.push({
                    id: item.id,
                    scoreSpecialId: item.specialId,
                    label: item.label,
                    content: item.standard,
                    dangerLevelOptions: dangerLevelOptions,
                    tag: Boolean(item.tag)
                });
            });
        }

        return results;
    }

    @httpConfig({method: "GET", url: "/specialCheckInfo/getCheckInfoVo", schema: "/serverApi"})
    public async getTargetScoreCheckDangers(checkId: number, scoreSpecialId: number, consultId: number)
    {
        const res = await this.request({
            params:
            {
                checkId,
                specialId: scoreSpecialId,
                consultId
            }
        });
        let results = [];
        
        res.content.forEach(item =>
        {
            // 问题图片视频列表
            let mediaFiles = [];
            if (Array.isArray(item.commonFileList))
            {
                mediaFiles = item.commonFileList.map(file =>
                {
                    return {
                        ...file
                    };
                });
            }
            let opUser = "";
            if (item.user)
            {
                opUser += `${item.user.name}(${item.hazardName})`;
            }
            results.push({
                id: item.id,
                checkId: item.checkId,
                dangerLevel: item.hazardLevel,
                problemDescribe: item.questionDescription,
                rectifySuggestion: item.rectifyDescription,
                rectifyDay: item.rectifyDay,
                deductPoints: item.buckleScore,
                mediaFiles: mediaFiles,
                opUser: opUser
            });
        });
        return results;
    }

    @httpConfig({method: "PUT", url: "/specialCheckInfo/virtualRemoveById", schema: "/serverApi"})
    public async deleteTargetScoreCheckDanger(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }

    /**
     * 上报或者修改隐患检查项
     * @param item 
     * @returns 
     */
    @httpConfig({method: "PUT", url: "/specialCheckInfo/addCheckInfo", schema: "/serverApi"})
    public async addCheckInfo(item: ScoreSpecialDanger, scoreSpecialTypeId: number, consultId: number, checkId: number, scoreSpecialId: number): Promise<IHttpResponse>
    {
        const res = await this.request({
            data:
            {
                param:
                {
                    id: item.id,
                    checkId: checkId,
                    label: item.label,
                    rectifyDescription: item.rectifySuggestion,
                    rectifyDay: item.rectifyDay,
                    questionDescription: item.problemDescribe,
                    fileIds: item.mediaFiles.map(item => item.id),
                    hazardLevel: item.dangerLevel,
                    buckleScore: item.deductPoints,
                    specialId: scoreSpecialId,
                    specialTypeId: scoreSpecialTypeId,
                    consultId
                }
            }
        });
        return res;
    }
}
