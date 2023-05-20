<template>
    <div class="project-rectify-panel common-panel">
        <div class="header">
            <span class="title">
                <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                <span class="label">隐患分级</span>
            </span>
            <div class="extra">
            </div>
        </div>

        <div class="content">
            <fw-echarts :width="388" :height="200"  :options="options"></fw-echarts>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class ProjectRectifyPanel extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    @config({required: false})
    protected customerId: number;

    protected optionColors = ["#37C462", "#FF4D3F", "#FF9832", "#9686F3", "#0DD0C5"];
    protected optionsXAxis: any = []; // 项目诊治 - 横坐标数据
    protected optionsSeries: any = [];// 项目诊治 - 数据

    protected get options(): any
    {
        return {
            
            tooltip: {
                trigger: "axis"
            },
            legend: {
                left: "center",
                show: true,
                bottom: 0,
                // show: this.showLegend,
                // itemWidth: 20,
                // itemHeight: 3,
                icon: "circle"
                // data: this.optionsXAxis || []
            },
            grid: {
                left: "30px",
                right: "30px",
                bottom: "15%",
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
                // boundaryGap: false,
                data: this.optionsXAxis
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
            
            series: this.optionsSeries
        };
    }

    // 项目诊治
    protected async getHiddenDangerWorkbenchList()
    {
        let content = await this.workbenchService.getHiddenDangerWorkbenchList({
            params:
            {
                customerId: this.customerId
            }
        });
        
        let month = JSON.parse(JSON.stringify(content.hazardWorkRecordVoList)).map(item => item.month + "月");
        this.optionsXAxis = month;
        let lineData = JSON.parse(JSON.stringify(content.hazardWorkRecordVoList)).map(item => item.consultNum);
        let optionsseries = [];
        // console.log("???", content.hazardWorkRecordVoList);
        optionsseries.push(
        {
            name: "诊治次数",
            type: "line",
            // stack: 'Total',
            color: "#37C462",
            data:  lineData
        });
        let data = content.hazardWorkRecordVoList;

        data.forEach(item =>
        {
            item.level.forEach(ele =>
            {
                item[ele.hazardLevelName] = ele.hazardCount;
            });
        });
        data[0].level.forEach((item,i) =>
        {
            optionsseries.push(
            {
                name: item.hazardLevelName,
                type: "bar",
                stack: "Total",
                stackStrategy: "all",
                color: this.optionColors[i + 1],
                data: data.map(ele => ele[item.hazardLevelName]),
                barWidth: "40%"
            });
        });
        
        this.optionsSeries = optionsseries;
    }

    protected created()
    {
        this.getHiddenDangerWorkbenchList();
    }

    @watch("customerId", {immediate: false})
    protected customerIdWatcher(val: number | undefined)
    {
        this.getHiddenDangerWorkbenchList();
    }
}
</script>

<style lang="less" scoped>
.common-panel
{
    display: flex;
    flex-direction: column;

    .header
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 53px;
        padding-left: 17px;
        padding-right: 22px;
        border-bottom: 1px solid #E7E8EC;

        .title
        {
            .statis-item-icon
            {
                height: 16px;
                width: 16px;
                margin-right: 8px;
                transform: translateY(2px);
            }
            .label
            {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    .content
    {

    }
}
</style>