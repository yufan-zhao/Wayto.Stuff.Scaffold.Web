<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left"   style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="单位编号">{{detail.customerNum || " "}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目类型">{{ detail.projectTypeName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" :label="detail.meterDescription === 0 ? '建筑面积' : '长度'">{{ detail.floorage ||" - " }}{{detail.meterDescription === 0 ? "m²" : "km"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="开工日期">{{ detail.beginDate ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="计划竣工日期">{{ detail.completionDate ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="施工阶段">{{ detail.constructionStageName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目地址">
                            <i-poptip trigger="hover" content="content" class="w200">
                                <div class="rows-1 dsib w_95">{{ detail.projectAddress ||" - " }}</div>
                                <div slot="content">{{ detail.projectAddress ||" - " }}</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="所属街道/社区">{{ detail.streetCommunity ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="合同期限">{{ detail.contractPeriod ||" - " }}天</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目对接人">
                            <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{ detail.responsible ||" - " }}（{{detail.mobilePhone ||" - "}}）</span>
                                <div slot="content">{{ detail.responsible ||" - " }}（{{detail.mobilePhone ||" - "}}）</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="责任科室">{{ detail.responsibleDepName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目合同额">{{ detail.contractSum ||" - " }}亿元</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目量">{{ detail.outputValue && detail.outputValue.projectQuantity ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="预估产值">{{  detail.outputValue && detail.outputValue.estimateOutput ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="实际产值">{{  detail.outputValue && detail.outputValue.actualOutput ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="现场科室">{{ detail.localeDepartment ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-row" span="24">
                        <i-form-item class="u-form-item" label="项目概述"></i-form-item>
                        <section class="i-form-details">{{ detail.projectOverview ||" - " }}</section>
                    </i-col>
                    <i-col class-name="u-row" span="24">
                        <i-form-item class="u-form-item" :label-width="180" label="项目部照片"></i-form-item>
                        <section class="i-form-details no-bg" v-previewer v-if="detail.projectFilePath">
                            <div class="img-box-item" :style="{background: `url(${imagePath(detail.projectFilePath)}) no-repeat center center`,backgroundSize: 'cover'}">
                                <img :src="detail.projectFilePath | imagePath" alt="" srcset="">
                            </div>
                        </section>
                        <u-nodata v-else></u-nodata>
                    </i-col>
                    <i-col class-name="u-row" span="24" >
                        <i-form-item class="u-form-item" :label-width="180" label="项目形象进度照片"></i-form-item>
                        <section class="i-form-details no-bg" v-previewer v-if="detail.scheduleList && detail.scheduleList.length">
                            <div class="img-box-item" :style="{background: `url(${imagePath(item.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-for="item in detail.scheduleList" :key="'i' + item.id">
                                <img :src="item.filePath | imagePath" alt="" srcset="">
                            </div>
                        </section>
                        <u-nodata v-else></u-nodata>
                    </i-col>
                    
                </i-row>
            </i-form>
        </div>

        <h3 class="sub-detail-title u-form-content-title" v-if="detail.tools && detail.tools.length">项目工机具</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" v-for="item in detail.tools" :key="'tools' + item.id">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="工机具名称">{{ item.toolsName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="数量">{{ item.toolsAmount ||" - " }}</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>


        <h3 class="sub-detail-title u-form-content-title">诊治信息</h3>
        <section class="statistics-info mb20">
            <div class="statistics-item"><p class="statistics-num">{{data.consultPlanSize}}</p><p  class="statistics-name">诊治次数</p></div>
            <div class="statistics-item"><p class="statistics-num">{{data.hazardSum}}</p><p  class="statistics-name">总问题数</p></div>

            <div class="statistics-item"  v-for="item in data.hazardSumList" :key="item.hazardLevelName">
                <p :class="`statistics-num statistics-num-${item.hazardLevelName === '一级' ? 2 : (item.hazardLevelName === '二级' ? 1 : 0)}`" :style="{color:item.color}">
                    {{item.hazardCount}}
                </p>
                <p  class="statistics-name">{{item.hazardLevelName}}</p>
            </div>
        </section>
        <section class="diagnosis-content" v-for="(item,i) in data.consultPlanList" :key="item.id">
            <div class="diagnosis-title">
                <p class="title">第{{i+1}}次诊治</p>
                <i-poptip trigger="hover" title="''" content="content" class="score-poptip">
                    <p class="diagnosis-info" ref="diagnosis-info-2">
                        <span v-for="(val,i) in item.score" :key="i"  class="dsib ml20 cursor-pointer">
                            {{val.name}}：{{val.actualScore || 0}}
                        </span>
                    </p>
                    <section slot="content">
                        <div class="table-list-content" >
                            <section v-for="(val,i) in item.score" :key="i">
                                <h4 class="table-list-title mb10">{{val.name}}： <span  class="font-error">{{val.actualScore || 0}}</span></h4>
                                <i-table class="table-normal mb15" :data="val.ruleModelInfoVos" :columns="columuns2"></i-table>
                            </section>
                        </div>
                    </section>
                    <div slot="title"></div>
                </i-poptip>
            </div>
            <div class="diagnosis-content-info">
                <i-form class="u-form" label-position="left">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="诊治编码">{{ item.consultNum ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="诊治时间">{{ item.consultTime ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="诊治体系">{{ item.specialTypeName ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="问题数量">
                                {{item.hazardSum || 0}}（
                                <template  v-for="(val,i) in item.hazardSumList">
                                    <span class="statistics-num-2" :style="{color: val.color}" :key="i">
                                        {{val.hazardCount || 0}}
                                    </span>
                                    <span :key="i+'s'">
                                        {{ i >= 0 && item.hazardSumList.length-1 > i ? "+" : ""}}
                                    </span>
                                </template>）
                            </i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="诊治开始时间">{{ item.beginTime ||" - " }}</i-form-item>
                        </i-col>
                        <!-- <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="评估结束时间">{{ detail. xxx ||" - " }}</i-form-item>
                        </i-col> -->
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="成员">
                                <i-poptip trigger="hover" content="content" class="w200">
                                    <span class="rows-1 dsib w_95">
                                        {{item.captainCustomer && item.captainCustomer.name}}(组长)、
                                        {{(item.crewsCustomers || []).map(val=>val.name).join("、")}}
                                    </span>
                                    <div slot="content">
                                        {{item.captainCustomer && item.captainCustomer.name}}(组长)、
                                        {{(item.crewsCustomers || []).map(val=>val.name).join("、")}}
                                    </div>
                                 </i-poptip>
                                
                            </i-form-item>
                        </i-col>
                        
                        <!-- <i-col class-name="u-row" span="24">
                            <i-form-item class="u-form-item" :label-width="180" label="项目形象进度照片"></i-form-item>
                            <section class="i-form-details">
                                <div class="img-box-item" style="background: url(https://ts3.cn.mm.bing.net/th?id=OIP-C.S3QOsgnlzrpbpAdOXF4YMAHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2) no-repeat center center;background-size: cover">
                                    <img src="src/assets/application/none-data.png" alt="" srcset="">
                                </div>
                            </section>
                        </i-col> -->
                    </i-row>
                </i-form>
            </div>
        </section>

    </div>

</template>

<script lang="ts">
import { ExtendUtils } from "src/common/utils";
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { ProjectService } from "src/services";
import { service } from "src/common/decorator";
@component
export default class InfoView extends View
{
    @service("ProjectService")
    protected projectService: ProjectService;

    protected showTable = false;

    protected showTableId = 0;

    @config({required: true, default: () => ({})})
    protected detail: any;

    // ExtendUtils.imagePath
    protected imagePath: any = ExtendUtils.imagePath;
    
    protected data: any = [];

    protected scoreData =
    [
        {name: "管理行为", perent: 20, sum: 150},
        {name: "文明施工", perent: 20, sum: 150},
        {name: "工程现场安全生产", perent: 20, sum: 150},
        {name: "施工单位综合得分", perent: 20, sum: 150}
    ];

    protected columuns2: Array<any> =
    [
        {
            title: "分项",
            minWidth: 200,
            render: (h, {row}: any) =>
            {
                return h("div", row.modelName || "-");
            }
        },
        {
            title: "权重",
            minWidth: 60,
            render: (h, {row}: any) =>
            {
                return h("div", row.weight + "%");
            }
        },
        {
            title: "权重得分",
            minWidth: 90,
            render: (h, {row}: any) =>
            {
                return h("div", row.actualScore || 0);
            }
            
        }
    ];

    @watch("detail",{immediate: true})
    protected onChange(value)
    {
        this.getPublicity();
    }

    protected async getPublicity()
    {
        this.data = await this.projectService.getProjectConsultList(this.detail.id);
        // console.log(this.data);
    }

}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.i-form-details
{
    background: #F6F8FC;
    border: 1px solid #E7E8EC;
    border-radius: 4px;
    padding: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #525A65;
    line-height: 24px;
    display: flex;
    &.no-bg
    {
        background: none;
        border: none;
        padding: 0;
    }
    .img-box-item
    {
        flex-wrap: wrap;
        width: 210px;
        height: 120px;
        border-radius: 2px;
        overflow: hidden;
        background-size: cover !important;
        margin-right: 10px;
        margin-bottom: 10px;
        img
        {
            opacity: 0;
            width: 100%;
            height: 100%;
        }
        
    }
}
.statistics-num
{
    color: #182334;
    &-0
    {
        color: #A533F4;
    }
    &-1
    {
        color: #FF9832;
    }
    &-2
    {
        color: #FF4D3F;
    }
    &-3
    {
        color: #838D9C;
    }
}
.statistics-info
{
    display: flex;
    width: 100%;
    .statistics-item
    {
        flex: 1;
        text-align: center;
        .statistics-num
        {
            font-size: 24px;
            font-family: DINPro;
            font-weight: bold;
            color: #182334;
            &-0
            {
                color: #A533F4;
            }
            &-1
            {
                color: #FF9832;
            }
            &-2
            {
                color: #FF4D3F;
            }
        }
        .statistics-name
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #838D9C;
            padding-top: 15px;
        }
    }
}
.diagnosis-content
{
    
    .diagnosis-title
    {
        margin-top: 25px;
        position: relative;
        height: 48px;
        background: #F2F6F9;
        line-height: 48px;
        padding: 0 29px;
        display: flex;

        .title
        {
            font-size: 14px;
            font-weight: 400;
            color: #182334;
            flex: 1;
        }
        .diagnosis-info
        {
            flex-basis: 250px;
            text-align: right;
            font-size: 14px;
            font-weight: 400;
            color: #3375F4;
            flex: 1;
        }
        .table-list-content
        {
            // position: absolute;
            // right: -4px;
            // bottom: 50px;
            width: 432px;
            height: 445px;
            background: #FFFFFF;
            box-shadow: 0px 3px 30px 0px rgba(0,0,0,0.1500);
            padding: 12px;
            overflow-y: auto;
            z-index: 10;
            h4.table-list-title
            {
                font-size: 16px;
                font-weight: bold;
                color: #182334;
            }
        }
        .tranger
        {
            // transparent
            width: 0;
            height: 0;
            border-top: 16px solid #FFFFFF;
            border-left: 15px solid rgba(0,0,0,0);
            border-right: 15px solid rgba(0,0,0,0);
            
            // box-shadow: 0px 3px 30px 0px rgba(0,0,0,0.1500);
            position: absolute;
            right: 215px;
            bottom: 35px;
            z-index: 9;
        }
    }
    &-info
    {
        width: 100%;
        border: 1px solid #ECECEC;
        padding: 20px 20px;
    }
}

.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
    }
}
.score-poptip
{
    /deep/.ivu-poptip-title
    {
        display: none;
    }
}
</style>