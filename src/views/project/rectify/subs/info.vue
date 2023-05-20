<template>
    <div class="sub-detail">
        <section class="statistics-info mb20">
            
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{})">
                <p class="statistics-num">
                    {{dangerStats.hazardSum}}
                </p>
                <p  class="statistics-name">问题隐患</p>
            </div>
           
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 0})">
                <p class="statistics-num">{{dangerStats.afterRectificationSum}}</p>
                <div  class="statistics-name">
                    待整改
                    <p>
                        (<template  v-for="(item,i) in dangerStats.afterRectification">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.afterRectification.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 1})">
                <p class="statistics-num">{{dangerStats.afterCloseSum || 0}}</p>
                <div  class="statistics-name">
                    待闭合
                   <p>
                        (<template  v-for="(item,i) in dangerStats.afterClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.afterClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 2})">
                <p class="statistics-num">{{dangerStats.alreadyCloseSum || 0}}</p>
                <div  class="statistics-name">
                    已闭合
                     <p>
                        (<template  v-for="(item,i) in dangerStats.alreadyClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.alreadyClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer"  @click="getPublicity(detail.id,{mendStatus: 3})">
                <p class="statistics-num">{{dangerStats.timeoutCloseSum || 0}}</p>
                <div  class="statistics-name">
                    超时闭合
                     <p>
                        (<template  v-for="(item,i) in dangerStats.timeoutClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.timeoutClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item"  v-for="(item,i) in dangerStats.hazardSumList" :key="i+'0'">
                <p class="statistics-num" :style="{color: item.color}">
                    {{item.hazardCount || "0"}}
                </p>
                <p  class="statistics-name">{{item.hazardLevelName}}</p>
            </div>
        </section>
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" style="width: 100%;">
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
                        <i-form-item class="u-form-item" label="诊治时间">{{ detail.beginTime ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目名称">{{ detail.projectManager && detail.projectManager.projectName ||" - " }}</i-form-item>
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
                        <i-form-item class="u-form-item" label="诊治组名">{{ detail.consultGroupName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="业主单位">{{ detail.projectManager && detail.projectManager.customerName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="施工单位">{{ detail.projectManager && detail.projectManager.construction && detail.projectManager.construction.map(item => item.constructionName).join("、") ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="监理单位">{{ detail.projectManager && detail.projectManager.supervising && detail.projectManager.supervising.map(item => item.name).join("、") ||" - " }}</i-form-item>
                    </i-col>

                </i-row>
            </i-form>
        </div>

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
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { HiddenService, MendService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("HiddenService")
    protected hiddenService: HiddenService;

    protected imagePath = imagePath;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected dangerStats = {};

    @watch("detail",{immediate: true})
    protected change(val)
    {
        this.dangerStats = {};
        this.getDangerStats(val.id);
    }
    
    protected async getDangerStats(consultId)
    {
        let res = await this.hiddenService.getDangerStats({consultId});
        this.dangerStats = res;
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
            background-size: cover !important;
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
</style>