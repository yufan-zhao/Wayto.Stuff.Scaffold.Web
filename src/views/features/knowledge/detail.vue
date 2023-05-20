<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>{{detail.title || detail.parentPath || detail.monthBelong + "月" ||  "-"}} <span class="tips" v-if="detail.type">提示类型：{{detail.cautionType}}</span></h3>

                    <section class="manage-detail-operation">
                        <i-button type="info" @click="onOperations('delete', detail)" v-permission="deleteAuthCode">删除</i-button>
                        <i-button type="info" @click="onOperations('update', detail)" v-permission="editAuthCode">编辑</i-button>
                    </section>
                </section>

                <i-tabs type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail"></u-info>
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
import SubInfo from "./subs/info.vue";

@component({
    components:
    {
        "u-info": SubInfo
    }
})
export default class ManageDetailView extends View
{
    @config({required: true, default: () => ({})})
    protected detail: any;

    @config({required: false, type: String})
    protected editAuthCode: string;

    @config({required: false, type: String})
    protected deleteAuthCode: string;

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
.tips
{
    display: inline-block;
    font-weight: normal;
    font-size: 14px;
    color: #fff;
    background: #FF4D3F;
    border: 1px solid #FF4D3F;
    padding: 3px 8px;
    border-radius: 10px;
}
</style>