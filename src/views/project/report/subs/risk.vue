<template>
    <div class="sub-detail equipment-view">
        <i-table
            :columns="column"
            :data="data"
            border
            style="margin-top:0"
        >
            
        </i-table>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { ScoreReportDangerService } from "src/services";
import { service } from "src/common/decorator";

/**
 * 现场风险标签
 * @component
 */
@component
export default class EquipmentsView extends View
{
    @service("ScoreReportDangerService")
    private mainService: ScoreReportDangerService;

    /**
     * row detail
     * @config
     */
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

    protected column =
    [
        {
            title: "现场主要风险",
            key: "content"
        }
    ];

    protected data: Array<any> = [];

    @watch("consultId", {immediate: true})
    protected consultIdWatcher(val: number)
    {
        if (typeof val === "number" && val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        this.data.splice(0);
        const res = await this.mainService.query(this.consultId);
        this.data.push(...res.content);
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";

@{deep}.ivu-table-body
{
    .ivu-table-cell
    {
        background-color: #fff !important;
        transition: background-color ease-in-out 0.2s;
    }
    .ivu-table-row:hover
    {
        .ivu-table-cell
        {
            background-color: #ebf7ff !important;
        }
    }
}
</style>