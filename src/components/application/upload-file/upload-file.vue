<template>
    <div class="component-upload-file" v-previewer>
        <ul class="file-list">
            <li class="file-item" v-for="(item, i) in uploadList" :key="i">
                <div class="mask">
                    <i-icon type="ios-trash-outline" class="del-btn" size="28" @click.native="onImageRemove(i)"></i-icon>
                </div>
                <div class="content">
                    <!-- 图片文件 -->
                    <template v-if="item.fileSuffix === '.jpg' || item.fileSuffix === '.jpeg' || item.fileSuffix === '.png'">
                        <img class="pic" :src="imagePath(item.filePath)" />
                    </template>
                    <!-- 非图片文件 -->
                    <template v-else>
                        <i-tooltip content="content of tooltip">
                            <img class="icon" src="~src/assets/application/file-icon/enclosure.png" />
                            <span slot="content">{{item.originalName}}{{item.fileSuffix}}</span>
                        </i-tooltip>
                        
                    </template>
                </div>
            </li>
            <li class="file-item add" v-if="maxLength === 0 || uploadList.length < maxLength" :style="fileItemStyles" @click="onUploadClick">
                <input ref="uploadInput" :accept="accept" @change="onFileChange" type="file" class="upload-input" />
                <i-button type="info">
                    <i-icon type="ios-add" size="40" class="font-lightgrey" />
                </i-button>
            </li>
            <li class="placeholder" v-if="uploadList.length === 0" :style="{height: size[1] + 'px'}">
                <slot>请上传文件</slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { ApplicationContext } from "src/application";
import { UploadService } from "src/services";
import { ExtendUtils } from "src/common/utils";

@component
export default class UploadFile extends View
{

    /**
     * 双向绑定的文件列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected value: Array<any>;
    /**
     * 限定上传数量 0标识不限制
     * @member
     * @protected
     * @returns Array<any>
     */
    @config({type: Number, default: 0})
    protected maxLength: number;
    /**
     * 尺寸 [宽, 高]
     * @config
     */
    @config({required: false, type: Array, default: () => [64, 64]})
    protected size: [number, number];

    /**
     * 图片路径处理
     * @property
     */
    protected imagePath = ExtendUtils.imagePath;

    /**
     * 文件项的尺寸
     * @property
     */
    protected get fileItemStyles(): any
    {
        return {
            width: this.size[0] + "px",
            height: this.size[1] + "px"
        };
    }

    /**
     * 回显文件列表
     * @property
     */
    protected uploadList: Array<any> = [];

    /**
     * 按钮锁
     * @property
     */
    protected isLoading: boolean = false;

    /**
     * @public
     * 限制上传文件的格式，具体参数请参考input的accept属性
     */
    @config({type: String, default: "*"})
    public accept: string;

    /**
     * 监听 回显
     * @property
     */
    @watch("value",{immediate: true})
    protected change(val)
    {
        // 
        this.uploadList = val;
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
     * 删除文件
     * @protected
     */
    protected onImageRemove(i)
    {
        this.uploadList.splice(i,1);
    }

    /**
     * 文件选择变化事件
     * @protected
     */
    protected async onFileChange(event: Event)
    {
        const target = <HTMLInputElement>event.target;
        const fileList: FileList = target.files;
        
        // 调用上传接口
        let commonFileService = ApplicationContext.current.serviceFactory.default.resolve<UploadService>(UploadService);
        try
        {
            this.isLoading = true;
            // const res = await commonFileService.upload({
            //     files: fileList
            // });
            // this.uploadList.push(...res.content);
            // this.$emit("input", this.uploadList);
        }
        catch(err)
        {
            // 处理上传异常
            this.$message.error("上传失败");
        }
        finally
        {
            this.isLoading = false;
            target.value = ""; // 清空input中的文件
        }
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
    .file-list
    {
        display: flex;
        flex-wrap: wrap;

        .file-item
        {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 64px;
            margin-right: 10px;
            margin-bottom: 10px;
            transition: all 0.2s ease-in-out;

            .mask
            {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #000;
                opacity: 0;
                transition: all 0.2s ease-in-out;
                z-index: 99;
                .del-btn
                {
                    position: absolute;
                    top: 0;
                    right: 0;
                    color: #fff;
                    cursor: pointer;
                    
                }
            }
            .content
            {
                width: 100%;
                height: 100%;

                .pic
                {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .icon
                {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .file-item:hover
        {
            .mask
            {
                opacity: 0.4;
            }
        }
        .file-item.add
        {
            background-color: #F8F9FA;
            // border: 1px solid #ECECEC;
            cursor: pointer;

            .upload-input
            {
                display: none;
            }
            button
            {
                padding: 0;
                width: 100%;
                height: 100%;
            }
        }
        .file-item.add:hover
        {
            background-color: darken(#F8F9FA, 5%);
        }

        .placeholder
        {
            display: flex;
            align-items: center;
            color: #A6ABB5;
        }
    }
}
</style>