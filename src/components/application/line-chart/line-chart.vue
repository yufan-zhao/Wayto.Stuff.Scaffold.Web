<template>
    <div class="pie-chart" ref="chartBox">
        
        <fw-echarts :width="wH[0]" :height="wH[1]"  :options="options"></fw-echarts>
    </div>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";

@component
export default class BarChart extends Component
{
    /**
     * 是否显示Legend
     * @protected
     * @prop
     * @type {any}
     */
    @config({type: Boolean, default: false})
    protected showLegend: boolean;

    /**
     * 是否显示Legend
     * @protected
     * @prop
     * @type {any}
     */
    @config({type: Array, default: [180,140]})
    protected wH: number;

    /**
     * 是否显示指导线
     * @protected
     * @prop
     * @type {any}
     */
    @config({type: Boolean, default: true})
    protected showLine: boolean;

    /**
     * 数据源
     * @protected
     * @prop
     * @type {any}
     */
    @config({required: true, type: Array,default: () => []})
    protected data: any;

    /**
     * 数据源
     * @protected
     * @prop
     * @type {any}
     */
    @config({required: false, type: Array,default: () => ["Mon", "Tue", "Wed"]})
    protected xAxis: any;

    /**
     * 数据源
     * @protected
     * @prop
     * @type {any}
     */
    @config({required: false, type: Array})
    protected graphic: any;

    /**
     * 饼图大小
     * @protected
     * @prop
     * @type {any}
     */
    @config({required: false, type: Array})
    protected radius: Array<string>;

    /**
     * 颜色值
     * @protected
     * @prop
     * @type {any}
     */
    @config({required: false,type: Array, default: () => ["#4B7EFE", "#23C38C", "#A6937C", "#4FCF66", "#FEC400", "#8265FE", "#EC6941", "#0DD0C5", "#5B6378", "#89C997"]})
    protected colors: any;

    /**
     * 设置图表的配置。
     * @member
     * @protected
     * @type {any}
     */
    protected get options(): any
    {
        return {
            
            tooltip: {
                trigger: "axis"
            },
            legend: {
                left: "center",
                // bottom: 0,
                // show: this.showLegend,
                // itemWidth: 20,
                // itemHeight: 3,
                // icon: "circle",
                data: this.xAxis || []
            },
            grid: {
                left: "30px",
                right: "30px",
                bottom: "15px",
                top: "15px",
                containLabel: true
            },
            toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
            },
            xAxis: {
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 0,
                    interval: 0,
                    color: "#5D6673",
                    textStyle: {
                    fontSize: "14px"
                    }
                },
                type: "category",
                boundaryGap: false,
                data: this.xAxis
            },
            yAxis: {
                type: "value",
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: "#A6ABB5"
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                    color: "#F2F4F6"
                    }
                }
            },
            series: [
                {
                    name: "",
                    type: "line",
                    // stack: 'Total',
                    data: this.data || []
                }
            ]
        };
    }

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

    // @watch("data",{immediate: true,deep: true})
    // protected dataChange(val)
    // {
    //     
        
        // this.options.series = [];

        // val && val.forEach(ele => {
        //     this.options.series.push({
        //             // name: "Email",
        //             type: "line",
        //             stack: "Total",
        //             data: this.data || []
        //         })
        // });

        // 
        
    // }

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
            { width, height } = chartBox && chartBox.getBoundingClientRect() || { width: 0, height: 0 };

        this.chartWidth = width;
        this.chartHeight = height;
    }

    /**
     * 当视图模型发生变动时调用。
     * @param  {any} model
     * @returns void
     */
    @watch("data", { deep: true, immediate: true })
    protected onModelChange(model: any): void
    {
        this.updateModel(model);
    }

    /**
     * 颜色。
     * @param  {any} model
     * @returns void
     */
    @watch("colors", { deep: true, immediate: true })
    protected onColorChange(value: any): void
    {
       this.options.color = value;
    }

    /**
     * 更新视图模型。
     * @returns void
     */
    protected updateModel(data: any): void
    {
        // this.options.series[0].data = data;
        this.options.series = [];

        this.data[0] && this.data.forEach(ele => {
            
            this.options.series.push({
                    // name: "Email",
                type: ele.type,
                stack: "Total",
                data: ele.data || []
            });
        });

    }

}
</script>
<style lang="less" scoped>
    @import "./style.less";
</style>
