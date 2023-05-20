<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left"  style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="诊治编号" style="width: 100%;">
                            <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{detail.projectManager && detail.projectManager.customerNum || " "}}-{{ detail.consultNum ||" - " }}</span>
                                <div slot="content">{{detail.projectManager && detail.projectManager.customerNum || " "}}-{{ detail.consultNum ||" - " }}</div>
                            </i-poptip>
                            
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        
                        <i-form-item class="u-form-item" label="项目类型">{{ detail.projectManager && detail.projectManager.projectTypeName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="施工阶段">{{ detail.projectManager && detail.projectManager.constructionStageName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  style="width: 100%;" label="项目地址" >
                            <i-poptip trigger="hover" content="content" class="w200" placement="top-start">
                                <span class="rows-1 dsib w_95">{{ detail.projectManager && detail.projectManager && detail.projectManager.projectAddress ||" - " }}</span>
                                <div slot="content">{{ detail.projectManager && detail.projectManager && detail.projectManager.projectAddress ||" - " }}</div>
                            </i-poptip>
                            
                        </i-form-item>
                        <!-- <i-form-item class="u-form-item" label="项目地址">{{ detail.projectManager && detail.projectManager.projectAddress ||" - " }}</i-form-item> -->
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="所属街道/社区">
                            <!-- <i-poptip trigger="hover" content="content" class="w200"> -->
                                <span class="dsib">{{ detail.projectManager && detail.projectManager && detail.projectManager.streetCommunity ||" - " }}</span>
                                <!-- <div slot="content">{{ detail.projectManager && detail.projectManager && detail.projectManager.streetCommunity ||" - " }}</div> -->
                            <!-- </i-poptip> -->
                            
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="业主单位">{{ detail.projectManager && detail.projectManager.customerName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目对接人">{{ detail.projectManager && detail.projectManager.responsible ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="诊治计划时间">{{ detail.consultTime ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="现场科室">{{ detail.projectManager && detail.projectManager.localeDepartment ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="诊治组名">{{ detail.consultGroupName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="16">
                        <i-form-item class="u-form-item"  label="组员">
                            <i-poptip trigger="hover" content="content" class="w200">
                                <span class="rows-1 dsib w_95">{{ detail.crewsCustomers && detail.crewsCustomers.map(item => item.name).join('，')||" - " }}</span>
                                <div slot="content">{{ detail.crewsCustomers && detail.crewsCustomers.map(item => item.name).join('，')||" - " }}</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>

        <h3 class="sub-detail-title u-form-content-title">诊治信息</h3>
        <section class="statistics-info mb20">
            <div class="statistics-item">
                <p class="statistics-num">
                    <!-- {{detail.dangerStats && (detail.dangerStats.afterRectificationSum + detail.dangerStats.afterCloseSum + detail.dangerStats.alreadyCloseSum +detail.dangerStats.timeoutCloseSum) || 0}} -->
                    {{dangerStats.hazardSum}}
                </p>
                <p  class="statistics-name">总问题数</p>
            </div>
            <div class="statistics-item"  v-for="(item,i) in dangerStats.hazardSumList" :key="i+'0'">
                <p class="statistics-num" :style="{color: item.color}">
                    <!-- {{detail.dangerStats && (detail.dangerStats.timeoutClose["一级"] + detail.dangerStats.alreadyClose["一级"]+ detail.dangerStats.afterRectification["一级"]) || 0}} -->
                    {{item.hazardCount || "0"}}
                </p>
                <p  class="statistics-name">{{item.hazardLevelName}}</p>
            </div>
            <!-- <div class="statistics-item">
                <p class="statistics-num statistics-num-1">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["二级"] + detail.dangerStats.alreadyClose["二级"] + detail.dangerStats.afterRectification["二级"]) || 0}}
                </p>
                <p  class="statistics-name">二级</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-0">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["三级"] + detail.dangerStats.alreadyClose["三级"] + detail.dangerStats.afterRectification["三级"]) || 0}}
                </p>
                <p  class="statistics-name">三级</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-3">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["四级"] + detail.dangerStats.alreadyClose["四级"] + detail.dangerStats.afterRectification["四级"]) || 0}}
                </p>
                <p  class="statistics-name">四级</p>
            </div> -->
        </section>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left"  style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="12">
                        <i-form-item class="u-form-item"  label="诊治开始时间">{{ detail.beginTime ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="12">
                        <i-form-item class="u-form-item"  label="诊治结束时间">{{ detail.endTime ||" - " }}</i-form-item>
                    </i-col>
                   
                   <i-col class-name="u-col" span="24">
                        <i-form-item class="u-form-item diagnosis-title" label="诊治成绩">
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

            
            <h3 class="sub-detail-title u-form-content-title">联系人</h3>
            <section class="user-list">
                <div class="user-list-item">
                    <div class="user-list-item-img" :style="{background: `url(${imagePath(detail.captainCustomer && detail.captainCustomer.headImgUrl)}) no-repeat center center`,backgroundSize: 'cover'}">
                        <img :src=" detail.captainCustomer.headImgUrl | imagePath" alt="">
                        <p class="user-list-item-posi">组长</p>
                    </div>
                    <p class="user-list-item-name">{{detail.captainCustomer && detail.captainCustomer.name}}</p>
                    <p class="user-list-item-mobile">{{detail.captainCustomer && detail.captainCustomer.mobile}}</p>
                </div>

                <div class="user-list-item" v-for="itm in detail.crewsCustomers || []" :key="itm.id">
                    <div class="user-list-item-img" :style="{background: `url(${imagePath(itm.headImgUrl)}) no-repeat center center`,backgroundSize: 'cover'}">
                        <img :src="itm.headImgUrl | imagePath" alt="">
                    </div>
                    <p class="user-list-item-name">{{itm.name}}</p>
                    <p class="user-list-item-mobile">{{itm.mobile}}</p>
                </div>
            </section>
        </div>

    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { HiddenService, SpecialCustomRruleService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";

@component
export default class InfoView extends View
{
    @service("HiddenService")
    protected hiddenService: HiddenService;

    @service("SpecialCustomRruleService")
    protected specialCustomRruleService: SpecialCustomRruleService;

    protected imagePath = imagePath;

    @config({required: true, default: () => ({})})
    protected detail: any;

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

    @watch("detail",{immediate: true})
    protected change(val)
    {
        this.dangerStats = {};
        this.getDangerStats(val.id);
        this.getPublicity(val.id);
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
    padding: 20px 0;
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

.user-list
{
    display: flex;
    flex-wrap: wrap-reverse;
    &-item
    {
        margin-right: 20px;
        margin-bottom: 20px;
        text-align: center;
        &-img
        {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            img
            {
                opacity: 0;
                width: 100%;
                height: 100%;
            }
        }
        &-posi
        {
            background: #4B7EFE;
            opacity: 0.9;
            // border-radius: 50%;
            width: 100%;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 28px;
            position: absolute;
            bottom: 0;
            
        }
        &-name
        {
            font-size: 14px;
            font-weight: 400;
            color: #182334;
            line-height: 28px;

        }
         &-mobile
        {
            font-size: 14px;
            font-weight: 400;
            color: #838D9C;
        }
    }
}

.score-poptip
{
    @{deep}.ivu-poptip-title
    {
        display: none;
    }
    @{deep}.table-list-content
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
}
</style>