<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>
                        <i-poptip trigger="hover" placement="bottom-start" content="content" class="w500">
                                <span class="rows-1 dsib w500">{{detail.projectManager && detail.projectManager.projectName || "-"}}</span>
                                <div slot="content">{{detail.projectManager && detail.projectManager.projectName || "-"}}</div>
                        </i-poptip>
                    </h3>

                    <section class="manage-detail-operation">
                        <i-button type="info" @click="onOperations('delete', detail)" v-if="createPlanAuthCode !== permissionCode.PLAN_COMPLETE_CJJH" v-permission="permissionCode.PLAN_INCOMPLETE_SC">删除</i-button>
                        <i-button type="info" @click="onOperations('update', detail)" v-if="createPlanAuthCode !== permissionCode.PLAN_COMPLETE_CJJH" v-permission="permissionCode.PLAN_INCOMPLETE_BJ">编辑</i-button>
                        <i-button type="info" @click="onOperations('begin', detail)" v-if="createPlanAuthCode !== permissionCode.PLAN_COMPLETE_CJJH" v-permission="permissionCode.PLAN_INCOMPLETE_KSZZ">开始诊治</i-button>
                        <i-button type="info" @click="onOperations('copy', detail)" v-if="detail.status === 2" v-permission="createPlanAuthCode">创建计划</i-button>
                    </section>
                </section>

                <i-tabs type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail" v-if="tabName === 'info'"></u-info>
                    </i-tab-pane>
                    
                    <i-tab-pane label="相关单位" name="unit">
                        <u-about-unit :detail="detail" v-if="tabName === 'unit'"></u-about-unit>
                    </i-tab-pane>
                    <i-tab-pane label="问题隐患" name="hidden">
                        <u-hidden :detail="detail" v-if="tabName === 'hidden'"></u-hidden>
                    </i-tab-pane>
                    <i-tab-pane label="文件" name="video">
                        <u-video :detail="detail" v-if="tabName === 'video'"></u-video>
                    </i-tab-pane>
                    <!-- <i-tab-pane label="履职情况" name="performing">
                        <u-performing :detail="detail" v-if="tabName === 'performing'"></u-performing>
                    </i-tab-pane>
                    <i-tab-pane label="宣贯会" name="proclamations">
                        <u-proclamations :detail="detail" v-if="tabName === 'proclamations'"></u-proclamations>
                    </i-tab-pane>
                    <i-tab-pane label="项目亮点" name="ProjectHighlights">
                        <u-project-highlights :detail="detail" v-if="tabName === 'ProjectHighlights'"></u-project-highlights>
                    </i-tab-pane>
                    <i-tab-pane label="评分情况" name="score">
                        <u-score :detail="detail" v-if="tabName === 'score'"></u-score>
                    </i-tab-pane> -->
                    <!-- <i-tab-pane label="项目进度" name="ProjectAppraise">
                        <u-project-appraise :detail="detail" v-if="tabName === 'ProjectAppraise'"></u-project-appraise>
                    </i-tab-pane> -->
                    <!-- <i-tab-pane label="补充报告" name="SupplementaryReports">
                        <u-supplementary-reports :detail="detail" v-if="tabName === 'SupplementaryReports'"></u-supplementary-reports>
                    </i-tab-pane> -->
                    <i-tab-pane label="延期记录" name="records">
                        <u-records :detail="detail" v-if="tabName === 'records'"></u-records>
                    </i-tab-pane>
                </i-tabs>
            </div>
        </div>

        <div class="detail-nodata" v-if="!detail.id">
            <u-nodata></u-nodata>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import SubInfo from "./subs/info.vue";
import Records from "./subs/records.vue";
import Hidden from "./subs/hidden.vue";
import AboutUnit from "./subs/about-unit.vue";
import Proclamations from "./subs/proclamations.vue";
import ProjectHighlights from "./subs/project-highlights.vue";
import Performing from "./subs/performing.vue";
import Score from "./subs/score.vue";
import Video from "./subs/video.vue";
import SupplementaryReports from "./subs/supplementary-reports.vue";
import ProjectAppraise from "./subs/project-schedule.vue";

@component({
    components:
    {
        "u-info": SubInfo,
        "u-about-unit": AboutUnit,
        "u-score": Score,
        "u-video": Video,
        "u-hidden": Hidden,
        "u-records": Records,
        "u-supplementary-reports": SupplementaryReports,
        "u-project-appraise": ProjectAppraise,
        "u-proclamations": Proclamations,
        "u-project-highlights": ProjectHighlights,
        "u-performing": Performing
    }
})
export default class ManageDetailView extends CommonView
{
    @config({required: true, default: () => ({})})
    protected detail: any;

    /**
     * 创建计划权限码
     */
    @config({required: false, type: String})
    protected createPlanAuthCode: string;

    /**
     * 当前标签
     * @protected
     * @property
     */
    protected tabName: string = "info";

    /**
     * 操作事件
     * @protected
     * @member
     */
    protected onOperations(opName: string, item: any)
    {
        this.$emit("operations", opName, item);
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/manage-detail";
</style>