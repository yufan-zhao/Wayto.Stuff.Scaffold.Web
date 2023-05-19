<template>
    <div class="ux-image-upload-component">
        <slot name="display">
            <ul class="upload-image-list" ref="mediaList">
                <li class="upload-image-item" v-for="(item, index) in valueCopy" :key="item.id">
                    <div class="upload-image-image">
                        <img v-if="['jpg', 'jpeg', 'png'].indexOf(checkSuffix(item.filePath)) >= 0" class="img" :src="'/serverApi' + item.filePath" />
                        <video v-else-if="['mp4'].indexOf(checkSuffix(item.filePath)) >= 0" title="双击播放视频" :src="'/serverApi' + item.filePath"></video>
                    </div>
                    <div class="upload-upload-list-cover cursor-pointer">
                        <i-icon
                            size="24"
                            type="ios-eye-outline"
                            class="font-white view-img"
                            @click.native="onItemView(item)"
                        ></i-icon>
                        <i-icon type="ios-trash-outline" class="font-white delete-img" size="24" @click.native="onImageRemove(index)"></i-icon>
                    </div>
                </li>
                <li class="upload-image-item" v-if="!isLimited">
                    <i-upload
                        multiple
                        :action="''"
                        :before-upload="handleBeforeUpload"
                    >
                        <div class="upload-button">
                            <Icon type="ios-add" />
                        </div>
                    </i-upload>
                </li>
                <li class="watermark-switch">
                    是否带水印：
                    <i-switch v-model="needWatermark"></i-switch>
                </li>
            </ul>
        </slot>

        <!-- 公共视频框 BEGIN -->
        <b-super-video v-model="superVideo.isShow" :src="superVideo.src"></b-super-video>
        <!-- 公共视频框 END -->
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { IHttpRequest, IHttpResponse } from "src/models";
import Viewer from "viewerjs";
import watermark from "watermarkjs";
import dayjs from "dayjs";

@component
export default class UxMediaUpload extends View
{
    /**
     * 数据源
     * @config
     */
    @config({required: false, type: Array, default: () => []})
    protected value: Array<any>;

    /**
     * 上传方法
     * @config
     */
    @config({required: false, type: Function})
    protected uploadSingleFunction: (file: Blob, fileName?: string) => Promise<IHttpResponse>;

    @config({required: false, type: Function})
    protected uploadFunction: (req: IHttpRequest) => Promise<IHttpResponse>;

    /**
     * 上传限制个数，默认不限制
     * @config
     */
    @config({required: false, type: Number})
    protected limit: number;

    /**
     * 额外信息
     * @config
     */
    @config({required: false})
    protected payload: any;

    /**
     * 水印地址
     * @config
     */
    @config({required: false, default: ""})
    protected watermarkLogoUrl: string;

    protected needWatermark = false;

    protected get isLimited(): boolean
    {
        if (typeof this.limit === "number" && this.limit >= 0)
        {
            return this.valueCopy.length >= this.limit;
        }
        else
        {
            return false;
        }
    }

    /**
     * 数据源副本
     * @property
     */
    protected valueCopy: Array<any> = [];

    protected logoImg = null;

    /**
     * 公共视频框状态
     */
    protected superVideo =
    {
        isShow: false,
        src: ""
    };

    protected viewerIns = null;

    protected checkSuffix(src: string)
    {
        if (!src)
        {
            return;
        }
        let chunk = src.split(".");
        let suffix = chunk[chunk.length - 1];
        return suffix;
    }

    /**
     * 视频点击事件
     */
    protected onVideoHandler(src): void
    {
        this.superVideo.isShow = true;
        this.superVideo.src = src;
    }

    /**
     * 删除组件内存在的图片
     * @property
     */
    protected onImageRemove(index: number)
    {
        // step1 删除本地副本中的图片
        this.valueCopy.splice(index, 1);

        this.onFileChange();
    }

    protected onItemView(item)
    {
        if (["mp4"].indexOf(this.checkSuffix(item.filePath)) >= 0)
        {
            this.onVideoHandler("/serverApi" + item.filePath);
        }
        else if (["jpg", "jpeg", "png"].indexOf(this.checkSuffix(item.filePath)) >= 0)
        {
            if (this.viewerIns)
            {
                this.viewerIns.view(0);
            }
        }
        else
        {
            this.$message.info("暂不支持此媒体类型查看");
        }
    }

