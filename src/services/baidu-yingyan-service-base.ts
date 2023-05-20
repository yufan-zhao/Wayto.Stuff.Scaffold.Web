import { HttpClient } from "src/common/http";
import Axios from "axios";
import type { IHttpAnnotationConfig, IHttpRequest, IHttpResponse } from "src/models";
import { ApplicationContext } from "src/application";

export default abstract class BaiduYingyanBaseService
{
    /**
     * 应用上下文
     */
    protected get applicationContext()
    {
        return ApplicationContext.current;
    }

    /**
     * 在service方法中直接使用注解中的配置进行http请求
     * @param httpRequest 
     * @returns 
     */
    protected async request(httpRequest: IHttpRequest): Promise<any>
    {
        const methodName = (<any>this)["_currentApplyMethodName"].toString();
        const httpMetaData: IHttpAnnotationConfig = (<any>this)[methodName].httpMetaData;

        if (!httpRequest)
        {
            httpRequest = {};
        }

        httpRequest.url = (httpMetaData.schema || "") + httpMetaData.url + `?mcode=${this.applicationContext.settings.baiduYingyanSettings.mcode}`;
        
        const result = await Axios.get(httpRequest.url, {
            params:
            {
                ...httpRequest.params,
                ak: this.applicationContext.settings.baiduYingyanSettings.ak,
                service_id: this.applicationContext.settings.baiduYingyanSettings.serviceId || 234158
            }
        });

        // console.log(result);

        return result;
    }
}
