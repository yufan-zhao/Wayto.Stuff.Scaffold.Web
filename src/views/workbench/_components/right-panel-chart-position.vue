<template>
    <div class="chart-ins">
        <div v-if="chartData.length > 0">
            <u-pie-chart :data="chartOptionData" :wH="[388,200]" :graphic="chartGraphic1" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
        </div>
        <u-nodata v-else></u-nodata>
    </div>
</template>

<script lang="ts">
import { component, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class RightPanelChartPosition extends CommonView
{
    @config({required: true, default: () => [], type: Array})
    protected chartData: Array<any>;

    protected chartOptionData: Array<any> = [];

    protected chartOptionSum: number = 0;

    protected get chartGraphic1(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  this.chartOptionSum,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "53%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "在岗离岗",
                    font: " 14px Microsoft YaHei"
                }
            }
        ];
    }

    @watch("chartData", {immediate: true})
    protected chartDataWatcher(val: Array<any>)
    {
        this.chartOptionData.splice(0);
        this.chartOptionSum = 0;

        if (val.length > 0)
        {
            val.forEach(item =>
            {
                this.chartOptionData.push({
                    name: item.jobSituation === 1 ? "在岗" : "离岗",
                    value: item.situationCount
                });
                this.chartOptionSum = item.situationSum;
            });
        }
    }
}
</script>

<style lang="less" scoped>
.chart-ins
{
    height: calc(100% - 24px);
}
</style>