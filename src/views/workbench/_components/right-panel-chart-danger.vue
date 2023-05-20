<template>
    <div class="chart-ins">
        <div v-if="chartOptionData.length > 0">
            <fw-echarts :width="388" :height="200" :options="options"></fw-echarts>
        </div>
        <u-nodata v-else></u-nodata>
    </div>
</template>

<script lang="ts">
import { component, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class RightPanelChartDanger extends CommonView
{
    @config({required: true, default: () => [], type: Array})
    protected chartData: Array<any>;

    protected chartOptionData: Array<any> = [];

    protected chartOptionSum: number = 0;

    protected options: any =
    {
        color: ["#4B7EFE", "#23C38C", "#A6937C", "#4FCF66", "#FEC400", "#8265FE", "#EC6941", "#0DD0C5", "#5B6378", "#89C997"],
        tooltip:
        {
            trigger: "item"
        },
        grid:
        {
            // right: 170
        },
        legend:
        {
            type: "scroll",
            orient: "vertical",
            right: 50,
            top: "30%",
            bottom: 20,
            itemWidth: 12,
            itemHeight: 12,
            icon: "circle"
        },
        graphic:
        [
            {
                type: "text",
                left: "28%", // 相对父元素居中
                top: "50%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  0,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "23%", // 相对父元素居中
                top: "62%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "隐患总数",
                    font: " 14px Microsoft YaHei"
                }
            }
        ],
        series:
        [
            {
                type: "pie",
                radius: ["40%", "55%"],
                center: ["30%", "58%"],
                data: [],
                label: {
                    show: false,
                    position: "center"
                },
                labelLine:
                {
                    show: false
                },
                itemStyle:
                {
                    normal:
                    {
                        borderWidth: 2,
                        borderColor: "#ffffff"
                    },
                    emphasis:
                    {
                        borderWidth: 0,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                },
                avoidLabelOverlap: false,
                emphasis: {
                    itemStyle:
                    {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    };

    @watch("chartData", {immediate: true})
    protected chartDataWatcher(val: Array<any>)
    {
        this.chartOptionSum = 0;
        this.chartOptionData.splice(0);
        this.options.series[0].data.splice(0);

        if (val.length > 0)
        {
            let results = val.map(item =>
            {
                this.chartOptionSum += item.count;
                return {
                    name: item.name,
                    value: item.count
                };
            });
            this.chartOptionData.push(...results);
            this.options.graphic[0].style.text = this.chartOptionSum;
            this.options.series[0].data.push(...this.chartOptionData);
            this.resovleTextLeft(this.chartOptionSum);
        }
    }

    private resovleTextLeft(num: number)
    {
        if (num < 10)
        {
            this.options.graphic[0].left = "28%";
        }
        else if (num < 100)
        {
            this.options.graphic[0].left = "27%";
        }
        else if (num < 1000)
        {
            this.options.graphic[0].left = "26%";
        }
        else
        {
            this.options.graphic[0].left = "25%";
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