    protected async handleBeforeUpload(file: File)
    {
        if (!this.checkFileTypeValid(file.name))
        {
            this.$message.error("上传的文件格式不支持");
            return false;
        }

        if (typeof this.uploadFunction === "function")
        {
            try
            {
                if (this.needWatermark)
                {
                    // console.log(this.payload);
                    let logo: any = await this.drawWatermark(file, this.payload);
                    const res = await this.uploadSingleFunction(logo, file.name);
                    this.valueCopy.push(res.content);
                    this.onFileChange();
                }
                else
                {
                    const res = await this.uploadFunction({
                        files: [file],
                        onUploadProgress: () =>
                        {
                            // TODO
                        }
                    });
                    this.valueCopy.push(res.content[0]);
                    this.onFileChange();
                }

                // 返回promise阻止上传
                return new Promise(() => {
                    // TODO
                });
            }
            catch(err)
            {
                console.error(err);
            }
        }
        else
        {
            this.$message.error("请传入指定的上传方法");
        }

        return false;
    }

    protected onFileChange()
    {
        this.$emit("input", this.valueCopy);
        this.$emit("on-change", this.valueCopy);
    }

    protected createViewer()
    {
        this.$nextTick(() =>
        {
            if (this.viewerIns)
            {
                this.viewerIns.destroy();
                this.viewerIns = null;
            }
            let el = (this.$refs["mediaList"] as any);
            let viewerIns = new Viewer(el);
            this.viewerIns = viewerIns;
        });
        
    }

    @watch("value", {immediate: true})
    protected valueWatcher(val: Array<any>)
    {
        if (Array.isArray(val))
        {
            this.valueCopy = JSON.parse(JSON.stringify(val));
        }
    }

    @watch("valueCopy", {immediate: true})
    protected valueCopyWatcher()
    {
        setTimeout(() =>
        {
            this.createViewer();
        }, 1500);
    }

    @watch("watermarkLogoUrl", {immediate: true})
    protected logoWatcher(urlPath: string)
    {
        if (urlPath)
        {
            let logo = new Image();
            logo.src = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + urlPath;
            console.time("water");
            logo.onload = () =>
            {
                this.logoImg = logo;
                console.timeEnd("water");
            };
        }
        else
        {
            let watermarkLogo = require("../../../assets/water_marker_logo.png");
            let logo = new Image();
            logo.src = watermarkLogo;
            this.logoImg = logo;
        }
    }

    // protected created()
    // {
    //     let watermarkLogo = require("../../../assets/water_marker_logo.png");
    //     let logo = new Image();
    //     logo.src = watermarkLogo;
    //     this.logoImg = logo;
    // }

    private checkFileTypeValid(fileName: string): boolean
    {
        let result = false;
        let acceptTypeList = [".mp4", ".jpg", ".png"];

        acceptTypeList.forEach(item =>
        {
            if (fileName.indexOf(item) > 0)
            {
                result = true;
            }
        });

        return result;
    }

