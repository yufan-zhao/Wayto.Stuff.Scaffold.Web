<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>{{detail.deptName || "-"}}</h3>

                    <section class="manage-detail-operation">
                        <i-button type="info" @click="onOperations('delete', detail)" v-permission="permissionCode.USER_OWNER_SC">删除</i-button>
                        <i-button type="info" @click="onOperations('update', detail)" v-permission="permissionCode.USER_OWNER_BJ">编辑</i-button>
                        <i-button type="info" @click="onOperations('reset', detail)" v-permission="permissionCode.USER_OWNER_SC">重置密码</i-button>
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
import CommonView from "src/views/common-view";
import SubInfo from "./subs/info.vue";

@component({
    components:
    {
        "u-info": SubInfo
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
</style>