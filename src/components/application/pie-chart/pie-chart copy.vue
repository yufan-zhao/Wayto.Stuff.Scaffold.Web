<template>
    <div class="pie-chart" ref="chartBox">
        <fw-echarts :width="chartWidth" :height="chartHeight"  :options="options"></fw-echarts>
    </div>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-web";

@component
export default class BarChart extends Component
{
    // /**
    //  * 颜色值
    //  * @protected
    //  * @prop
    //  * @type {any}
    //  */
    // @config({type: Array, default: ["#4B7EFE", "#23C38C", "#A6937C", "#4FCF66", "#FEC400", "#8265FE", "#EC6941", "#0DD0C5", "#5B6378", "#89C997"]})
    // protected colors: any;

    @config({type: Object, default: () => ({})})
    protected options: any;
    
    /**
     * echarts图表宽度。
     * @protected
     * @member
     * @type {number}
     */
    protected chartWidth: number = 0;

    /**
     * echarts图表高度。
     * @protected
     * @member
     * @type {number}
     */
    protected chartHeight: number = 0;

    /**
     * 组件创建完成后的钩子。
     * @protected
     * @returns {void}
     */
    protected created(): void
    {
       // 响应式图表。
        this.$nextTick(() =>
        {
            this.responseSize();

            window.addEventListener("resize", this.responseSize.bind(this));

            // 组件销毁前移除事件
            this.$once("hook:beforeDestroy", () =>
            {
                window.removeEventListener("resize", this.responseSize.bind(this));
            });
        });
    }

    /**
     * 响应式图表。
     * @protected
     * @returns {void}
     */
    protected responseSize(): void
    {
        const
            chartBox = (this.$refs.chartBox as any),
            { width, height } = chartBox && chartBox.getBoundingClientRect() || { width: 600, height: 350 };

        this.chartWidth = width;
        this.chartHeight = height;
        // 
        // 
        
    }

    /**
     * 当视图模型发生变动时调用。
     * @param  {any} model
     * @returns void
     */
    @watch("options", { deep: true, immediate: true })
    protected onModelChange(model: any): void
    {
        this.responseSize();
        // this.updateModel(model);
    }

    // /**
    //  * 颜色。
    //  * @param  {any} model
    //  * @returns void
    //  */
    // @watch("colors", { deep: true, immediate: true })
    // protected onColorChange(value: any): void
    // {
    //    this.options.color = value;
    // }

    // /**
    //  * 更新视图模型。
    //  * @returns void
    //  */
    // protected updateModel(data: any): void
    // {
    //     this.options.series[0].data = data;
    // }

}
</script>
<style lang="less" scoped>
    @import "./style.less";
</style>
