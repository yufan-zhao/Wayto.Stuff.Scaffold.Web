<template>
    <div class="statics-right">
        <section class="statics-wrap">
            <div class="panel-header">
                <i-select v-model="specialTypeIndex" @on-change="onSpecialTypeChange" style="width: 60%">
                    <i-option v-for="(item, i) in specialTypeList" :key="i" :value="i">{{item.name}}</i-option>
                </i-select>

                <i-select v-model="timeTabIndex" @on-change="onTimeTabChange" style="width: 35%">
                    <i-option v-for="(item, i) in btnLabels" :key="'time-range-' + i" :value="i">{{item}}</i-option>
                </i-select>
            </div>

            <!-- <div class="rank-type">
                <p :class="{active: rankTypeIndex === 0}" @click="onRankTypeChange(0)">施工单位 综合排名</p>
                <p :class="{active: rankTypeIndex === 1}" @click="onRankTypeChange(1)">监理单位 综合排名</p>
                <p :class="{active: rankTypeIndex === 2}" @click="onRankTypeChange(2)">代建单位 综合排名</p>
                <p :class="{active: rankTypeIndex === 3}" @click="onRankTypeChange(3)">项目综合 得分排名</p>
            </div> -->
 <!-- style="max-height: 600px;overflow-y: scroll;" -->
            <div class="rank-table-container">
                <RightPanelRankTable 
                    :rankTypeIndex="rankTypeIndex"
                    :rankData="rankData"
                    :getMarkerColor="getMarkerColor"
                    :colorList="colorList"
                    @on-rank-item-change="onRankItemChange"
                ></RightPanelRankTable>
            </div>

            <div class="chart-content">
                <div class="chart-container">
                    <div class="title">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="title-icon">
                        <h3>履职情况</h3>
                    </div>

                    <RightPanelChartPosition
                        :chartData="chartData1"
                    ></RightPanelChartPosition>
                </div>

                <div class="chart-container">
                    <div class="title">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="title-icon">
                        <h3>隐患情况</h3>
                    </div>

                    <RightPanelChartDanger
                        :chartData="chartData2"
                    ></RightPanelChartDanger>
                </div>
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
import RightPanelRankTable from "./right-panel-rank-table.vue";
import RightPanelChartPosition from "./right-panel-chart-position.vue";
import RightPanelChartDanger from "./right-panel-chart-danger.vue";

@component({
    components:
    {
        RightPanelRankTable,
        RightPanelChartPosition,
        RightPanelChartDanger
    }
})
export default class RightPanel extends CommonView
{
    @service("WorkbenchService")
    private workbenchService: WorkbenchService;

    /**
     * 客户id，默认进来是undefined
     * @config
     */
    @config({required: false})
    protected customerId: number;

    /**
     * 颜色函数
     * @config
     */
    @config({required: true})
    protected getMarkerColor: Function;

    /**
     * 颜色列表
     * @config
     */
    @config({required: false, default: () => []})
    protected colorList: Array<any>;

    /**
     * 所选的体系类型索引
     * @property
     */
    protected specialTypeIndex: number = 0;

    /**
     * 体系类型列表
     * @property
     */
    protected specialTypeList: Array<any> = [];

