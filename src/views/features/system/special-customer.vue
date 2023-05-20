<template>
    <div class="system-view system-customer">
        <div class="customer-switcher-container">
            <SpecialCustomerSwitcher @on-customer-change="onCustomerChange"></SpecialCustomerSwitcher>
        </div>

        <div class="header">
            <special-header
                :specialTypes="specialTypes"
                :customerId="currentCustomerId"
                :deleteAuthCode="permissionCode.SYSTEM_CUSTOMER_SC"
                :addAuthCode="permissionCode.SYSTEM_CUSTOMER_XZ"
                @on-special-type-change="onSpecialTypeChange"
                @on-special-type-refresh="onSpecialTypeRefresh"
            ></special-header>
        </div>

        <div class="content" v-if="currentSpecialTypeId > -1">
            <div class="left" :style="leftStyles">
                <special-sidebar
                    :isCustomer="true"
                    :specialTypeId="currentSpecialTypeId"
                    :positiveNegativeStatus="currentSpecialTypePositveNegativeStatus"
                    :specialTreeData="specialTreeData"
                    :editAuthCode="permissionCode.SYSTEM_CUSTOMER_BJ"
                    :deleteAuthCode="permissionCode.SYSTEM_CUSTOMER_SC"
                    :addAuthCode="permissionCode.SYSTEM_CUSTOMER_XZ"
                    @on-node-change="onSystemNodeChange"
                    @on-rule-active="onRuleActive"
                    @on-refresh="onSidebarRefresh"
                ></special-sidebar>
            </div>

            <div class="right" :style="leftStyles">
                <special-dangers
                    v-if="ruleIndex === -1 && isShowDangers"
                    :nodeData="currentNodeData"
                    :dangerData="currentNodeDangerData"
                    :editAuthCode="permissionCode.SYSTEM_CUSTOMER_BJ"
                    :deleteAuthCode="permissionCode.SYSTEM_CUSTOMER_SC"
                    :addAuthCode="permissionCode.SYSTEM_CUSTOMER_XZ"
                    @on-refresh="onSpecialDangerRefresh"
                ></special-dangers>
                <div class="tip" v-if="ruleIndex === -1 && !isShowDangers">
                    第三级体系才有体系隐患
                </div>
                <SpecialRuleGeneral v-if="ruleIndex === 0" :specialTypeId="currentSpecialTypeId"></SpecialRuleGeneral>
                <SpecialRuleTotal v-if="ruleIndex === 1" :specialTypeId="currentSpecialTypeId"></SpecialRuleTotal>
                <SpecialRulePositiveNegative v-if="ruleIndex === 2" :specialTypeId="currentSpecialTypeId"></SpecialRulePositiveNegative>
                <SpecialRuleEpicDanger v-if="ruleIndex === 3" :specialTypeId="currentSpecialTypeId"></SpecialRuleEpicDanger>
            </div>
        </div>
        <div class="content" v-else>
            请选择体系类型
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { service } from "src/common/decorator";
import { SpecialType, SpecialNode, SpecialDanger } from "src/models";
import { SpecialTypeService, SpecialService, SpecialDangerService } from "src/services";

import SpecialHeader from "./_components/special-header.vue";
import SpecialSidebar from "./_components/special-sidebar.vue";
import SpecialDangers from "./_components/special-dangers.vue";
import SpecialCustomerSwitcher from "./_components/special-customer-switcher.vue";
import SpecialRuleGeneral from "./_components/special-rule-general.vue";
import SpecialRuleTotal from "./_components/special-rule-total.vue";
import SpecialRulePositiveNegative from "./_components/special-rule-positive-negative.vue";
import SpecialRuleEpicDanger from "./_components/special-rule-epic-danger.vue";

@component({
    components:
    {
        SpecialHeader,
        SpecialSidebar,
        SpecialDangers,
        SpecialCustomerSwitcher,
        SpecialRuleGeneral,
        SpecialRuleTotal,
        SpecialRulePositiveNegative,
        SpecialRuleEpicDanger
    }
})
export default class SystemCustomer extends CommonView
{
    @service("SpecialTypeService")
    private specialTypeService: SpecialTypeService;

    @service("SpecialService")
    private specialService: SpecialService;

    @service("SpecialDangerService")
    private specialDangerService: SpecialDangerService;

    /**
     * 左侧样式
     * @property
     */
    protected get leftStyles()
    {
        const leftHeight = window.innerHeight - 110 - 20 - 52 - 30 - 45 - 24;
        return {
            height: leftHeight + "px"
        };
    }

