<template>
    <div class="safety-knowledge-table">
        <i-table
            :columns="column"
            :data="data"
            style="margin-top:0"
        >
            <!-- 视频图片 -->
            <template slot-scope="{ row }" slot="media">
                <div class="slot-container">
                    <div class="pic-list" v-previewer>
                        <span class="pic-item" v-for="(item, i) in row.commonFileList" :key="i">
                            <img :src="'/serverApi' + item.filePath" />
                        </span>
                    </div>
                </div>
            </template>

            <template slot-scope="{ row }" slot="export">
                <div class="slot-container status-slot" :class="{'disable': !row.exportStatus}">
                    <span class="dot"></span>
                    <span class="label">{{row.exportStatus ? "标记导出" : "未标记导出"}}</span>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="action">
                <span class="action-slot">
                    <span class="btn" v-if="row.exportStatus" @click="onItemOps('check-cancel', row, index)">取消标记展示</span>
                    <span class="btn" v-else @click="onItemOps('check', row, index)">标记报告中展示</span>
                </span>
            </template>
        </i-table>

        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { SafetyService, SafetyExportService } from "src/services";

/**
 * 安全日历表格组件
 * @component
 */
@component
export default class SafetyCalendarTableView extends View
{
    @service("SafetyService")
    private safetyService: SafetyService;

    @service("SafetyExportService")
    private safetyExportService: SafetyExportService;

    /**
     * 诊治id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected consultId: number;

    /**
     * 表格列
     * @property
     */
    protected column =
    [
        {
            title: "所属月份",
            key: "monthBelong"
        },
        {
            title: "提示类型",
            key: "cautionType"
        },
        {
            title: "内容",
            key: "content",
            tooltip: true
        },
        // {
        //     title: "提交人",
        //     key: "submitName"
        // },
        {
            title: "提交时间",
            key: "updateTime"
        },
        {
            title: "导出标记",
            slot: "export"
        },
        {
            title: "操作",
            slot: "action"
        }
    ];

    /**
     * 表格数据
     * @property
     */
    protected data: Array<any> = [];

    /**
     * 操作事件
     * @protected
     */
    protected onItemOps(type: string, data: any)
    {
        if (type === "check-cancel")
        {
            this._warningModal.open({
                title: "取消标记导出",
                content: "是否确定取消标记导出当前项",
                onOk: async () => {
                    try
                    {
                        await this.safetyExportService.saveOrUpdateExportStatus(this.consultId, data.id, false, 1);
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
        else if (type === "check")
        {
            this._warningModal.open({
                title: "标记导出",
                content: "是否确定标记导出当前项",
                onOk: async () => {
                    try
                    {
                        await this.safetyExportService.saveOrUpdateExportStatus(this.consultId, data.id, true, 1);
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

    @watch("consultId", {immediate: true})
    protected consultIdWatcher(val: number)
    {
        if (val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        this.data.splice(0);
        const res = await this.safetyService.calendarListDetails({searchType: 1, consultId: this.consultId});

        if (Array.isArray(res))
        {
            let list = res.filter(item =>
            {
                return {
                    id: item.id,
                    monthBelong: item.monthBelong,
                    cautionType: item.cautionType,
                    content: item.content,
                    updateTime: item.updateTime,
                    exportStatus: typeof item.exportStatus === "boolean" ? item.exportStatus : false
                };
            });
            this.data.push(...list);
        }
    }

    private get _warningModal()
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
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

@{deep}.status-slot
{
    position: relative;
    margin-right: 2px;

    .dot
    {
        position: relative;
        bottom: 2px;
        display: inline-block;
        height: 6px;
        width: 6px;
        background-color: #32BA52;
        border-radius: 50%;
        margin-right: 6px;
    }
    .label
    {
        color: #182334;
    }
}
@{deep}.status-slot.disable
{
    .dot
    {
        background-color: #C3C9CF;
    }
    .label
    {
        color: #838D9C;
    }
}

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