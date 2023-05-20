<template>
    <div class="special-rule-total-view">
        <!-- <div class="header">
            <div class="left">
            总分计算规则
            </div>
            <div class="right">
                <i-button type="primary" @click="onRuleInfoOps('insert')">添加</i-button>
            </div>
        </div> -->

        <div class="content">
            <!-- 规则模块 -->
            <SpecialRuleModuleView
                :data="data"
                :specialTypeId="specialTypeId"
                :specialTreeData="specialTreeData"
                @on-refresh="initData"
            ></SpecialRuleModuleView>

            <!-- 分值 -->
            <SpecialRuleScoreView
                style="margin-top: 20px;"
                :data="generalRules"
                :moduleList="moduleList"
                :specialTypeId="specialTypeId"
                @on-refresh="initData"
            ></SpecialRuleScoreView>
        </div>

        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialNode, SpecialRuleModule } from "src/models";
import { service } from "src/common/decorator";
import { SpecialRuleService, SpecialService } from "src/services";

import SpecialRuleModuleView from "./special-rule-module.vue";
import SpecialRuleScoreView from "./special-rule-score.vue";

@component({
    components:
    {
        SpecialRuleModuleView,
        SpecialRuleScoreView
    }
})
export default class SpecialRuleTotal extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    @service("SpecialService")
    private specialService: SpecialService;

    @config({required: true, type: Number, default: -1})
    protected specialTypeId: number;

    /**
     * 规则模块列表
     * @property
     */
    protected data: Array<SpecialRuleModule> = [];

    protected generalRules: Array<any> = [];

    protected specialTreeData: Array<SpecialNode> = [];

    protected moduleList: Array<any> = [];

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
        try
        {
            const resList = await Promise.all([
                // 分值列表
                this.specialRuleService.queryGeneralRules(this.specialTypeId),
                // 一级体系
                this.specialService.getSpecialListByParentId(this.specialTypeId),
                // 模块列表
                this.specialRuleService.queryRuleModule(this.specialTypeId),
                // 新模块列表选项
                this.specialRuleService.getSpecialCustomRuleDto(this.specialTypeId)
            ]);

            this.generalRules = resList[0].content;
            this.specialTreeData = resList[1];
            this.data = resList[2];
            this.moduleList = resList[3];
        }
        catch(err)
        {
            console.error(err);
            this.$message.error(err.msg || err.message);
        }
    }

    /**
     * 警告弹层
     * @private
     * @returns {any}
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.special-rule-total-view
{
    height: 100%;

    .header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
        margin-bottom: 16px;
        border-bottom: 1px solid #E9EBEC;

        .left
        {
            font-size: 18px;
            font-weight: bold;
        }
    }

    .content
    {
        height: calc(100% - 90px);
        overflow: auto;
        // padding-bottom: 70px;
    }
    .content::-webkit-scrollbar
    {
        width: 0;
    }
    .content::-webkit-scrollbar-track
    {
        width: 0;
    }
}
</style>