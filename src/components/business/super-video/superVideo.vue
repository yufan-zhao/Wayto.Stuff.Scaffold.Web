<template>
    <div class="v-super-video" v-show="status.isShow">
        <i-icon class="video-play" type="ios-videocam"></i-icon>
        <video ref="video" :src="status.src" controls @dblclick="dblClickHandler"></video>
        <i-icon class="video-close" type="ios-close-circle-outline" title="关闭" @click="reset"></i-icon>
    </div>
</template>
<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
@component
export default class SuperVideo extends View
{
    /**
     * v-model 控制显示隐藏
     */
    @config({ required: false, type: Boolean, default: false })
    protected value: boolean;

    /**
     * 视频地址
     */
    @config({ required: false, type: String, default: "" })
    protected src: string;

    /**
     * 视频状态
     */
    protected status =
    {
        isShow: false,
        src: undefined
    };

    /**
     * 视频双击事件处理函数
     */
    protected dblClickHandler(e): void
    {
        const video = e.target as any;
        video.isFullScreen = false; // 自定义全屏状态
        video.requestFullscreen(); // 触发全屏

        const handler = ({ target: video }) =>
        {
            const next = !video.isFullScreen;
            video.isFullScreen = next; // 更新全屏状态
            if (next)
            {
                // 全屏播放
                video.play();
            }
            else
            {
                // 收起暂停
                video.pause();
                video.removeEventListener("fullscreenchange", handler);
            }
        };
        video.addEventListener("fullscreenchange", handler, false);
    }

    /**
     * 重置
     */
    protected reset(): void
    {
        const video = this.$refs.video as any;
        video.pause();

        this.status.isShow = false;
        this.status.src = undefined;
        this.$emit("input", false);
    }

    /**
     * 补全路径
     */
    protected repairPath(filePath: string): string
    {
        if (!filePath || filePath.includes("http"))
        {
            return filePath;
        }
        else
        {
            const base = (window as any).waytoSetting.apiServer;
            return base + filePath;
        }
    }

    /**
     * 监听src变化
     */
    @watch("src", { deep: true, immediate: true })
    protected onSrcChange(next: string): void
    {
        // console.log(next);
        
        this.status.src = next;

        if (next)
        {
            const video = this.$refs.video as any;
            this.$nextTick(() =>
            {
                video.play();
            });
        }
    }

    /**
     * 监听value变化
     */
    @watch("value", { deep: true, immediate: true })
    protected onValueChange(next: boolean): void
    {
        this.status.isShow = next;
    }
}
</script>
<style lang="less" scoped>
.v-super-video
{
    position: fixed;
    z-index: 999;
    right: 6%;
    bottom: 10%;
    width: 360px;
    height: 200px;
    box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.5);

    video
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 200px;
        object-fit: contain;
        background-color: #000;
    }

    .video-play
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        pointer-events: none;
        color: #fff;
    }

    .video-close
    {
        position: absolute;
        z-index: 10;
        right: -24px;
        top: -24px;
        font-size: 24px;
        font-weight: 900;
        transition: transform 0.4s;
        cursor: pointer;
        color: #000;

        &:hover
        {
            transition: transform 0.4s;
            transform: rotate(180deg);
        }
    }
}
</style>
