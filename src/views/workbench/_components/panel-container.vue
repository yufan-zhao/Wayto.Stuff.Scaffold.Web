<template>
    <div class="workbench-panel-container" :style="styles">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { component, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class WorkbenchPanelContainer extends CommonView
{
    /**
     * 设计稿中的面板宽度，单位px
     * @config
     */
    @config({required: true, type: Number, default: 0})
    protected width: number;

    /**
     * 设计稿中的面板高度，单位px
     * @config
     */
    @config({required: true, type: Number, default: 0})
    protected height: number;

    /**
     * 设计稿的面板距离顶部距离，单位px
     * @config
     */
    @config({required: false, type: Number})
    protected top: number;

    /**
     * 设计稿中的面板距离左侧菜单的距离，单位px
     * @config
     */
    @config({required: false, type: Number})
    protected left: number;

    /**
     * 设计稿中的面板距离右侧菜单的距离，单位px
     * @config
     */
    @config({required: false, type: Number})
    protected right: number;

    /**
     * 是否高度和宽度一致
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected square: boolean;

    /**
     * 是否隐藏面板
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected hide: boolean;

    /**
     * 动态样式
     */
    protected styles: any = {};

    protected panelStyle: any = {};

    @watch("hide", {immediate: true})
    protected hideWatcher(val: boolean)
    {
        this.setPanelStatus(val);
    }

    protected created()
    {
        this.calcPanelPosition();
        // TODO 页面resize时再次调用计算方法
    }

    private setPanelStatus(hide: boolean)
    {
        if (hide)
        {
            if (typeof this.left === "number")
            {
                this.$set(this.styles, "transform", `translateX(-${this.panelStyle.left + this.panelStyle.width + 1}px)`);
            }
            else if (typeof this.right === "number")
            {
                this.$set(this.styles, "transform", `translateX(${this.panelStyle.right + this.panelStyle.width + 1}px)`);
            }
        }
        else
        {
            this.$set(this.styles, "transform", "translateX(0)");
        }
        // console.log(this.styles);
    }

    private calcPanelPosition()
    {
        let designHeight = 1080;
        let designWidth = 1920 - 192; // 这里要考虑左侧菜单永远是192px

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth - 192; // 这里要考虑左侧菜单永远是192px

        let panelHeight = (this.height * windowHeight / designHeight).toFixed(2);
        let panelWidth = (this.width * windowWidth / designWidth).toFixed(2);

        if (this.square)
        {
            this.styles =
            {
                width: this.width + "px",
                height: this.height + "px"
            };
        }
        else
        {
            this.styles =
            {
                width: panelWidth + "px",
                height: panelHeight + "px"
            };
        }
        
        this.panelStyle.width = Number(panelWidth);
        this.panelStyle.height = Number(this.square ? panelWidth : panelHeight);

        if (typeof this.top === "number")
        {
            let panelTop = (this.top * windowHeight / designHeight).toFixed(2);
            this.styles.top = panelTop + "px";
        }
        if (typeof this.left === "number")
        {
            this.panelStyle.left = this.left * windowWidth / designWidth;
            let panelLeft = this.panelStyle.left.toFixed(2);
            this.styles.left = panelLeft + "px";
        }
        if (typeof this.right === "number")
        {
            this.panelStyle.right = this.right * windowWidth / designWidth;
            let panelLeft = ((designWidth - this.right - this.width) * windowWidth / designWidth).toFixed(2);
            this.styles.left = panelLeft + "px";
        }
    }
}
</script>

<style lang="less" scoped>
.workbench-panel-container
{
    position: absolute;
    transition: transform ease-in-out 0.3s;
}
</style>