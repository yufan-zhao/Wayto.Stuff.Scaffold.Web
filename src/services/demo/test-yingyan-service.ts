import { Injectable, Logger } from "uxmid-core";
import { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";
import dayjs from "dayjs";

import BaiduYingyanServiceBase from "../baidu-yingyan-service-base";
import { httpConfig } from "src/common/http";

/**
 * 百度鹰眼服务测试service
 * @service
 */
@Injectable()
export default class TestYingyanService extends BaiduYingyanServiceBase
{
    @httpConfig({method: "GET", url: "/track/gettrack", schema: "/baiduYingyan"})
    public async testTrace()
    {
        const res = await this.request({
            params:
            {
                entity_name: "13068715001",
                start_time: dayjs("2022-11-10 00:00:00").valueOf() / 1000,
                end_time: dayjs("2022-11-10 23:59:59").valueOf() / 1000
            }
        });
    }
}
