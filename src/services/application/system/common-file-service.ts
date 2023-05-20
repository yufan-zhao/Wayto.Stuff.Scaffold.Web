import { Injectable } from "uxmid-core";
import type { IHttpResponse, IHttpRequest, IPaginFilterModel } from "src/models";

import ServiceBase from "../../service-base";
import { sendHttpMessage } from "src/common/http/http-tool";
import { httpConfig } from "src/common/http";

@Injectable()
export default class CommonFileService extends ServiceBase
{
    @httpConfig({method: "GET",url: "/commonFile/list", schema: "/serverApi"})
    public async list(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request({});
        return res.content[0];
    }

    @httpConfig({method: "GET",url: "/commonFile/getDetailById", schema: "/serverApi"})
    public async detail(req: IHttpRequest): Promise<IHttpResponse>
    {
        return null;
    }

    /**
     * 单文件或多文件上传
     * @param req 
     * @returns 
     */
    @httpConfig({method: "UPLOAD",url: "/commonFile/upload", schema: "/serverApi"})
    public async upload(req: IHttpRequest): Promise<IHttpResponse>
    {
        const res = await this.request(req);
        return res;
    }

    /**
     * 单文件新增
     * @param fileBlob blob文件
     * @param fileTitle 带有后缀的文件名
     */
    @httpConfig({method: "POST",url: "/commonFile/uploadSingle", schema: "/serverApi"})
    public async uploadBlobSingle(fileBlob: Blob, fileTitle: string)
    {
        const data = new FormData();
        data.append("file", fileBlob, fileTitle);
        const res = await this.request({
            // serializeType: "application/x-www-form-urlencoded",
            data: data
        });
        return res;
    }

    /**
     * 单文件上传
     * @param req 
     * @returns 
     */
    @httpConfig({method: "POST",url: "/commonFile/uploadSingle", schema: "/serverApi"})
    public async uploadSingle(req: IHttpRequest): Promise<IHttpResponse>
    {
        return null;
    }

    /**
     * 文件删除
     * @param req 
     * @returns 
     */
    @httpConfig({method: "PUT",url: "/commonFile/virtualRemoveById", schema: "/serverApi"})
    public async virtualRemoveById(id: number): Promise<IHttpResponse>
    {
        const res = await this.request({params: {id}});
        return res;
    }
}
