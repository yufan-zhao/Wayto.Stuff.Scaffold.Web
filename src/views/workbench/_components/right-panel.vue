<template>
    <div class="statis-right" v-if="specialTypeList.length > 0">
        <!-- <section class="statis-right-tabs">
            <div
                class="statis-right-tabs-btn"
                v-for="(item, i) in specialTypeList"
                :key="i"
                :class="{active: specialTypeIndex === i}"
                @click="onSpecialTypeChange(i)"
            >
                <span>{{item.name}}</span>
            </div>
        </section> -->

        <section class="statis-wrap">
            <div class="statis-right-content">
                <!-- <ux-tab-btns
                    :data="btnLabels"
                    @on-change="onTimeTabChange"
                ></ux-tab-btns> -->

                <i-select v-model="specialTypeIndex" @on-change="onSpecialTypeChange" style="width: 60%">
                    <i-option v-for="(item, i) in specialTypeList" :key="i" :value="i">{{item.name}}</i-option>
                </i-select>

                <i-select v-model="timeTabIndex" @on-change="onTimeTabChange" style="width: 35%">
                    <i-option v-for="(item, i) in btnLabels" :key="'time-range-' + i" :value="i">{{item}}</i-option>
                </i-select>
            </div>

            <div class="rank-tab-wrap">
                <i-tabs type="card">
                    <i-tab-pane label="项目排名情况" name="rank1">
                        <div class="rank-panel">
                            <div class="statis-item statis-item-1">
                                <!-- <div class="statis-item-title d-f">
                                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                                    <h3>排名情况</h3>
                                </div> -->

                                <div>
                                    <div class="type-tap">
                                        <p :class="{active: rankTypeIndex === 0}" @click="onRankTypeChange(0)">施工单位 综合排名</p>
                                        <p :class="{active: rankTypeIndex === 1}" @click="onRankTypeChange(1)">监理单位 综合排名</p>
                                        <p :class="{active: rankTypeIndex === 2}" @click="onRankTypeChange(2)">代建单位 综合排名</p>
                                        <p :class="{active: rankTypeIndex === 3}" @click="onRankTypeChange(3)">项目综合 得分排名</p>
                                    </div>
                                    <i-table
                                        class="table-normal"
                                        highlight-row
                                        :data="rankData"
                                        :columns="unitColumuns"
                                        @on-row-click="onRankItemClick"
                                    ></i-table>
                                </div>
                            </div>
                            <div class="statis-item pt10">
                                <div class="statis-item-title d-f">
                                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                                    <h3>履职情况</h3>
                                </div>

                                <div v-if="chartData1.length > 0">
                                    <u-pie-chart :data="chartData1" :wH="[388,200]" :graphic="chartGraphic1" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                                </div>
                                <u-nodata v-else></u-nodata>
                            </div>

                            <div class="statis-item">
                                <div class="statis-item-title d-f">
                                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                                    <h3>隐患情况</h3>
                                </div>

                                <div v-if="chartData2.length > 0" style="height: 276px;">
                                    <!-- <u-pie-chart :data="chartData2" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart> -->
                                    <fw-echarts :width="388" :height="200" :options="chart2Options"></fw-echarts>
                                </div>
                                <u-nodata v-else></u-nodata>
                            </div>
                        </div>
                    </i-tab-pane>
                    <i-tab-pane label="单位排名情况" name="rank2">
                        <div class="type-tap">
                            <p :class="{active: unitRankTypeIndex === 0}" @click="onUnitRankTypeChange(0)">施工单位 综合排名</p>
                            <p :class="{active: unitRankTypeIndex === 1}" @click="onUnitRankTypeChange(1)">监理单位 综合排名</p>
                            <p :class="{active: unitRankTypeIndex === 2}" @click="onUnitRankTypeChange(2)">代建单位 综合排名</p>
                            <p :class="{active: unitRankTypeIndex === 3}" @click="onUnitRankTypeChange(3)">项目综合 得分排名</p>
                        </div>
                        <i-table
                            class="table-normal"
                            :data="unitRankData"
                            :columns="unitRankColumuns"
                        ></i-table>
                    </i-tab-pane>
                </i-tabs>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { component, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService } from "src/services";
import { service } from "src/common/decorator";
import dayjs from "dayjs";

