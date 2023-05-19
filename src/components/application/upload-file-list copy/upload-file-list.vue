<template>
    <div class="component-upload-file" v-previewer>
        <div class="upload-action">
            <i-button class="button" size="small" :loading="isLoading" @click="onUploadClick" :disabled="maxLength !== 0 && fileList.length >= maxLength">
                上传文件
            </i-button>
            <span class="tip" v-if="maxLength">最多可上传{{ maxLength }}文件</span>
            <input type="file" multiple @change="onFileChange" :accept="accept" ref="uploadInput" class="select-input" />
        </div>
        <div class="upload-files">
            <ul>
                <li v-for="file in fileList" :key="file.id">
                    <a href="javascript:;" @click="preview(imagePath(file.filePath))">
                        <i-icon type="ios-link" size="16" />
                        <span class="file-name">{{ file.originalName }}{{ file.fileSuffix }}</span>
                        <i-icon @click.stop="deleteFile(file.id)" class="fr file-delete" type="ios-trash-outline" size="18" />
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch, model } from "uxmid-vue-web";
import { ApplicationContext } from "src/application";
import { CommonFileService } from "src/services";
import { ExtendUtils } from "src/common/utils";

@component
export default class UploadFileList extends View
{
    /**
     * @public
     * 上传文件数量限制
     */
    @config({ type: Number, default: 0 })
    public maxLength: number;

    /**
     * @public
     * 转换双向绑定的文件数据格式
     */
    @config({type: Function})
    public transformFiles: (data: any) => any;

    @config({type: Array, default: () => ([])})
    public value: Array<any>;

    /**
     * @public
     * 限制上传文件的格式，具体参数请参考input的accept属性
     */
    @config({type: String, default: "*"})
    public accept: string;

    public files: Array<any> = [];

    public fileList: Array<any> = [];

    public isLoading: boolean = false;

    public imagePath: any = ExtendUtils.imagePath;

    /**
     * 文件选择变化事件
     * @protected
     */
    protected async onFileChange(event: Event)
    {
        const target = <HTMLInputElement>event.target;
        const fileList: FileList = target.files;
        if (fileList.length > (this.maxLength - this.value.length))
        {
            this.$message.error("所选文件大于限制");
            return;
        }
        let pushFileList = [];
        let accepts = this.accept.replace("*", "").split(",");

        for (let i = 0; i < fileList.length; i++)
        {
            if (accepts.some(item => fileList[i].type.indexOf(item) !== -1))
            {
                pushFileList.push(fileList[i]);
            }
        }

        this.$emit("on-before-upload", pushFileList);
        // 调用上传接口
        let commonFileService = ApplicationContext.current.serviceFactory.default.resolve<CommonFileService>(CommonFileService);
        try
        {
            if (!pushFileList.length)
            {
                throw new Error("请选择要上传的文件");
            }
            this.isLoading = true;
            const res = await commonFileService.upload({
                files: pushFileList
            });
            this.fileList.push(...res.content);
            this.$emit("on-change", this.fileList);
            this.$emit("input", this.fileList);
        }
        catch(err)
        {
            // 处理上传异常
            this.$message.error(err.msg || err.message);
        }
        finally
        {
            this.isLoading = false;
            target.value = ""; // 清空input中的文件
        }
    }

    protected preview(path): void
    {
        window.open(path);
    }

    protected async deleteFile(id: any): Promise<void>
    {
        // let commonFileService = ApplicationContext.current.serviceFactory.default.resolve<CommonFileService>(CommonFileService);
        try
        {
            // await commonFileService.virtualRemoveById({params: {id}});
            this.fileList.splice(this.fileList.findIndex(item => item.id === id), 1);
            this.$emit("on-change", this.fileList);
            this.$emit("input", this.fileList);
        }
        catch(err)
        {
            // 处理上传异常
            this.$message.error("删除失败");
        }
    }

    // @watch("fileList", {immediate: true})
    // protected fileListChange(): void
    // {
    //     this.$emit("select-files", this.fileList);
    // }

    protected update(): void
    {
        if (this.transformFiles)
        {
            const files = this.transformFiles(this.value);

            this.fileList = [
                ...files
            ];
        } else {
            this.fileList = [
                ...this.value.map(item => {
                    if (!item.fileName && item.filePath)
                    {
                        item.fileName = item.filePath.split("/")[item.filePath.split("/").length - 1].split(".")[0];
                    }
                    return item;
                })
            ];
        }
    }

    @watch("value")
    protected valueChange(): void
    {
        this.update();
    }

    protected mounted()
    {
        this.update();
    }

    /**
     * 上传点击按钮
     * @member
     */
    protected onUploadClick()
    {
        this._uploadInput.click();
    }

    /**
     * 上传input DOM
     * @get
     */
    private get _uploadInput()
    {
        return this.$refs["uploadInput"] as any;
    }

}
</script>

<style lang="less" scoped>
.component-upload-file
{
    .upload-action
    {
        .button
        {
            // width: 66px;
            width: auto;
            height: 26px;
            box-sizing: border-box;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #838D9C;
            line-height: 12px;
        }
        .select-input
        {
            display: none;
        }
        .tip
        {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #A6ABB5;
            line-height: 28px;
            margin-left: 8px;
        }
    }
    .upload-files
    {
        ul
        {
            margin-top: 8px;
            li
            {
                a
                {
                    display: block;
                    padding: 10px 12px;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #525A65;
                    line-height: 28px;
                    .file-name
                    {
                        margin-left: 10px; 
                    }
                    &:hover
                    {
                        background: #F3FAFE;
                    }
                    .file-delete
                    {
                        margin-top: (28px / 2px) - (18px / 2px);
                    }
                }
            }
        }
    }
}
</style>