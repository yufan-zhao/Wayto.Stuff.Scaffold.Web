import { ExtendUtils } from "src/common/utils";
import { IHttpRequest } from "src/models";
import { ApplicationContext } from "src/application";
import HttpClient from "src/common/http/http-client";
// import md5 from "md5";

export
{
    sendHttpMessage
};

function sendHttpMessage(method: string, schema: string, url: string, req: IHttpRequest, headers?: any)
{
    // 处理前缀参数问题
    let schemaStr: string = typeof schema === "string" ? "/" + schema.replace("/", "") : "";
    let schemaUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + schemaStr;
    const requestConfig: IHttpRequest =
    {
        url: `${schemaUrl}${url}`,
        headers: {},
        ...req
    };

    requestConfig.headers["source-of-request"] = "web";
    requestConfig.headers["log-trace-id"] = ExtendUtils.uuid();

    if (headers)
    {
        Object.assign(requestConfig.headers, headers);
    }

    // !! 目前仅处理单平台请求token
    // const applicationContext = ApplicationContext.current;
    // if (applicationContext.sessionCredential)
    // {
    //     requestConfig.headers["Authorization"] = "Bearer " + applicationContext.sessionCredential.credentialId;
    // }

    const resPromise = HttpClient.instance[method](requestConfig);
    return resPromise;
}
