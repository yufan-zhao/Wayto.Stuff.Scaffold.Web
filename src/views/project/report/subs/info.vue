<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="报告编号">
                            <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{detail.projectManager && detail.projectManager.customerNum || " "}}-{{ detail.consultNum ||" - " }}-D</span>
                                <div slot="content">{{detail.projectManager && detail.projectManager.customerNum || " "}}-{{ detail.consultNum ||" - " }}-D</div>
                            </i-poptip>
                        </i-form-item>
                        
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="诊治编号">{{ detail.consultNum ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目类型">{{ detail.projectManager && detail.projectManager.projectTypeName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="施工阶段">{{ detail.projectManager && detail.projectManager.constructionStageName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目地址">
                           <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{ detail.projectManager && detail.projectManager && detail.projectManager.projectAddress ||" - " }}</span>
                                <div slot="content">{{ detail.projectManager && detail.projectManager && detail.projectManager.projectAddress ||" - " }}</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="所属街道/社区">{{ detail.projectManager && detail.projectManager.streetCommunity ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="业主单位">{{ detail.projectManager && detail.projectManager.customerName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目对接人">{{ detail.projectManager && detail.projectManager.responsible ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="诊治计划时间">{{ detail.consultTime ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="现场科室">{{ detail.projectManager && detail.projectManager.localeDepartment ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="诊治组名">{{ detail.consultGroupName ||" - " }}</i-form-item>
                    </i-col>
                   
                    <i-col class-name="u-row" span="24">
                        <i-form-item class="u-form-item" label="项目概述"></i-form-item>
                        <section class="i-form-details">{{ detail.projectManager && detail.projectManager.projectOverview ||" - " }}</section>
                    </i-col>
                     <i-col class-name="u-row" span="24" v-if="detail.describeList">
                        <i-form-item class="u-form-item" label="项目进度概述"></i-form-item>
                        <section class="i-form-details">{{ detail.describeList && detail.describeList[0] ||" - " }}</section>
                    </i-col>
                    <i-col class-name="u-row" span="24" v-if="detail.projectManager && detail.projectManager.scheduleList">
                        <i-form-item class="u-form-item" :label-width="180" label="项目形象进度照片"></i-form-item>
                        <section class="i-form-details d-f"  v-previewer>
                            <div class="img-box-item" :style="{background: `url(${imagePath(item.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-for="item in  (detail.projectManager && detail.projectManager.scheduleList || [])" :key="'i' + item.id">
                                <img :src="item.filePath | imagePath" alt="" srcset="">
                            </div>
                        </section>
                    </i-col>
                    
                </i-row>

            </i-form>

            <section class="statistics-info mb20">
                <div class="statistics-item">
                    <p class="statistics-num">  {{dangerStats.hazardSum}}</p>
                    <p  class="statistics-name">总问题数</p>
                </div>

                <div class="statistics-item"  v-for="(item,i) in dangerStats.hazardSumList" :key="i+'0'">
                    <p class="statistics-num" :style="{color: item.color}">
                        {{item.hazardCount || "0"}}
                    </p>
                    <p  class="statistics-name">{{item.hazardLevelName}}</p>
                </div>
            
            </section>
        </div>

        

        <h3 class="sub-detail-title u-form-content-title">诊治信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="12">
                        <i-form-item class="u-form-item" label="诊治时间">{{ detail.beginTime ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="12">
                        <i-form-item class="u-form-item" label="诊治成员">
                            <i-poptip trigger="hover" content="content" class="w50">
                                <span class="rows-1 dsib w_95">{{ detail.captainCustomer && detail.captainCustomer.name ||" - " }},</span>
                                <div slot="content">{{ detail.captainCustomer && detail.captainCustomer.name ||" - " }}</div>
                            </i-poptip>
                             
                            <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{ detail.crewsCustomers && detail.crewsCustomers.map(item => item.name).join('，')||" - " }}</span>
                                <div slot="content">{{ detail.crewsCustomers && detail.crewsCustomers.map(item => item.name).join('，')||" - " }}</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="24">
                        <i-form-item class="u-form-item diagnosis-title" label="诊治成绩：">
                            <i-poptip trigger="click" title="''" content="content" popper-class="score-poptip" transfer>
                                <p class="diagnosis-info font-main" ref="diagnosis-info-2">
                                   {{data.map(item =>`${item.actualScore || 0}(${item.name})`).join("/")}}
                                </p>
                                <section slot="content">
                                    <div class="table-list-content">
                                        <section  v-for="item in data" :key="item.id" >
                                            <h4 class="table-list-title mb10">{{item.name}}： <span  class="font-warning">{{item.actualScore || 0}}</span></h4>
                                            <i-table class="table-normal mb15" :data="item.ruleModelInfoVos" :columns="columuns2"></i-table>
                                        </section>
                                    </div>
                                </section>
                                <div slot="title"></div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    
                </i-row>
            </i-form>
        </div>
    </div>

</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { SpecialCustomRruleService, HiddenService } from "src/services";
import { service } from "src/common/decorator";
@component
export default class InfoView extends View
{
    @config({required: true, default: () => ({})})
    protected detail: any;

    @service("SpecialCustomRruleService")
    protected specialCustomRruleService: SpecialCustomRruleService;

    @service("HiddenService")
    protected hiddenService: HiddenService;

    protected showTable = false;

    protected showTableId = 0;

    protected imagePath: any = imagePath;

    protected dangerStats: any = {};

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "分项",
            render: (h, {row}: any) =>
            {
                return h("div", row.modelName || "-");
            }
        },
        {
            title: "权重",
            render: (h, {row}: any) =>
            {
                return h("div", row.weight + "%");
            }
        },
        {
            title: "权重得分",
            render: (h, {row}: any) =>
            {
                return h("div", row.actualScore || 0);
            }
            
        }
    ];
    
    /**
     * detail监听
     * @watcher
     */
    @watch("detail",{immediate: true})
    protected onChange(value)
    {
        this.getPublicity(value.id);
        this.dangerStats = {};
        this.getDangerStats(value.id);
    }

    protected async getDangerStats(consultId)
    {
        let res = await this.hiddenService.getDangerStats({consultId});
        // console.log(res);
        
        this.dangerStats = res;
        // this.dangerStats.doitemd = res.ha
    }

    /**
     * 获取数据
     */
    protected async getPublicity(consultId)
    {
        let res = await this.specialCustomRruleService.getCustomRuleScore({consultId, specialTypeId: this.detail.specialTypeId});
        this.data = res;
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

}
.img-box-item
{
    flex-wrap: wrap;
    width: 210px;
    height: 120px;
    border-radius: 2px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
    background-size: cover !important;
    img
    {
        opacity: 0;
        width: 100%;
        height: 100%;
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
    background: #FAFBFE;
    border: 1px solid #E9EBEC;
    border-radius: 6px;
    padding: 10px 0;
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
    
.diagnosis-title
{
    // margin-top: 25px;
    position: relative;
    // height: 48px;
    // background: #F2F6F9;
    // line-height: 48px;
    // padding: 0 29px;
    // display: flex;
    
    .diagnosis-info
    {
        
        text-align: right;
        font-size: 14px;
        font-weight: 400;
        color: #3375F4;
        flex: 1;
    }
    .table-list-content
    {
        // position: absolute;
        // left: 0;
        // bottom: 35px;
        width: 432px;
        height: 445px;
        background: #FFFFFF;
        box-shadow: 0px 3px 30px 0px rgba(0,0,0,0.1500);
        padding: 29px;
        overflow-y: auto;
        z-index: 20;
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
        right: 203px;
        bottom: 20px;
        z-index: 19;
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