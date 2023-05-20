import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";
import { PermissionCode } from "src/enums";

import ServiceBase from "../../service-base";

/**
 * 项目管理-诊治计划服务
 * @service
 */
@Injectable()
export default class ProjectPlanService extends ServiceBase
{
    /**
     * 根据指定的时间段获取诊治计划列表
     * @param startDateStr YYYY-MM-dd
     * @param endDateStr YYYY-MM-dd
     */
    @httpConfig({method: "GET", url: "/consultPlan/listDetails", schema: "/serverApi"})
    public async getCalendarPlanList(startDateStr: string, endDateStr: string)
    {
        let res = await this.request({
            params:
            {
                startTime: startDateStr,
                endTime: endDateStr,
                menuCode: PermissionCode.DATA_ZZJH
            }
        });
        return res.content;
    }

    private mockListData(startDateStr: string, endDateStr: string)
    {
        let startDate = dayjs(startDateStr);
        let endDate = dayjs(endDateStr);
        let nameList =
        [
            "龙岗坪地高中园建设工程",
            "布吉街道大芬美术馆改造工程施工",
            "布吉街道大芬油画村综合整治工程",
            "宝龙街道宝荷九年一贯制学校新建工程",
            "龙岗区11个关闭（废弃）石场地质环境恢复和综合治理工程",
            "龙岗区档案馆建设工程",
            "横岗文体广场改造工程"
        ];
        let results = [];

        let length = endDate.get("date");
        for (let i = 0; i < length; i++)
        {
            let stack = [0, 1, 2, 3, 4, 5, 6];
            let times = Math.floor(Math.random() * 5);
            let j = 0;
            let fragment = [];
            while(j !== times)
            {
                let index = stack.splice(Math.floor(Math.random() * stack.length), 1)[0];
                fragment.push({
                    date: startDate.add(i, "day").format("YYYY-MM-DD"),
                    name: nameList[index]
                });
                j++;
            }
            results.push(...fragment);
        }

        return results;
    }
}
