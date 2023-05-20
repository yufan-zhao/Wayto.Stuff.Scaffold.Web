<template>
    <div class="report-view">
        <div class="header">
            <div class="left"></div>
            <div class="right">
                <i-button type="primary" @click="onItemAdd">+ 现场设备</i-button>
            </div>
        </div>

        <i-table
            :columns="column"
            :data="data"
            border
        >
            <template slot-scope="{ row, index }" slot="action">
                <span class="action-slot">
                    <span class="btn" @click="onItemOps('update', row, index)">修改</span>
                    <span class="btn" @click="onItemOps('delete', row, index)">删除</span>
                </span>
            </template>
        </i-table>

        <main-modal
            ref="mainModal"
            :insert="mainService.insert.bind(mainService)"
            :update="mainService.update.bind(mainService)"
            :consultDetail="consultDetail"
            @on-refresh="initData"
        ></main-modal>
        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { ScoreReportDeviceService } from "src/services";
import { service } from "src/common/decorator";
import ReportDeviceDangerModal from "../_components/report-device-danger-modal.vue";

@component({
    components:
    {
        "main-modal": ReportDeviceDangerModal
    }
})
export default class ReportDeviceView extends View
{
    @service("ScoreReportDeviceService")
    private mainService: ScoreReportDeviceService;

    /**
     * 诊治计划id
     * @config
     */
    @config({required: true, type: Number, default: undefined})
    protected consultId: number | undefined;

    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    protected column =
    [
        {
            title: "现场主要设备",
            key: "content"
        },
        {
            title: "操作",
            slot: "action",
            width: 140
        }
    ];

    protected data: Array<any> = [];

    protected onItemAdd()
    {
        this._mainModal.open("insert", 0, null, this.consultId);
    }

    protected onItemOps(type: string, data: any)
    {
        if (type === "update")
        {
            this._mainModal.open("update", 0, data, this.consultId);
        }
        else if (type === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前项",
                onOk: async () => {
                    try
                    {
                        await this.mainService.delete(data.id);
                        this.$message.success("操作成功");
                        this.initData();
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

    /**
     * 诊治详情监听
     * @watch
     */
    @watch("consultDetail", {immediate: true})
    protected consultDetailWatcher(val: any)
    {
        if (val)
        {
            this.initData();
        }
    }

    private async initData()
    {
        const res = await this.mainService.query(this.consultId);

        this.data = res.content;
    }

    private get _warningModal()
    {
        return this.$refs["warningModal"] as any;
    }

    private get _mainModal()
    {
        return this.$refs["mainModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.report-view
{
    padding: 30px 20px;

    .header
    {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
}

@{deep}.action-slot
{
    .btn
    {
        margin-right: 20px;
        cursor: pointer;
        color: #3375F4;
        transition: color ease-in-out 0.3s;
    }
    .btn:hover
    {
        color: lighten(#3375F4, 10%);
    }
}
</style>