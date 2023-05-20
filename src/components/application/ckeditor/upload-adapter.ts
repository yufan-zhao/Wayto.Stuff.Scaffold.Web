import { imagePath } from "src/common/filters/common";

class UploadAdapter
{
    /**
     * @private 私有loader
     */
    private loader: any;

    /**
     * @private 私有上传service
     */
    private service: any;

    /**
     * 构造方法
     * @param loader 
     * @param service 
     */
    public constructor(loader?: any, service?: any)
    {
        this.loader = loader;
        this.service = service;
    }

    /**
     * 上传实现
     */
    public async upload()
    {
        const file = await this.loader.file;
        const res = await this.service.fileUpload({
            files: [file]
        });
        return {
            uploaded: true,
            default: imagePath(res.content.filePath)
        };
    }

    /**
     * 中断
     */
    public abort()
    {
        console.error("ckeditor上传失败");
    }
}

export default UploadAdapter;
