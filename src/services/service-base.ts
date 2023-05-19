import { HttpClient } from "src/common/http";
import { IHttpAnnotationConfig, IHttpRequest, IHttpResponse } from "src/models";
import { ApplicationContext } from "src/application";

export default abstract class BaseService
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
    protected async request(httpRequest: IHttpRequest): Promise<IHttpResponse>
    {
        const methodName = (<any>this)["_currentApplyMethodName"].toString();
        const httpMetaData: IHttpAnnotationConfig = (<any>this)[methodName].httpMetaData;

        if (!httpRequest)
        {
            httpRequest = {};
        }

        httpRequest.url = (httpMetaData.schema || "") + httpMetaData.url;
        if (httpRequest.headers)
        {
            httpRequest.headers["source-of-request"] = "web";
        }
        else
        {
            httpRequest.headers =
            {
                "source-of-request": "web"
            };
        }
        
        const res = HttpClient.instance[httpMetaData.method.toLowerCase()](httpRequest);
        return res;
    }
}
