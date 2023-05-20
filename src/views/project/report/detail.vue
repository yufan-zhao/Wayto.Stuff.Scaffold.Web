<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>
                        <i-poptip trigger="hover" placement="bottom-start" content="content" style="max-width: 400px;">
                                <span class="rows-2 dsib" style="max-width: 400px;">{{detail.projectManager && detail.projectManager.projectName || "-"}}诊治报告</span>
                                <div slot="content">{{detail.projectManager && detail.projectManager.projectName || "-"}}诊治报告</div>
                        </i-poptip>
                    </h3>
                    <section class="manage-detail-operation">
                        <i-button type="info" v-if="detail.submitStatus" class="ex-btn" @click="onOperations('export', detail)" v-permission="permissionCode.REPORT_ZZBGDC">诊治报告导出</i-button>
                        <i-button type="info" class="ex-btn" @click="onOperations('exportppt', detail)" v-permission="permissionCode.REPORT_XCFKDC">现场反馈导出</i-button>

                        <i-button type="info" @click="onOperations('delete', detail)" v-permission="permissionCode.REPORT_SC">删除</i-button>
                        <i-button type="info" v-if="!detail.notarizeStatus && tabName !== 'video'" @click="onOperations('update', detail)" v-permission="permissionCode.REPORT_BJ">编辑</i-button>
                        <i-button type="info" v-if="!detail.notarizeStatus && tabName !== 'video'" @click="onOperations('compele', detail)" v-permission="permissionCode.REPORT_QRBG">确认报告</i-button>
                        <!-- <i-button type="info" v-if="detail.id && tabName !== 'video'" @click="onOperations('opinion', detail)">整改意见</i-button>
                        <i-button type="info" v-if="detail.id && tabName !== 'video'" @click="onOperations('notice', detail)" v-permission="permissionCode.REPORT_XMPJ">项目评价</i-button> -->
                        <i-button type="info" v-if="detail.notarizeStatus && tabName !== 'video'" @click="onOperations('upconfirm', detail)" v-permission="permissionCode.REPORT_BGJC">报告纠错</i-button>
                        <i-button type="info" v-if="tabName === 'video'" @click="onOperations('upload', detail)">上传</i-button>

                    </section>
                </section>

                <i-tabs class="manage-detail-tab" type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail" v-if="tabName === 'info'"></u-info>
                    </i-tab-pane>
                    <i-tab-pane label="宣贯会" name="proclamations">
                        <u-proclamations :detail="detail" v-if="tabName === 'proclamations'"></u-proclamations>
                    </i-tab-pane>
                    <i-tab-pane label="项目亮点" name="ProjectHighlights">
                        <u-project-highlights :detail="detail" v-if="tabName === 'ProjectHighlights'"></u-project-highlights>
                    </i-tab-pane>
                    <i-tab-pane label="履职情况" name="performing">
                        <u-performing :detail="detail" v-if="tabName === 'performing'"></u-performing>
                    </i-tab-pane>
                    <i-tab-pane label="现场设备" name="Equipments">
                        <u-equipments :detail="detail" v-if="tabName === 'Equipments'"></u-equipments>
                    </i-tab-pane>
                    <i-tab-pane label="风险概述" name="Risk">
                        <u-risk :detail="detail" v-if="tabName === 'Risk'"></u-risk>
                    </i-tab-pane>
                    <i-tab-pane label="危大工程" name="SupplementaryReports">
                        <u-supplementary-reports :detail="detail" v-if="tabName === 'SupplementaryReports'"></u-supplementary-reports>
                    </i-tab-pane>

                    <i-tab-pane label="整改通知" name="RectificationNotice">
                        <u-rectification-notice :detail="detail" v-if="tabName === 'RectificationNotice'"></u-rectification-notice>
                    </i-tab-pane>
                    <i-tab-pane label="正负面清单" name="positiveNegativeReport" >
                        <u-postive-negative-report :detail="detail" :data="positiveNegativeData" v-if="tabName === 'positiveNegativeReport'"></u-postive-negative-report>
                    </i-tab-pane>
                    <i-tab-pane label="评分情况" name="score">
                        <u-score :detail="detail" v-if="tabName === 'score'"></u-score>
                    </i-tab-pane>
                    <i-tab-pane label="安全知识" name="safty">
                        <u-safty :detail="detail" v-if="tabName === 'safty'"></u-safty>
                    </i-tab-pane>
                    <i-tab-pane label="安全日历" name="safty-calendar">
                        <u-safety-calendar :detail="detail" v-if="tabName === 'safty-calendar'"></u-safety-calendar>
                    </i-tab-pane>
                    <!-- <i-tab-pane label="整改意见" name="RectificationOpinion">
                        <u-rectification-opinion :detail="detail" v-if="tabName === 'RectificationOpinion'"></u-rectification-opinion>
                    </i-tab-pane>
                    <i-tab-pane label="项目评价" name="ProjectAppraise">
                        <u-project-appraise :detail="detail" v-if="tabName === 'ProjectAppraise'"></u-project-appraise>
                    </i-tab-pane> -->
                    <i-tab-pane label="文件" name="video">
                        <u-video :detail="detail" v-if="tabName === 'video'"></u-video>
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
import { ScorePositiveNegativeService } from "src/services";
import { service } from "src/common/decorator";