    private async drawWatermark(file: File, payload: any)
    {
        let p = new Promise((resolve: any) =>
        {
            let logo = this.logoImg;
            console.log("draw", logo.src);
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let reader = new FileReader();
            let bg = new Image();
            reader.readAsDataURL(file);
            reader.onload = function(e)
            {
                bg.src = <string>e.target.result;
            };
            bg.onload = function()
            {
                let titleText = "项目名称";
                let timeText = "时间：2023-01-03 10:15";
                let addrText = "项目地址";
                if (payload)
                {
                    titleText = payload.projectManager.projectName;
                    addrText = `地址：${payload.projectManager.projectAddress}`;
                    timeText = "时间：" + dayjs().format("YYYY-MM-DD HH:mm");
                }
                let width = bg.width;
                let height = bg.height;
                canvas.width = width;
                canvas.height = height;
                let waterWidth = width * 0.4;
                let logoWidth = waterWidth * 0.4;
                let logoHeight = logoWidth * 0.65;
                let fontSize = 18;
                let titleWidth = waterWidth - logoWidth;
                if (titleWidth < 220)
                {
                    titleWidth = 220;
                }
                let titleHeight = logoWidth - 40;
                let timeWidth = titleWidth;
                let timeHeight = 40;

                if (width > 800)
                {
                    timeHeight = Math.floor(titleWidth / 6);
                    titleHeight = logoWidth - timeHeight;
                    fontSize = timeHeight / 2;
                }

                // 地址
                let addrWidth = logoWidth + titleWidth;
                let addrHeight = 0;
                let addrTextWidth = 0;
                let addrTextArr = [];
                let addrTextStartPoint = 0;
                ctx.font = `${fontSize}px serif`;
                for (let i = 0; i < addrText.length; i++)
                {
                    addrTextWidth += ctx.measureText(addrText[i]).width;
                    if (addrTextWidth > (addrWidth - 20))
                    {
                        addrTextArr.push(addrText.substring(addrTextStartPoint, i));
                        addrTextWidth = 0;
                        addrTextStartPoint = i;
                    }
                    if (i === addrText.length - 1)
                    {
                        addrTextArr.push(addrText.substring(addrTextStartPoint, i + 1));
                    }
                }
                let addrHeightStep = fontSize;
                let addrTextTotalHeight = fontSize * addrTextArr.length;
                addrHeight = addrTextTotalHeight + fontSize * 0.4;

                let watermarkLeft = 10;
                let watermarkTop = height - 10 - logoWidth - addrHeight;

                // 底图
                ctx.drawImage(bg, 0, 0);
                // logo容器
                ctx.fillStyle = "rgba(255,255,255,0.68)";
                ctx.fillRect(watermarkLeft, watermarkTop, logoWidth, logoWidth);
                // 项目名称
                ctx.fillStyle = "rgba(99,145,227,0.75)";
                ctx.fillRect(watermarkLeft + logoWidth, watermarkTop, titleWidth, titleHeight);
                // 时间
                ctx.fillStyle = "rgba(62,141,255,0.75)";
                ctx.fillRect(watermarkLeft + logoWidth, watermarkTop + titleHeight, timeWidth, timeHeight);
                // 地址栏
                ctx.fillStyle = "rgba(255,255,255,0.68)";
                ctx.fillRect(watermarkLeft, watermarkTop + logoWidth, addrWidth, addrHeight);

                // 项目名称
                ctx.font = `${fontSize}px serif`;
                ctx.fillStyle = "#ffffff";
                // 项目名称 step1 计算要分几行展示
                let titleTextWidth = 0;
                let textArr = [];
                let textStartPoint = 0;
                for (let i = 0; i < titleText.length; i++)
                {
                    titleTextWidth += ctx.measureText(titleText[i]).width;
                    if (titleTextWidth > (titleWidth - 20))
                    {
                        textArr.push(titleText.substring(textStartPoint, i));
                        titleTextWidth = 0;
                        textStartPoint = i;
                    }
                    if (i === titleText.length - 1)
                    {
                        textArr.push(titleText.substring(textStartPoint, i + 1));
                    }
                }
                let titleHeightStep = fontSize;
                let titleTextTotalHeight = fontSize * textArr.length;
                let initTitleTextHeight = (titleHeight - titleTextTotalHeight) / 2 + fontSize + watermarkTop;
                // 项目名称 step2 绘制每一行
                textArr.forEach((item, i) =>
                {
                    ctx.fillText(item, watermarkLeft + logoWidth + 5, initTitleTextHeight + titleHeightStep * i);
                });
                // 时间
                ctx.fillText(timeText, watermarkLeft + logoWidth + 5, watermarkTop + titleHeight + timeHeight / 2 + fontSize * 0.4);
                // logo
                ctx.drawImage(logo, watermarkLeft, watermarkTop + (logoWidth - logoHeight) / 2, logoWidth, logoHeight);
                // 地址文字
                ctx.fillStyle = "rgba(69,74,78,1)";
                let initAddrTextHeight = logoWidth + watermarkTop + fontSize;
                addrTextArr.forEach((item, i) =>
                {
                    ctx.fillText(item, watermarkLeft + 5, initAddrTextHeight + addrHeightStep * i);
                });

                canvas.toBlob(function(e)
                {
                    resolve(e);
                }, "image/png", 1);
            };
        });
        return p;
    }
}
</script>

<style lang="less" scoped>
.ux-image-upload-component
{
    .upload-image-list
    {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .iconplus
    {
        font-size: 25px;
        color: @placeholder;
        font-weight: 400;
    }
    .delete-img
    {
    }
    .view-img
    {
        margin-right: 10px;
    }
    .upload-image-item
    {
        width: 76px;
        height: 76px;
        overflow: hidden;
        position: relative;
        margin: 5px;

        &:hover
        {
            .upload-upload-list-cover
            {
                display: flex;
            }
        }
    }
    .watermark-switch
    {
        display: flex;
        align-items: center;
    }

    .upload-image-image,
    .upload-upload-list-cover
    {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        // line-height: 180px;
    }

    .upload-upload-list-cover
    {
        display: none;
        background-color: rgba(0, 0, 0, .3)
    }

    .upload-image-image
    {
        // background-position: center center;
        // background-size: cover;
        // background-color: #fff;
        .img
        {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .upload-button
    {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        font-weight: bold;
        width: 76px;
        height: 76px;
        color: #838D9C;
        border: 1px solid #ECECEC;
        border-radius: 2px;
        background-color: #fff;
        cursor: pointer;
    }
    .upload-button:hover
    {
        border-color: darken(#ECECEC, 20%);
    }
}
</style>