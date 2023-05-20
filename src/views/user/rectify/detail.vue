<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>{{detail.name || "-"}}</h3>

                    <section class="manage-detail-operation">
                        <i-button type="info" @click="onOperations('delete', detail)" v-permission="permissionCode.USER_RECTIFY_SC">删除</i-button>
                        <i-button type="info" @click="onOperations('update', detail)" v-permission="permissionCode.USER_RECTIFY_BJ">编辑</i-button>
                        <i-button type="info" @click="onOperations('reset', detail)" v-permission="permissionCode.USER_RECTIFY_CZ">重置密码</i-button>
                    </section>
                </section>

                <i-tabs type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail" v-if="tabName === 'info'"></u-info>
                    </i-tab-pane>
                    <i-tab-pane label="工作记录" name="WorkRecords">
                        <u-work-records :detail="detail" v-if="tabName === 'WorkRecords'"></u-work-records>
                    </i-tab-pane>
                    <i-tab-pane label="文件图片" name="videos">
                        <u-videos :detail="detail" v-if="tabName === 'videos'"></u-videos>
                    </i-tab-pane>
                    <i-tab-pane label="工作轨迹" name="locus"  :selectListObj="selectListObj">
                        <u-locus :detail="detail" v-if="tabName === 'locus'"></u-locus>
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
import Videos from "./subs/video.vue";
import Locus from "./subs/locus.vue";
import WorkRecords from "./subs/work-records.vue";

@component({
    components:
    {
        "u-info": SubInfo,
        "u-videos": Videos,
        "u-locus": Locus,
        "u-work-records": WorkRecords
    }
})
export default class ManageDetailView extends CommonView
{
    @config({required: true, default: () => ({})})
    protected detail: any;

    @config({required: true, default: () => ({})})
    protected selectListObj: any;

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