import SubInfo from "./subs/info.vue";
import Score from "./subs/score.vue";
import Safty from "./subs/safty.vue";
import SafetyCalendar from "./subs/safty-calendar.vue";
import Performing from "./subs/performing.vue";
import Proclamations from "./subs/proclamations.vue";
import ProjectHighlights from "./subs/project-highlights.vue";
import ProjectAppraise from "./subs/project-appraise.vue";
import RectificationNotice from "./subs/rectification-notice.vue";
import SupplementaryReports from "./subs/supplementary-reports.vue";
import RectificationOpinion from "./subs/rectification-opinion.vue";
import PostiveNegativeReport from "./subs/postive-negative-report.vue";
import Video from "./subs/video.vue";
import Equipments from "./subs/equipments.vue";
import Risk from "./subs/risk.vue";

@component({
    components:
    {
        "u-video": Video,
        "u-info": SubInfo,
        "u-safty": Safty,
        "u-safety-calendar": SafetyCalendar,
        "u-score": Score,
        "u-proclamations": Proclamations,
        "u-rectification-opinion": RectificationOpinion,
        "u-supplementary-reports": SupplementaryReports,
        "u-rectification-notice": RectificationNotice,
        "u-project-highlights": ProjectHighlights,
        "u-project-appraise": ProjectAppraise,
        "u-performing": Performing,
        "u-postive-negative-report": PostiveNegativeReport,
        "u-equipments": Equipments,
        "u-risk": Risk
    }
})
export default class ManageDetailView extends CommonView
{
    @service("ScorePositiveNegativeService")
    private scorePositiveNegativeService: ScorePositiveNegativeService;
    
    @config({required: true, default: () => ({})})
    protected detail: any;

    /**
     * 诊治id
     * @property
     */
    protected get consultId(): number
    {
        return this.detail ? this.detail.id : -1;
    }

    /**
     * 诊治的体系类型id
     * @property
     */
    protected get specialTypeId(): number
    {
        return this.detail ? this.detail.specialTypeId : -1;
    }

    /**
     * 当前标签
     * @protected
     * @property
     */
    protected tabName: string = "info";

    protected isShowPositiveNegativeReport: boolean = false;

    protected positiveNegativeData = [];

    /**
     * 操作事件
     * @protected
     * @member
     */
    protected onOperations(opName: string, item: any)
    {
        this.$emit("operations", opName, item);
    }

    @watch("detail", {immediate: true})
    protected async detailWatcher(val: any)
    {
        if (val && this.specialTypeId && this.consultId)
        {
            const res = await this.scorePositiveNegativeService.getItemInfoMends(this.consultId, this.specialTypeId);
            if (Array.isArray(res.content) && res.content.length > 0)
            {
                this.isShowPositiveNegativeReport = true;
            }
            this.positiveNegativeData = res.content;
        }
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/manage-detail";
.ex-btn
{
    min-width: 120px !important;
}
</style>