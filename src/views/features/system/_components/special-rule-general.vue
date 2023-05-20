<template>
    <div class="special-rule-general-view">
        <div class="table-header">
            <div class="left">
                项目综合得分规则
            </div>
            <div class="right">
                <i-button type="primary" @click="onAssign">权重分配</i-button>
            </div>
        </div>
        <div class="table-content">
            <i-table
                :columns="generalRuleColumns"
                :data="ruleData"
            >
            </i-table>
        </div>

        <div class="table-header">
            <div class="left">
                综合得分规则颜色设置
            </div>
            <div class="right">
                <i-button type="primary" @click="onAddColor">添加</i-button>
            </div>
        </div>
        <div class="table-content">
            <i-table
                :columns="generalColorColumns"
                :data="colorData"
            >
                <template slot-scope="{ row }" slot="color">
                    <span class="color-slot">
                        <span class="color-block" :style="{'background-color': row.color}"></span>
                        <span class="color-label">{{row.color}}</span>
                    </span>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <span class="action-slot">
                        <span class="btn" @click="onColorOps('update', row, index)">修改</span>
                        <span class="btn" @click="onColorOps('delete', row, index)">删除</span>
                    </span>
                </template>
            </i-table>
        </div>

        <SpecialRuleGeneralModal
            ref="specialRuleGeneralModal"
            :moduleList="moduleList"
            @on-refresh="initData"
        ></SpecialRuleGeneralModal>
        <SpecialRuleGeneralAssignModal
            ref="specialRuleGeneralAssignModal"
            @on-refresh="initData"
        ></SpecialRuleGeneralAssignModal>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import SpecialRuleGeneralModal from "./special-rule-general-modal.vue";
import SpecialRuleGeneralAssignModal from "./special-rule-general-assign-modal.vue";

import { service } from "src/common/decorator";
import { SpecialRuleService, SpecialColorService } from "src/services";

@component({
    components:
    {
        SpecialRuleGeneralModal,
        SpecialRuleGeneralAssignModal
    }
})
export default class SpecialRuleGeneral extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    @service("SpecialColorService")
    private specialColorService: SpecialColorService;

    @config({required: true, type: Number, default: -1})
    protected specialTypeId: number;

    /**
     * 模块列表
     * @property
     */
    protected moduleList: Array<any> = [];

    /**
     * 项目综合得分规则列模式
     * @property
     */
    protected generalRuleColumns: Array<any> =
    [
        {
            title: "序号",
            type: "index"
        },
        {
            title: "分值名称",
            key: "name"
        },
        {
            title: "分值权重(%)",
            key: "weight"
        }
    ];

    /**
     * 项目综合得分颜色设置列模式
     * @property
     */
    protected generalColorColumns: Array<any> =
    [
        {
            title: "序号",
            type: "index"
        },
        {
            title: "分数设置",
            key: "scoreSetting"
        },
        {
            title: "得分名称",
            key: "scoreName"
        },
        {
            title: "代表颜色",
            slot: "color"
        },
        {
            title: "操作",
            slot: "action"
        }
    ];

    protected ruleData: Array<any> = [];

    protected colorData: Array<any> = [];

    protected onAssign()
    {
        this._specialRuleGeneralAssignModal.open(this.ruleData);
    }

    protected onAddColor()
    {
        this._specialRuleGeneralModal.open("insert", false, this.specialTypeId, null);
    }

    protected onColorOps(type: "update" | "delete", row: any, i: number)
    {
        if (type === "update")
        {
            this._specialRuleGeneralModal.open("update", false, this.specialTypeId, row);
        }
        else
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除指定的规则颜色",
                onOk: async () =>
                {
                    try
                    {
                        await this.specialColorService.delete(row.id);
                        // await this.specialService.deleteById(item.id, item.level, item.specialTypeId);
                        this.$message.success("操作成功");
                        this.initData();
                        // this.$emit("on-node-change", null);
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

    protected onRuleOps(type: "update" | "delete", row: any, i: number)
    {
        if (type === "update")
        {
            this._specialRuleGeneralModal.open("update", true, this.specialTypeId, row);
        }
        else
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除指定的规则",
                onOk: async () =>
                {
                    try
                    {
                        await this.specialRuleService.deleteGeneralRule(row.id);
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

    @watch("specialTypeId", {immediate: true})
    protected specialTypeIdWatcher(val: number)
    {
        if (val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        // console.log("规则列表", this.ruleData);
        const res = await this.specialRuleService.queryGeneralRules(this.specialTypeId);
        this.ruleData = res.content;

        const colorRes = await this.specialColorService.query();
        this.colorData = colorRes.content;
    }

    /**
     * @ref warningModal
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }

    private get _specialRuleGeneralModal(): SpecialRuleGeneralModal
    {
        return this.$refs["specialRuleGeneralModal"] as SpecialRuleGeneralModal;
    }

    private get _specialRuleGeneralAssignModal(): any
    {
        return this.$refs["specialRuleGeneralAssignModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.special-rule-general-view
{
    .table-header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
        margin-bottom: 16px;

        .left
        {
            font-size: 18px;
            font-weight: bold;
        }
    }
    .table-content
    {
        margin-bottom: 67px;
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

@{deep}.color-slot
{
    display: flex;
    align-items: center;
    .color-block
    {
        width: 16px;
        height: 16px;
        margin-right: 5px;
    }
}

@{deep}.info-list
{
    display: flex;
    flex-wrap: wrap;
    margin-top: 3px;

    .info-item
    {
        padding: 0 4px;
        border-radius: 4px;
        color: #fff;
        background-color: #3375F4;
        margin-right: 3px;
        margin-bottom: 3px;
    }
}
</style>