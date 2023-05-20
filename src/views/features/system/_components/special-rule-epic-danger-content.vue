<template>
    <div class="special-rule-positive-negative-content">
        <div class="header">
            <div class="left">
                {{nodeName}}
            </div>
            <div class="right">
                <i-button type="primary" @click="onItemAdd">添加</i-button>
            </div>
        </div>

        <div class="content">
            <i-table
                :data="data"
                :columns="column"
            >
                <template slot-scope="{ row }" slot="status">
                    <span class="status-slot">
                        <span class="dot" :class="{disable: !row.state}"></span>
                        <span class="label">{{row.state ? "启用" : "禁用"}}</span>
                    </span>
                </template>

                <template slot-scope="{ row, index }" slot="action">
                    <span class="action-slot">
                        <span class="btn" @click="onItemOps('update', row, index)">修改</span>
                        <span class="btn" @click="onItemOps('delete', row, index)">删除</span>
                    </span>
                </template>
            </i-table>
        </div>

        <MainModal
            ref="mainModal"
            @on-refresh="initData"
        ></MainModal>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialEpicDangerItemService } from "src/services";
import { service } from "src/common/decorator";

import MainModal from "./special-rule-epic-danger-item-modal.vue";

@component({
    components:
    {
        MainModal
    }
})
export default class SpecialRulePositiveNegativeContent extends CommonView
{
    @service("SpecialEpicDangerItemService")
    private specialEpicDangerItemService: SpecialEpicDangerItemService;

    @config({required: false, type: String, default: ""})
    protected nodeName: string;

    @config({required: false, type: Number, default: -1})
    protected nodeId: number;

    protected data: Array<any> = [];

    protected column: Array<any> =
    [
        {
            title: "危大描述",
            key: "dangerDetails"
        },
        // {
        //     title: "扣分",
        //     key: "score"
        // },
        {
            title: "超危大描述",
            key: "dangerPlusDetails"
        },
        {
            title: "状态",
            slot: "status"
        },
        {
            title: "操作",
            slot: "action"
        }
    ];

    @watch("nodeId", { immediate: true })
    protected nodeIdWatcher(nodeId: number)
    {
        this.data = [];
        if (nodeId > 0)
        {
            this.initData();
        }
    }

    protected onItemAdd()
    {
        this._mainModal.open("insert", null, this.nodeId);
    }

    protected onItemOps(type: string, row: any, index: number)
    {
        if (type === "update")
        {
            this._mainModal.open("update", row, this.nodeId);
        }
        else if (type === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除指定危大工程项",
                onOk: async () =>
                {
                    try
                    {
                        await this.specialEpicDangerItemService.virtualRemoveById(row.id);
                        this.$message.success("操作成功");
                        // this.$emit("on-refresh");
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

    protected async initData()
    {
        const res = await this.specialEpicDangerItemService.query(this.nodeId);
        this.data = res.content;
    }

    private get _mainModal()
    {
        return this.$refs["mainModal"] as any;
    }

    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.special-rule-positive-negative-content
{
    height: 100%;

    .header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .left
        {
            font-size: 18px;
            font-weight: bold;
        }
    }

    .content
    {
        width: 100%;
        height: 100%;
    }
}

@{deep}.status-slot
{
    display: flex;
    align-items: center;

    .dot
    {
        border-radius: 50%;
        width: 6px;
        height: 6px;
        margin-right: 4px;
        background-color: #32BA52;
    }
    .dot.disable
    {
        background-color: #FF4D3F;
    }
}
@{deep}.action-slot
{
    .btn
    {
        margin-right: 10px;
        color: #3375F4;
        cursor: pointer;
    }
    .btn:hover
    {
        color: darken(#3375F4, 10%);
    }
}
</style>