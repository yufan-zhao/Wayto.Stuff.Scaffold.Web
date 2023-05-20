<template>
    <div class="special-rule-positive-negative-view">

        <i-tabs class="i-tabs" :animated="false">
            <i-tab-pane
                label="加分项"
            >
                <div class="tab-content">
                    <div class="left">
                        <Sidebar
                            :data="positiveData"
                            :specialTypeId="specialTypeId"
                            :isPositive="true"
                            @on-refresh="initData"
                            @on-node-change="onPositiveNodeChange"
                        ></Sidebar>
                    </div>

                    <div class="right">
                        <Content
                            v-if="currentPositiveNode"
                            :nodeName="currentPositiveNode && currentPositiveNode.name"
                            :nodeId="currentPositiveNode && currentPositiveNode.id"
                            :isPositive="true"
                        ></Content>
                        <div v-else>请选择左侧正负面类型节点</div>
                    </div>
                </div>
            </i-tab-pane>
            <i-tab-pane
                label="扣分项"
            >
                <div class="tab-content">
                    <div class="left">
                        <Sidebar
                            :data="negativeData"
                            :specialTypeId="specialTypeId"
                            :isPositive="false"
                            @on-refresh="initData"
                            @on-node-change="onNegativeNodeChange"
                        ></Sidebar>
                    </div>

                    <div class="right">
                        <Content
                            v-if="currentNegativeNode"
                            :nodeName="currentNegativeNode && currentNegativeNode.name"
                            :nodeId="currentNegativeNode && currentNegativeNode.id"
                            :isPositive="false"
                        ></Content>
                        <div v-else>请选择左侧正负面类型节点</div>
                    </div>
                </div>
            </i-tab-pane>
        </i-tabs>

        
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialListService } from "src/services";
import { service } from "src/common/decorator";

import Sidebar from "./special-rule-positive-negative-sidebar.vue";
import Content from "./special-rule-positive-negative-content.vue";

@component({
    components:
    {
        Sidebar,
        Content
    }
})
export default class SpecialRulePositiveNegative extends CommonView
{
    @service("SpecialListService")
    private specialListService: SpecialListService;

    @config({required: true, type: Number})
    protected specialTypeId: number;

    protected positiveData = [];

    protected negativeData = [];

    protected currentPositiveNode: any = null;

    protected currentNegativeNode: any = null;

    protected onPositiveNodeChange(nodeData: any)
    {
        if (nodeData)
        {
            this.currentPositiveNode = JSON.parse(JSON.stringify(nodeData));
        }
    }

    protected onNegativeNodeChange(nodeData: any)
    {
        if (nodeData)
        {
            this.currentNegativeNode = JSON.parse(JSON.stringify(nodeData));
        }
    }

    protected created()
    {
        this.initData();
    }

    private async initData()
    {
        const resList = await Promise.all([
            this.specialListService.tree(this.specialTypeId, true),
            this.specialListService.tree(this.specialTypeId, false)
        ]);

        this.positiveData = resList[0].content;
        this.negativeData = resList[1].content;
    }
}
</script>

<style lang="less" scoped>
.special-rule-positive-negative-view
{
    display: flex;
    width: 100%;
    height: 100%;

    .i-tabs
    {
        width: 100%;
        height: 100%;

        @{deep}.ivu-tabs-content
        {
            height: 100%;

            .ivu-tabs-tabpane
            {
                height: 100%;
            }
        }
    }
}

.tab-content
{
    display: flex;
    width: 100%;
    height: 100%;

    .left
    {
        flex: 0 0 auto;
        width: 240px;
        height: 100%;
        border-right: 1px solid #E9EBEC;
    }
    .right
    {
        height: 100%;
        width: 100%;
        padding-left: 20px;
    }
}

@{deep}.ivu-tabs-content
{
    overflow: auto;
}
</style>