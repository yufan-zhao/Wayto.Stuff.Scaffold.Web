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
                        <!-- <i-button type="info" @click="onOperations('delete', detail)" v-permission="permissionCode.RECTIFY_SC">删除</i-button> -->
                        <!-- <i-button type="info" @click="onOperations('update', detail)" v-permission="permissionCode.RECTIFY_BJ">编辑</i-button> -->
                        <!-- <i-button type="info" v-if="detail.submitStatus" @click="onOperations('export', detail)" v-permission="permissionCode.REPORT_DC">诊治报告导出</i-button> -->

                    </section>
                </section>

                <i-tabs type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail"></u-info>
                    </i-tab-pane>
                    <i-tab-pane label="问题隐患" name="hidden">
                        <u-hidden :detail="detail" v-if="tabName === 'hidden'"></u-hidden>
                    </i-tab-pane>
                    <i-tab-pane label="负面清单" name="negative-hidden">
                        <u-positive-negative-hidden :detail="detail" :data="positiveNegativeData" v-if="tabName === 'negative-hidden'"></u-positive-negative-hidden>
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
import Hidden from "./subs/hidden.vue";
import PositiveNegativeHidden from "./subs/postive-negative-hidden.vue";

@component({
    components:
    {
        "u-info": SubInfo,
        "u-hidden": Hidden,
        "u-positive-negative-hidden": PositiveNegativeHidden
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
</style>