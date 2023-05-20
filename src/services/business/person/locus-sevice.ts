import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";

import { Injectable } from "uxmid-core";
import dayjs from "dayjs";
import { httpConfig } from "src/common/http";

import BaiduYingyanBaseService from "../../baidu-yingyan-service-base";
import { ApplicationContext } from "src/application";

@Injectable()
export default class LocusService extends BaiduYingyanBaseService
{
    @httpConfig({method: "GET",url: "/track/getlatestpoint", schema: "/baiduYingyan"})
    public async getlatestpoint(filters: IPaginFilterModel): Promise<IHttpResponse>
    {
        const res = await this.request(filters);
        
        return res;
    }

    @httpConfig({method: "GET",url: "/track/getdistance", schema: "/baiduYingyan"})
    public async getdistance(data?: any): Promise<IHttpResponse>
    {
        const res = await this.request(data);
        
        return res;
    }
    
    // 诊治单位userId查询任务统计
    @httpConfig({method: "GET",url: "/track/gettrack", schema: "/baiduYingyan"})
    public async gettrack(params?: any): Promise<IHttpResponse>
    {
        const res = await this.request({params});
        
        return res;
    }

}
