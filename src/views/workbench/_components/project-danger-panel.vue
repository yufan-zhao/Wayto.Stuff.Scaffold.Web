<template>
    <div class="project-danger-panel common-panel">
        <div class="header">
            <span class="title">
                <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                <span class="label">隐患统计</span>
            </span>
            <div class="extra">
                <ux-tab-btns
                    :data="btnLabels"
                    @on-change="onTabChange"
                ></ux-tab-btns>
            </div>
        </div>

        <div class="content">
            <div class="type-tap">
                <p :class="showHiddenType === 1 ? 'active' : ''" @click="changeTabs(1,'showHiddenType')">闭合情况</p>
                <p :class="showHiddenType === 2 ? 'active' : ''" @click="changeTabs(2,'showHiddenType')">体系分类</p>
            </div>
            <fw-echarts :width="388" :height="200" :options="options"></fw-echarts>
            <!-- <u-pie-chart :data="hiddenTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart> -->
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService } from "src/services";
import { service } from "src/common/decorator";
import dayjs from "dayjs";

@component
export default class ProjectDangerPanel extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    @config({required: false})
    protected customerId: number;

    protected btnLabels = ["全部", "近一周", "近一月", "近一年"];

    protected timeRange =
    [
        {startDate: null,endDate: ""},
        {startDate:  dayjs().subtract(1,"week").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate:  dayjs().subtract(1,"month").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate:  dayjs().subtract(1,"year").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")}
    ];

    protected showHiddenTime: number = 1; // 隐患时间 切换
    protected showHiddenType: number = 1; // 隐患类型 切换

    protected projectTypeData: Array<any> = [{value: 15, name: "市政",ename: "市政"},{value: 15, name: "消防",ename: "消防"}];
    protected hiddenTypeData = [];

    protected options: any =
    {
        color: ["#4B7EFE", "#23C38C", "#A6937C", "#4FCF66", "#FEC400", "#8265FE", "#EC6941", "#0DD0C5", "#5B6378", "#89C997"],
        tooltip:
        {
            trigger: "item"
        },
        // grid:
        // {
        //     top: "10%"
        // },
        legend:
        {
            type: "scroll",
            orient: "vertical",
            right: 10,
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
                left: "24%", // 相对父元素居中
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
                data: this.hiddenTypeData,
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

    protected get hiddenGraphic(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  117,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "53%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "隐患总数",
                    font: " 14px Microsoft YaHei"
                }
            }
        ];
    }

    protected onTabChange(i: number)
    {
        this.showHiddenTime = i + 1;

        this.getWorkbenchHazardCountList();
    }

    protected changeTabs(num,name)
    {
        this[name] = num;

        switch (name) {
            case "showHiddenType":
                this.getWorkbenchHazardCountList();
                break;
            case "showHiddenTime":
                this.getWorkbenchHazardCountList();
            default:
                break;
        }
    }

    // protected created()
    // {
    //     this.getWorkbenchHazardCountList();
    // }
    @watch("customerId", {immediate: false})
    protected customerIdWatcher(val: number | undefined)
    {
        this.getWorkbenchHazardCountList();
    }

    // 隐患统计
    protected async getWorkbenchHazardCountList()
    {
        this.hiddenTypeData = [];
        this.options.series[0].data = [];
        this.options.graphic[0].style.text = 0;
        this.hiddenGraphic[0].style.text = 0;
        if(this.showHiddenType === 1)
        {
            let statas = ["待整改","待闭合","已闭合","已闭合"];
            let content = await this.workbenchService.getWorkbenchHazardCountList({
                ...(this.timeRange[this.showHiddenTime - 1]),
                customerId: this.customerId
            });
            if (content.length > 0)
            {
                this.options.graphic[0].style.text = content[0].hazardSum || 0;
                this.resovleTextLeft(content[0].hazardSum);
                content.forEach(ele => {
                    this.hiddenTypeData.push({value: ele.hazardCount, name: statas[ele.mendStatus],ename: statas[ele.mendStatus]});
                    this.options.series[0].data.push({value: ele.hazardCount, name: statas[ele.mendStatus],ename: statas[ele.mendStatus]});
                });
            }
            else
            {
                this.options.graphic[0].style.text = 0;
            }
        }
        else
        {
            let typeContent = await this.workbenchService.getDangerByCustomerDeptId({
                day: this.timeRange[this.showHiddenTime - 1].startDate,
                customerDepId: this.customerId
            });
            // this.hiddenGraphic[0].style.text = content[0].hazardSum || 0;
            
            typeContent.forEach(ele => {
                this.options.graphic[0].style.text += ele.count;
                this.hiddenTypeData.push({value: ele.count, name: ele.name,ename: ele.name});
                this.options.series[0].data.push({value: ele.count, name: ele.name,ename: ele.name});
            });
            this.resovleTextLeft(this.options.graphic[0].style.text);
        }
        
    }

    private resovleTextLeft(num: number)
    {
        if (num < 10)
        {
            this.options.graphic[0].left = "27%";
        }
        else if (num < 100)
        {
            this.options.graphic[0].left = "26%";
        }
        else if (num < 1000)
        {
            this.options.graphic[0].left = "24%";
        }
        else
        {
            this.options.graphic[0].left = "23%";
        }
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
        position: relative;
        
        .type-tap
        {
            position: absolute;
            top: 5px;
            left: 0px;
            z-index: 50;
            // border: 1px solid #E7E8EC;
            width: 148px;
            border-right: none;
            margin-top: 10px;
            margin-left: 20px;
            display: flex;
            background-color: #fff;
            p
            {
                width: 80px;
                flex: 1;
                font-size: 14px;
                border: 1px solid #E7E8EC;
                cursor: pointer;
                text-align: center;
                &:nth-child(1){
                    border-radius: 4px 0 0 4px;

                }
                &:nth-child(2){
                    border-radius: 0px 4px 4px 0px;

                    
                }
                &:hover,
                &.active
                {
                    border: 1px solid #4B7EFE;
                    color: #4B7EFE;
                }
                
            }
        }
    }
}
</style>