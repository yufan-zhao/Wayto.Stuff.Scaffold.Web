<template>
    <div class="table-media-component">
        <div class="media-list" :style="containerStyle" v-previewer v-if="Array.isArray(dataCopy) && dataCopy.length > 0">
            <!-- <span class="pic-item" v-for="(item, i) in row.commonFileList" :key="i">
                <img :src="'/serverApi' + item.filePath" />
            </span> -->

            <template v-for="(item, i) in dataCopy">
                <div class="pic-item" :key="i" v-if="checkSuffix(['jpg', 'jpeg', 'png'], getSuffix(item.filePath))">
                    <img :src="'/serverApi' + item.filePath" :style="sizeStyle" />
                </div>
                <div class="video-item" :key="i" v-else-if="checkSuffix(['mp4'], getSuffix(item.filePath))">
                    <video class="video-container" :src="'/serverApi' + item.filePath" @click="onVideoClick(item)" :style="sizeStyle"></video>
                </div>
            </template>
        </div>
        <div class="no-data" v-else>-</div>

        <b-super-video v-model="superVideo.isShow" :src="superVideo.src"></b-super-video>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";

/**
 * iview表格中的多媒体文件展示列组件，支持图片和视频的展示
 * @config size 尺寸（长x宽），默认64*64(px)
 * @config data 多媒体文件，默认空数组
 */
@component
export default class TableMediaComponent extends View
{
    /**
     * 多媒体展示尺寸
     * @config
     */
    @config({required: false, type: Array, default: () => [64, 64]})
    protected size: [number, number];

    /**
     * 文件列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

    /**
     * 媒体是否居中，默认否
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected alignCenter: boolean;

    /**
     * 数据源副本
     * @property
     */
    protected dataCopy: Array<any> = [];

    /**
     * 公共视频框状态
     */
    protected superVideo =
    {
        isShow: false,
        src: ""
    };

    protected get containerStyle()
    {
        return {
            "justify-content": this.alignCenter ? "center" : "inherit"
        };
    }

    protected get sizeStyle()
    {
        return {
            width: this.size[0] + "px",
            height: this.size[1] + "px"
        };
    }

    protected onVideoClick(item: any)
    {
        this.$set(this.superVideo, "isShow", true);
        this.$set(this.superVideo, "src", "/serverApi" + item.filePath);
        // console.log(this.superVideo.src);
    }

    /**
     * 文件后缀检测方法
     * @protected
     */
    protected checkSuffix(suffix: string | Array<string>, targetSuffix: string)
    {
        if (typeof suffix === "string")
        {
            return suffix === targetSuffix;
        }
        else if (Array.isArray(suffix))
        {
            let result = false;
            for (let i = 0; i < suffix.length; i++)
            {
                let item = suffix[i];
                if (item === targetSuffix)
                {
                    result = true;
                    break;
                }
            }
            return result;
        }
    }

    /**
     * 获取文件路径的后缀
     * @protected
     */
    protected getSuffix(filePath: string)
    {
        return filePath ? filePath.split(".").pop() : "";
    }

    /**
     * 监听数据源
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        this.dataCopy.splice(0);
        this.dataCopy.push(...JSON.parse(JSON.stringify(val)));
    }
}
</script>

<style lang="less" scoped>
.table-media-component
{
    .media-list
    {
        display: flex;
        flex-wrap: wrap;

        .pic-item
        {
            flex: 0 0 auto;
            padding: 5px;

            img
            {
                // width: 76px;
                // height: 76px;
                object-fit: cover;
            }
        }

        .video-item
        {
            flex: 0 0 auto;
            padding: 5px;

            .video-container
            {
                cursor: pointer;
            }
        }
    }
}
</style>