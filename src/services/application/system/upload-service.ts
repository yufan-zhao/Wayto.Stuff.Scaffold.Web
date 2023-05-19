import { httpConfig } from "src/common/http";
import { sendHttpMessage } from "src/common/http/http-tool";
import { IHttpResponse } from "src/models";
import { Injectable } from "uxmid-core";

import ServiceBase from "../../service-base";

@Injectable()
export default class UploadService extends ServiceBase
{
    /**
     * blob文件上传
     * @param blobs Array<Blob>
     * @param onUploadProgress 
     * @returns {IHttpResponse} IHttpResponse
     */
    @httpConfig({method: "UPLOAD", url: "/commonFile/upload", schema: "/serverApi"})
    public async blobUpload(blobs: Array<Blob>, onUploadProgress?: (progressEvent: any) => void): Promise<IHttpResponse>
    {
        console.log(blobs);
        
        // const result: Array<any> = [];
        const res = await this.request({
            files: blobs,
            onUploadProgress
        });
        // res.content.forEach(item =>
        // {
        //     result.push(item);
        // });
        return res;
    }

    public async upload(req: any): Promise<IHttpResponse>
    {
        
        return sendHttpMessage("upload", "/serverApi", "/commonFile/upload", req);
        // return null;
    }
}