    /**
     * 当前的客户id
     * @property
     */
    protected currentCustomerId: number = -1;

    /**
     * 体系类型列表
     * @property
     */
    protected specialTypes: Array<SpecialType> = [];

    /**
     * 当前体系类型下的体系树数据
     * @property
     */
    protected specialTreeData: Array<SpecialNode> = [];

    /**
     * 当前激活的体系类型id
     * @property
     */
    protected currentSpecialTypeId: number = -1;

    /**
     * 当前选中的体系类型是否需要正负面反馈设置
     * @property
     */
    protected currentSpecialTypePositveNegativeStatus: boolean = false;

    /**
     * 当前选中的体系树节点
     * @property
     */
    protected currentNodeData: SpecialNode = null;

    /**
     * 当前体系树节点下的体系隐患列表
     * @property
     */
    protected currentNodeDangerData: Array<SpecialDanger> = [];

    protected isShowDangers = false;

    /**
     * 右侧展示区域索引
     * -1: 体系节点隐患列表
     * 0: 项目综合得分规则
     * 1: 总分计算规则
     * 2: 正负面清单设置
     */
    protected ruleIndex: number = -1;

    /**
     * 体系类型变动事件
     * @protected
     */
    protected async onSpecialTypeChange(item: SpecialType)
    {
        if (item)
        {
            this.currentSpecialTypeId = item.id;
            this.currentNodeData = null;
            this.currentSpecialTypePositveNegativeStatus = Boolean(item.isList);
            this.specialTreeData = [];
            this.specialTreeData = await this.specialService.getSpecialListByParentId(item.id);
        }
        else
        {
            this.currentSpecialTypeId = -1;
            this.currentNodeData = null;
            this.specialTreeData = [];
        }
    }

    /**
     * 侧栏数刷新
     * @protected
     */
    protected async onSidebarRefresh()
    {
        this.specialTreeData = [];
        this.specialTreeData = await this.specialService.getSpecialListByParentId(this.currentSpecialTypeId);
    }

    /**
     * 体系隐患刷新事件
     * @protected
     */
    protected async onSpecialDangerRefresh()
    {
        this.currentNodeDangerData = await this.specialDangerService.getSpecialDangersBySpecialNodeId(this.currentNodeData.id);
    }

    /**
     * 体系树节点选择变更事件
     * @protected
     */
    protected async onSystemNodeChange(nodeData: SpecialNode)
    {
        this.ruleIndex = -1;
        this.$set(this, "currentNodeData", nodeData);
        if (nodeData && nodeData.level === 3)
        {
            this.isShowDangers = true;
            this.currentNodeDangerData = await this.specialDangerService.getSpecialDangersBySpecialNodeId(nodeData.id);
        }
        else
        {
            this.isShowDangers = false;
            this.currentNodeDangerData = [];
        }
    }

    protected onRuleActive(index: number)
    {
        this.ruleIndex = index;
    }

    /**
     * 客户切换事件
     * @protected
     */
    protected async onCustomerChange(customerId: number)
    {
        this.currentCustomerId = customerId;
        this.specialTypes = await this.specialTypeService.specialTypes(customerId);
    }

    /**
     * 客户体系类型刷新
     * @protected
     */
    protected async onSpecialTypeRefresh()
    {
        this.specialTypes = await this.specialTypeService.specialTypes(this.currentCustomerId);
    }

    protected mounted()
    {
        // TODO 收到窗口size变动消息处理计算高度问题
    }

    /**
     * vue钩子
     * @created
     */
    protected async created()
    {
        // this.specialTypes = await this.specialTypeService.specialTypes();
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/system";

.system-customer
{
    display: flex;
    flex-direction: column;
    padding: 20px 0 0px 30px;
    height: 100%;

    .customer-switcher-container
    {
        flex: 0 0 auto;
        height: 45px;
        margin-bottom: 24px;
        padding-right: 30px;
    }

    .header
    {
        flex: 0 0 auto;
        height: 52px;
        padding-right: 30px;
        width: 100%;
    }

    .content
    {
        display: flex;
        height: 100%;
        width: 100%;
        padding-top: 30px;

        .left
        {
            flex: 0 0 auto;
            width: 380px;
            border-right: 1px solid #E9EBEC;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .right
        {
            width: 100%;
            padding-left: 30px;
            padding-right: 30px;
            overflow: auto;
        }
    }
}
</style>