@component
export default class RightPanel extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    /**
     * 客户id，默认进来是undefined
     * @config
     */
    @config({required: false})
    protected customerId: number;

    @config({required: false, default: () => []})
    protected colorList: Array<any>;

    /**
     * 时间按钮组的名字label
     * @property
     */
    protected btnLabels = ["全部", "近一周", "近一月","近三月","近半年", "近一年"];
    /**
     * 时间按钮对应关系
     * @property
     */
    protected timeRange =
    [
        {startDate: null,endDate: ""},
        {startDate: dayjs().subtract(1,"week").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(1,"month").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(3,"month").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(6,"month").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(1,"year").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")}
    ];

    /**
     * 体系类型tab索引
     * @property
     */
    protected specialTypeIndex: number = 0;
    /**
     * 时间范围按钮索引
     * @property
     */
    protected timeTabIndex: number = 0;
    /**
     * 排名类型按钮索引
     * @property
     */
    protected rankTypeIndex: number = 0;

    /**
     * 单位排名类型按钮索引
     * @property
     */
    protected unitRankTypeIndex: number = 0;

    /**
     * 体系类型列表
     * @property
     */
    protected specialTypeList: Array<any> = [];

    /**
     * 当前选中的体系类型索引
     * @property
     * @deprecated
     */
    protected currentSpecialTypeIndex: number = -1;

    /**
     * 红黑榜排名
     * @property
     */
    protected rankData: Array<any> = [];

    protected unitRankData = [];

    /**
     * 当前排名项选中索引
     * @property
     */
    protected currentRankItemIndex: number = -1;

    /**
     * 饼图数据
     * @protected
     * @member
     */
    protected projectTypeData: Array<any> = [{value: 15, name: "市政",ename: "市政"},{value: 15, name: "消防",ename: "消防"}];

    protected chartData1 = [];
    protected chartData2 = [];
    protected chartData1Sum = 0;
    protected chartData2Sum = 0;

    protected get chartGraphic1(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  this.chartData1Sum,
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

    protected get hiddenGraphic(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  this.chartData2Sum,
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

    protected chart2Options: any =
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

    protected get unitColumuns(): Array<any>
    {
        return [
            {
                title: "排名",
                width: 64,
                render: (h, {row,index}: any) =>
                {
                    let colors = ["#FF4D3F", "#FF9832", "#A533F4"];
                    let top = [require("src/assets/application/top1.png"),require("src/assets/application/top2.png"),require("src/assets/application/top3.png")];
                    // return h(
                    //     "div",
                    //     {
                    //         class: "statistics-num statistics-num-1"
                    //     },
                    //     [
                    //         index <= 3 ? h("img", {attr: {src: top[index]}}, "") : h("span",row.sort)
                    //     ]
                    // );
                    return h("span", row.sort);
                }
            },
            {
                title: this.rankTypeIndex === 3 ? "项目名称" : "单位名称",
                align: "left",
                render: (h, {row}: any) =>
                {
                    return h("div", row.name);
                }
            },
            {
                title: "得分",
                width: 90,
                render: (h, {row}: any) =>
                {
                    let color = this.getMarkerColor(this.colorList, row.score);
                    return h("div", {
                        style:
                        {
                            "color": color ? color : "#182334"
                        }
                    }, row.score);
                }
            }
            
        ];

    }

    protected get unitRankColumuns()
    {
        return [
            {
                title: "排名",
                key: "sort",
                width: 70
            },
            {
                title: this.unitRankTypeIndex === 3 ? "项目名称" : "单位名称",
                key: "name"
            },
            {
                title: "得分",
                width: 80,
                render: (h, {row}: any) =>
                {
                    let color = this.getMarkerColor(this.colorList, row.score);
                    return h("div", {
                        style:
                        {
                            "color": color ? color : "#182334"
                        }
                    }, row.score);
                }
            }
        ];
    }

    /**
     * 体系类型标签点击事件
     * @protected
     */
    protected onSpecialTypeChange(index: number)
    {
        this.getHHB();
        this.getTotalSpecialTypeData();

        this.chartData2 = [];
    }
    /**
     * 体系类型时间范围按钮索引变化事件
     * @protected
     */
    protected onTimeTabChange(i: number)
    {
        this.getHHB();
    }
    /**
     * 体系排名类型按钮索引变化事件
     * @protected
     */
    protected onRankTypeChange(i: number)
    {
        this.rankTypeIndex = i;
        this.getHHB();
    }

    protected onUnitRankTypeChange(i: number)
    {
        this.unitRankTypeIndex = i;
        this.getTotalSpecialTypeData();
    }

    /**
     * 排行项点击事件
     * @protected
     */
    protected onRankItemClick(item: any, i: number)
    {
        this.currentRankItemIndex = i;

        this.chartData1.splice(0);
        this.chartData2.splice(0);
        // 获取履职情况和隐患情况数据
        this.getLZQK();
        this.getYHQK();
    }

    protected getMarkerColor(colorList: Array<any>, score: number): string
    {
        let index = -1;
        for (let i = 0; i < colorList.length; i++)
        {
            let item = colorList[i];
            let scoreMinValue = item.scoreMinValue;
            let scoreMaxValue = item.scoreMaxValue;
            if (typeof scoreMinValue === "number" && typeof scoreMaxValue === "number" && scoreMinValue < scoreMaxValue)
            {
                if (scoreMinValue === 0)
                {
                    if (score >= scoreMinValue && score < scoreMaxValue)
                    {
                        index = i;
                        break;
                    }
                }
                if (scoreMaxValue === 100)
                {
                    if (score >= scoreMinValue && score <= scoreMaxValue)
                    {
                        index = i;
                        break;
                    }
                }
                if (score >= scoreMinValue && score < scoreMaxValue)
                {
                    index = i;
                    break;
                }
            }
        }
        if (index >= 0)
        {
            return colorList[index].colorStr;
        }
        else
        {
            return "";
        }
    }

    protected async getLZQK()
    {
        let params: any = {};
        params.customerId = this.customerId;
        if (this.rankTypeIndex === 0)
        {
            params.constructionId = this.rankData[this.currentRankItemIndex].id;
        }
        else if (this.rankTypeIndex === 2)
        {
            params.agencyId = this.rankData[this.currentRankItemIndex].id;
        }
        else if (this.rankTypeIndex === 3)
        {
            params.projectId = this.rankData[this.currentRankItemIndex].id;
        }
        else
        {
            params.unitId = this.rankData[this.currentRankItemIndex].id;
        }
        const res = await this.workbenchService.getPerformanceOfDutiesCount({
            params: params
        });

        res.forEach(item =>
        {
            this.chartData1.push({
                name: item.jobSituation === 1 ? "在岗" : "离岗",
                value: item.situationCount
            });
            this.chartData1Sum = item.situationSum;
        });
    }

    protected async getYHQK()
    {
        this.chart2Options.series[0].data.splice(0);
        this.chart2Options.graphic[0].style.text = 0;
        this.chartData2Sum = 0;
        // let type = 0;
        // if (this.rankTypeIndex === 0 || this.rankTypeIndex === 2)
        // {
        //     type = 0;
        // }
        // else
        // {
        //     type = 1;
        // }
        let type = this.rankTypeIndex;
        let res = await this.workbenchService.getDangerByRedHeiBangId(
            this.rankData[this.currentRankItemIndex].id,
            // 60,
            type,
            this.timeRange[this.timeTabIndex].startDate
        );
        
        if (Array.isArray(res.content))
        {
            let results = res.content.map(item =>
            {
                this.chartData2Sum += item.count;
                return {
                    name: item.name,
                    value: item.count
                };
            });
            // console.log("???", results);
            this.chartData2.push(...results);
            this.chart2Options.graphic[0].style.text = this.chartData2Sum;
            this.chart2Options.series[0].data.push(...this.chartData2);
            this.resovleTextLeft(this.chartData2Sum);
        }
    }

    /**
     * 客户id监听
     * @watch
     */
    @watch("customerId", {immediate: true})
    protected async customerIdWatcher(val: any)
    {
        if (typeof val === "number" && val > 0)
        {
            await this.getSpecialTypeData();
            this.getTotalSpecialTypeData();
        }
    }

    /**
     * 获取指定客户的体系类型列表
     */
    private async getSpecialTypeData()
    {
        let res = await this.workbenchService.getBeanByCustomerId(this.customerId);

        this.specialTypeList = res.content;
        if (res.content.length > 0)
        {
            // 默认选中第一个体系
            this.specialTypeIndex = 0;
            this.getHHB();
        }
        else
        {
            this.specialTypeIndex = -1;
        }
    }

    private async getTotalSpecialTypeData()
    {
        this.unitRankData = [];
        let specialTypeId = this.specialTypeList[this.specialTypeIndex].id;
        let type = this.unitRankTypeIndex + 1;
        let res = await this.workbenchService.getTotalRanking(specialTypeId, type, this.customerId);

        // console.log(res);
        this.unitRankData = res.content;
    }

    /**
     * 获取红黑榜
     */
    private async getHHB()
    {
        this.chartData1.splice(0);
        this.rankData.splice(0);
        if (this.specialTypeIndex >= 0)
        {
            let specialTypeId = this.specialTypeList[this.specialTypeIndex].id;
            let type = this.rankTypeIndex + 1;
            let startDate = this.timeRange[this.timeTabIndex].startDate;
            const res = await this.workbenchService.getRedHeiBang({
                specialTypeId: specialTypeId,
                type: type,
                day: startDate,
                customerDeptId: this.customerId
            });
            this.rankData.push(...res);
        }
    }

    private resovleTextLeft(num: number)
    {
        if (num < 10)
        {
            this.chart2Options.graphic[0].left = "28%";
        }
        else if (num < 100)
        {
            this.chart2Options.graphic[0].left = "27%";
        }
        else if (num < 1000)
        {
            this.chart2Options.graphic[0].left = "26%";
        }
        else
        {
            this.chart2Options.graphic[0].left = "25%";
        }
    }
}
</script>

<style lang="less" scoped>
.statis-right
{
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.active
    {
        width: 388px;
    }

    &-tabs
    {
        display: flex;
        overflow: hidden;
        // background: #fff;
        &-btn
        {
            width: 136px;
            height: 48px;
            line-height: 48px;
            font-size: 15px;
            font-weight: bold;
            color: #182334;
            position: relative;
            cursor: pointer;
            
            &.active
            {
                
                color: @main-color;
                &:after
                {
                    background-color: #fff;
                    border-right: 1px solid #E7E8EC;
                }

                &:nth-child(1)::before
                {
                    background-color: #fff;
                }

                &:nth-child(2)
                {
                    background-color: none;
                }
            }
            span
            {
                position: relative;
                z-index: 9;
                transform: skewX(-30deg);
            }
            &:after
            {
                content: '';
                position: absolute;
                width: 97%;
                height: 100%;
                background: transparent;
                transform: skewX(30deg);
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #F3F5F7;
                z-index: 1;
                border-right: 1px solid #E7E8EC;
                border-top: 1px solid #E7E8EC;
                border-radius: 4px 12px 0px 0px;
            }
            &:nth-child(1)
            {
                // width: 96px;
                padding-left: 30px;
                text-align: left;
                text-indent: 20%;
                transform: translateX(-13px);
                &::after
                {
                    z-index: 3;
                }
                &::before
                {
                    content: '';
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    background-color: #F3F5F7;
                    // left: -15px;
                    border-left: 1px solid #E7E8EC;
                    border-top: 1px solid #E7E8EC;

                }
            }

            &:nth-child(2)
            {
                // width: 116px;
                padding-left: 20px;
                transform: translateX(-18px);
                position: relative;
                left: -0;
                z-index: 2;
                text-align: left;
                text-indent: 25%;
                &::after
                {
                    // left: -13px;
                    z-index: 2;
                    
                }
            }
        }
    }
    
    .statis-wrap
    {
        background-color: #fff;
        box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.06);
        position: relative;
        transition: 0.5s all;
        overflow-y: auto;
        height: 100%;
        overflow-x: hidden;
    }
    
    &-content
    {
        width: 100%;
        padding: 10px 15px;
        // height: 35px;
        // height: 100px;
        background: #FFFFFF;
        display: flex;
        justify-content: space-between;
        clear: both;
    }

    &-time
    {
        
        display: flex;
        border-right: none;
        float: left;

        &::after
        {
            display: block;
            content: "";
            clear: both;
        }
        span
        {
            flex: 1;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            width: 60px;
            color: #838D9C;
            border: 1px solid #E7E8EC;
            text-align: center;
            cursor: pointer;
            &:nth-child(1){
                border-radius: 4px 0 0 4px;

            }
            &:nth-child(2){
                border-radius: 0px;
            }
            &:nth-child(3){
                border-radius: 0px;
            }
            &:nth-child(4){
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

@{deep}.rank-panel
{
    .statis-item
    {
        // width: 388px;
        height: 276px;
        background: #FFFFFF;
        &-1
        {
            height: auto;
        }
        &-title
        {
            padding: 12px 0px;
            // border-bottom: 1px solid #E7E8EC;
            
            h3
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #182334;
                width: 50%;
            }
        }
        &-icon
        {
            height: 17px;
            height: 15px;
            margin-top: 4px;
            margin-right: 5px;
        }
    }
}

.rank-tab-wrap
{
    padding: 0 20px;
}

.type-tap
{
    display: flex;
    
    p
    {
        flex: 1;
        border-left: 1px solid #DFE1E3;
        padding: 0 12px;
        margin-top: 10px;
        margin-bottom: 10px;
        color: #838D9C;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        &:nth-child(1)
        {
            border-left: none;
        }
        &:hover,
        &.active
        {
            
            font-weight: bold;
            color: #4B7EFE;
        }
    }
}
</style>