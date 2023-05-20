<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>
                        <i-poptip trigger="hover" placement="bottom-start" content="content" class="w500">
                                <span class="rows-1 dsib w500">{{ detail.projectName ||" - " }}</span>
                                <div slot="content">{{ detail.projectAddress ||" - " }}</div>
                        </i-poptip>
                        <!-- {{detail.projectName || "-"}} -->
                        <span v-if="detail.safetyDay" class="f14 font-online">安全生产：{{detail.safetyDay}}天</span>
                    </h3>

                    <section class="manage-detail-operation">
                        <i-button type="info"  v-if="tabName === 'info'" @click="onOperations('delete', detail)" v-permission="permissionCode.PROJECT_SC">删除</i-button>
                        <i-button type="info" v-if="tabName === 'info'" @click="onOperations('update', detail)" v-permission="permissionCode.PROJECT_BJ">编辑</i-button>
                        <i-button type="info" v-if="tabName === 'info'" class="setTime" @click="onOperations('saveTime', detail)" v-permission="permissionCode.PROJECT_AQGZJS">安全工作计时</i-button>
                        <i-button type="info" v-if="tabName === 'info'" class="setTime" @click="onOperations('refuse', detail)" v-permission="permissionCode.PROJECT_CZQKJZ">产值情况纠正</i-button>
                        <i-button type="info" v-if="tabName === 'video'" @click="onOperations('upload', detail)" v-permission="permissionCode.PROJECT_BJ">上传</i-button>
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
                    <i-tab-pane label="项目亮点" name="ProjectHighlights">
                        <u-project-highlights :detail="detail" v-if="tabName === 'ProjectHighlights'"></u-project-highlights>
                    </i-tab-pane>
                    <i-tab-pane label="诊治报告" name="rectify">
                        <u-rectify :detail="detail" v-if="tabName === 'rectify'"></u-rectify>
                    </i-tab-pane>
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
import SubInfo from "./subs/info.vue";
import AboutUnit from "./subs/about-unit.vue";
import Hidden from "./subs/hidden.vue";
import Video from "./subs/video.vue";
import Rectify from "./subs/rectify.vue";
import ProjectHighlights from "./subs/project-highlights.vue";

@component({
    components:
    {
        "u-info": SubInfo,
        "u-rectify": Rectify,
        "u-video": Video,
        "u-about-unit": AboutUnit,
        "u-hidden": Hidden,
        "u-project-highlights": ProjectHighlights
    }
})
export default class ManageDetailView extends CommonView
{
    @config({required: true, default: () => ({})})
    protected detail: any;

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
.setTime.ivu-btn.ivu-btn-info
{
    width: 110px;
}
</style>