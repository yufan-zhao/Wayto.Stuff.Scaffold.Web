import ApplicationContext from "src/application/context";
import HttpClient from "./http-client";
import { IHttpAnnotationConfig } from "src/models";

/**
 * 从容器中获取服务实例
 * @param serviceConstructor 服务构造函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function resolveService<T>(serviceConstructor: Function): T
{
    const service: T =
        ApplicationContext.current.serviceFactory.default.resolve<T>(
            serviceConstructor
        );
    return service;
}

/**
 * service中的http请求方法注解
 * @param config IHttpAnnotationConfig
 */
function httpConfig(config: IHttpAnnotationConfig): any
{
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    )
    {
        target[propertyKey].httpMetaData = config;
        const p = new Proxy(target[propertyKey], {
            get: function(obj, prop)
            {
                return obj[prop];
            },
            apply: function(t, thisArg, argumentsList)
            {
                const bindFunc = t.bind(thisArg);
                thisArg._currentApplyMethodName = propertyKey;
                return bindFunc(...argumentsList);
            }
        });
        descriptor.value = p;
    };
}

export { HttpClient, resolveService, httpConfig };
