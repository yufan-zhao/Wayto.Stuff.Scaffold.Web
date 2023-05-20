import { httpConfig } from "src/common/http";
import type { IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";

import ServiceBase from "../../service-base";

@Injectable()
export default class WeatherService extends ServiceBase
{
    /**
     * 获取深圳天气警报信息
     */
    @httpConfig({method: "GET",url: "/diagnosisdept/getWeather", schema: "/serverApi"})
    public async getSzWeatherAlarm(): Promise<IHttpResponse>
    {
        const res = await this.request({});
        return res;
    }
}
