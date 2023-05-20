<template>
    <div class="special-rule-epic-danger-view">
        <div class="left">
            <Sidebar
                :data="epicDangerTreeData"
                :specialTypeId="specialTypeId"
                @on-refresh="initData"
                @on-node-change="onPositiveNodeChange"
            ></Sidebar>
        </div>

        <div class="right">
            <Content
                v-if="currentPositiveNode"
                :nodeName="currentPositiveNode && currentPositiveNode.name"
                :nodeId="currentPositiveNode && currentPositiveNode.id"
            ></Content>
            <div v-else>请选择左侧危大工程类型节点</div>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialEpicDangerService } from "src/services";
import { service } from "src/common/decorator";

import Sidebar from "./special-rule-epic-danger-sidebar.vue";
import Content from "./special-rule-epic-danger-content.vue";

@component({
    components:
    {
        Sidebar,
        Content
    }
})
export default class SpecialRuleEpicDanger extends View
{
    @service("SpecialEpicDangerService")
    private specialEpicDangerService: SpecialEpicDangerService;
    
    @config({required: true, type: Number})
    protected specialTypeId: number;

    protected epicDangerTreeData: Array<any> = [];

    protected currentPositiveNode: any = null;

    protected onPositiveNodeChange(nodeData: any)
    {
        if (nodeData)
        {
            this.currentPositiveNode = JSON.parse(JSON.stringify(nodeData));
        }
    }

    protected async initData()
    {
        let res = await this.specialEpicDangerService.getSpecialDangerList(this.specialTypeId);
        this.epicDangerTreeData = res.content;
    }

    protected created()
    {
        this.initData();
    }
}
</script>

<style lang="less" scoped>
.special-rule-epic-danger-view
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
</style>