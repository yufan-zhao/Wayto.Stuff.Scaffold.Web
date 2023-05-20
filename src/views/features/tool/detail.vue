<template>
    <div class="manage-detail">
        <div class="detail-content" v-if="detail.id">
            <div class="detail-content" >
                <section class="manage-detail-header">
                    <h3>{{detail.deviceName || "-"}}</h3>

                    <section class="manage-detail-operation">
                        <i-button type="info" v-if="!detail.inLibraryStatus" @click="onOperations('in', detail)">领用</i-button>
                        <i-button type="info"  v-if="detail.inLibraryStatus" @click="onOperations('out', detail)">归还</i-button>
                        <i-button type="info" @click="onOperations('delete', detail)">删除</i-button>
                        <i-button type="info" @click="onOperations('update', detail)">编辑</i-button>
                    </section>
                </section>

                <i-tabs type="card" :animated="false" v-model="tabName">
                    <i-tab-pane label="概况" name="info">
                        <u-info :detail="detail"></u-info>
                    </i-tab-pane>
                    <i-tab-pane label="存放信息" name="StoreInfo">
                        <u-store-info :detail="detail"></u-store-info>
                    </i-tab-pane>
                    <i-tab-pane label="检定信息" name="authenInfo">
                        <u-authen-info :detail="detail"></u-authen-info>
                    </i-tab-pane>
                    <i-tab-pane label="领用归还记录" name="records">
                        <u-records :detail="detail"></u-records>
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
import Records from "./subs/records.vue";
import StoreInfo from "./subs/store-info.vue";
import AuthenInfo from "./subs/authen-info.vue";

@component({
    components:
    {
        "u-info": SubInfo,
        "u-records": Records,
        "u-authen-info": AuthenInfo,
        "u-store-info": StoreInfo
    }
})
export default class ManageDetailView extends View
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