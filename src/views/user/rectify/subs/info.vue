<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content d-f" style="margin-bottom: 50px;">
            <section class="imgUrl mr20" >
                <div v-if="detail.imgUrl" class="base-img" :style="{'background': `url(${imagePath(detail.imgUrl)}) no-repeat center center`,backgroundSize: 'cover'}" style="">
                    <img :src="imagePath(detail.imgUrl)" v-previewer> 
                </div>
                <div v-else class="base-img-no rows-1" >
                    {{detail.name.substring(0,3)}}
                </div>
            </section>
            <i-form class="u-form base-display" label-position="left"  style="width: 100%;">
                
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8"> 
                        <i-form-item class="u-form-item" label="姓名">{{detail.name}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="账号">{{detail.userName}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="性别">{{detail.sex == 0 ? "女" : "男"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="电话">{{detail.mobilePhone}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="角色">{{detail.jsName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="部门">{{detail.userGroupName}}</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>

        <h3 class="sub-detail-title u-form-content-title">诊治任务</h3>
        <section class="diagnosis-content">
            <div class="diagnosis-title">
                <p class="title">诊治任务数: {{totalStat && totalStat.sumCount || 0}}</p>
                <p class="diagnosis-info"> 待诊治： {{totalStat && totalStat.undiagnosed || 0}}   &nbsp;&nbsp;   已诊治： {{totalStat && totalStat.diagnosed || 0}} </p>

            </div>
            <div class="diagnosis-content-info d-f">
                <div class="status-radius mr20">
                    <p>{{totalStat && totalStat.undiagnosed || 0}}</p>
                    <p>待诊治</p>
                </div>
                <i-form class="u-form" label-position="left" style="width: 100%;">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="8" v-for="(item,i) in (totalStat && totalStat.undiagnosedList || [])" :key="i">
                            <i-form-item class="u-form-item" :label-width="20" label="" @click="toDetail(item.id)">
                                 <i-poptip trigger="hover" content="content">
                                    <div class="rows-1 dsib w_95">{{ item.projectName ||" - " }}</div>
                                    <div slot="content">{{ item.projectName ||" - " }}</div>
                                </i-poptip>
                            </i-form-item>
                        </i-col>
                        
                    </i-row>
                </i-form>
            </div>

            <div class="diagnosis-content-info d-f border-no-top">
                <div class="status-radius status-radius-green mr20">
                    <p>{{totalStat && totalStat.diagnosed || 0}}</p>
                    <p>已诊治</p>
                </div>
                <i-form class="u-form" label-position="left" style="width: 100%;">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="8" v-for="(item,i) in (totalStat && totalStat.diagnosedList || [])" :key="i">
                            <i-form-item class="u-form-item " :label-width="20" label="" @click="toDetail(item.id)">
                                <i-poptip trigger="hover" content="content" class="w200">
                                    <div class="rows-1 dsib w_65">{{ item.projectName ||" - " }}</div>
                                    <div slot="content">{{ item.projectName ||" - " }}</div>
                                </i-poptip>
                            </i-form-item>
                        </i-col>
                        
                    </i-row>
                </i-form>
            </div>
        </section>


    </div>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { DiagnosService, OrgService, RoleService, DictService } from "src/services";
import { service } from "src/common/decorator";
@component
export default class InfoView extends View
{
    @service("DiagnosService")
    protected testPaginTableService: DiagnosService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected imagePath = imagePath;

    protected totalStat = {};
    
    @watch("detail", {immediate: true})
    protected async getDiagnosedCountByUserId(val)
    {
        this.totalStat = {};

        let res = await this.testPaginTableService.getDiagnosedCountByUserId({userId: val.userId});
        
        this.totalStat = res;
    }
    
    protected toDetail(val)
    {
        this.$router.push({path: "/project/report",query: {id: val}});
    }

}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.imgUrl
{
    width: 80px;
    height: 80px;
    text-align: center;
    border-radius: 50%;
    min-width: 80px;
    background: #3375F4;
    color: #fff;
    font-size: 14px;
    line-height: 80px;
    overflow: hidden;
    .base-img
    {
        width: 80px;
        height: 80px;
        background-size: cover !important;
    }
    img
    {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
}
.diagnosis-content
{
    
    .diagnosis-title
    {
        margin-top: 25px;
        position: relative;
        height: 48px;
        background: #F4F7FC;
        line-height: 48px;
        padding: 0 29px;
        display: flex;

        .title
        {
            font-size: 14px;
            font-weight: 400;
            color: #182334;
            // flex: 1;
            flex-basis: 200px;
        }
        .diagnosis-info
        {
            
            text-align: left;
            font-size: 14px;
            font-weight: 400;
            color: #3375F4;
            // flex: 1;
        }
    }
    &-info
    {
        width: 100%;
        border: 1px solid #ECECEC;
        padding: 20px 20px;
        &.border-no-top
        {
            border-top: none;
        }
        .status-radius
        {
            width: 74px;
            height: 74px;
            min-width: 74px;
            background: #FFB119;
            border-radius: 50%;
            text-align: center;
            &-green
            {
                background: #1BBE86;
            }
            p:nth-child(1)
            {
                font-size: 24px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FEFEFE;
                margin-top: 11px;
            }
            p:nth-child(2)
            {
                font-size: 12px;
                font-weight: 400;
                color: #FEFEFE;
                padding-top: 8px;
            }
        }
    }
}

</style>