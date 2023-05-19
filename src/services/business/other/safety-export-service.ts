
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class SafetyExportService extends ServiceBase
{
    /**
     * 保存或更新导出状态
     * @param consultId 诊治报告id
     * @param safetyId 安全知识id/安全日历id
     * @param exportStatus 状态(true/false)
     * @param type 类型：0 安全知识 、1安全日历
     */
    @httpConfig({method: "POST", url: "/safety/export/saveOrUpdateExportStatus", schema: "/serverApi"})
    public async saveOrUpdateExportStatus(consultId: number, safetyId: number, exportStatus: boolean, type: number = 0)
    {
        const res = await this.request({
            data:
            {
                type,
                consultId,
                safetyId,
                exportStatus
            },
            serializeType: "application/x-www-form-urlencoded"
        });
        return res;
    }
}