    /**
     * 时间范围选择索引
     * @property
     */
    protected timeTabIndex: number = 0;

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
        {startDate: null, endDate: ""},
        {startDate: dayjs().subtract(1, "week").format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(3, "month").format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(6, "month").format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD")},
        {startDate: dayjs().subtract(1, "year").format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD")}
    ];

    /**
     * 排名类型索引
     * @property
     */
    protected rankTypeIndex: number = 0;

    /**
     * 排名列表
     * @property
     */
    protected rankData: Array<any> = [];

    /**
     * 当前排名项选中索引
     * @property
     */
    protected currentRankItemIndex: number = -1;

    /**
     * 履职情况图表数据
     * @property
     */
    protected chartData1: Array<any> = [];

    /**
     * 隐患情况图表数据
     * @property
     */
    protected chartData2: Array<any> = [];

    /**
     * 体系类型变化事件
     * @protected
     */
    protected onSpecialTypeChange()
    {
        this.initRankData();
    }

    /**
     * 时间变化事件
     * @protected
     */
    protected onTimeTabChange()
    {
        this.initRankData();
    }

    /**
     * 排名类型切换事件
     * @protected
     */
    protected onRankTypeChange(index: number)
    {
        this.rankTypeIndex = index;
        this.initRankData();
    }

    /**
     * 排名列表项切换事件
     * @protected
     */
    protected onRankItemChange(item: any, i: number)
    {
        this.currentRankItemIndex = i;

        this.initPositionData();
        this.initDangerData();
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
            this.initData();
        }
        else
        {
            this.specialTypeList.splice(0);
        }
    }

    /**
     * 初始化面板数据
     */
    private async initData()
    {
        this.specialTypeIndex = 0;
        let res = await this.workbenchService.getBeanByCustomerId(this.customerId);
        this.specialTypeList = res.content;

        this.onSpecialTypeChange();
    }

    /**
     * 初始化排名数据
     */
    private async initRankData()
    {
        this.currentRankItemIndex = -1;
        this.chartData1 = [];
        this.chartData2 = [];
        // this.rankData.splice(0);
        let specialTypeId = this.specialTypeList[this.specialTypeIndex].id;
        // let type = this.rankTypeIndex + 1;
        let startDate = this.timeRange[this.timeTabIndex].startDate;
        let res = await this.workbenchService.getGrade(specialTypeId, this.customerId, startDate);
        // let list = res.content.splice(0, 10);
        this.rankData = res.content;
        // this.rankData.push(...list);
    }

    /**
     * 初始化履职情况图表数据
     */
    private async initPositionData()
    {
        let params: any = {};
        params.customerId = this.customerId;
        params.projectId = this.rankData[this.currentRankItemIndex].projectId;
        // if (this.rankTypeIndex === 0)
        // {
        //     params.constructionId = this.rankData[this.currentRankItemIndex].id;
        // }
        // else if (this.rankTypeIndex === 2)
        // {
        //     params.agencyId = this.rankData[this.currentRankItemIndex].id;
        // }
        // else if (this.rankTypeIndex === 3)
        // {
        //     params.projectId = this.rankData[this.currentRankItemIndex].id;
        // }
        // else
        // {
        //     params.unitId = this.rankData[this.currentRankItemIndex].id;
        // }
        const res = await this.workbenchService.getPerformanceOfDutiesCount({
            params: params
        });

        this.chartData1 = res;
    }

    /**
     * 初始化隐患情况
     */
    private async initDangerData()
    {
        let type = 4; // 20230224 后端说这个参数写死传4即可
        let res = await this.workbenchService.getDangerByRedHeiBangId(
            this.rankData[this.currentRankItemIndex].projectId,
            // 60,
            type,
            this.timeRange[this.timeTabIndex].startDate
        );

        this.chartData2 = res.content;
    }
}
</script>

<style lang="less" scoped>
.statics-right
{
    width: 100%;
    height: 100%;
    overflow: hidden;

    .statics-wrap
    {
        background-color: #fff;
        box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.06);
        position: relative;
        transition: 0.5s all;
        overflow-y: auto;
        height: 100%;
        overflow-x: hidden;

        .panel-header
        {
            width: 100%;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            clear: both;
        }

        .rank-type
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

        .rank-table-container
        {
            padding: 0 15px;
        }

        .chart-content
        {
            padding: 12px 15px;

            .chart-container
            {
                height: 276px;

                .title
                {
                    display: flex;

                    .title-icon
                    {
                        height: 17px;
                        height: 15px;
                        margin-top: 4px;
                        margin-right: 5px;
                    }
                    
                    h3
                    {
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #182334;
                        width: 50%;
                    }
                }
            }
        }
    }
}
</style>