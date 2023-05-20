<template>
    <div class="special-rule-module-view">
        <div class="header">
            <div class="left">
                模块
            </div>
            <div class="right">
                <i-button type="primary" @click="onModuleAdd">添加模块</i-button>
            </div>
        </div>
        <i-table
            :columns="column"
            :data="dataCopy"
            :span-method="handleSpan"
            border
        >
            <template slot-scope="{ row }" slot="second">
                <div class="special-list">
                    <span class="special-item" v-for="(item, i) in row.secondSpecials" :key="i">{{item.name}}</span>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="action">
                <span class="action-slot">
                    <span class="btn" @click="onModuleOps('update', row, index)">修改</span>
                    <span class="btn" @click="onModuleOps('delete', row, index)">删除</span>
                </span>
            </template>
        </i-table>

        <SpecialRuleModuleModal
            ref="specialRuleModuleModal"
            :specialTreeData="specialTreeData"
            @on-refresh="$emit('on-refresh')"
        ></SpecialRuleModuleModal>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import SpecialRuleModuleModal from "./special-rule-module-modal.vue";
import { SpecialNode, SpecialRuleModule } from "src/models";
import { service } from "src/common/decorator";
import { SpecialRuleService } from "src/services";

@component({
    components:
    {
        SpecialRuleModuleModal
    }
})
export default class SpecialRuleModuleView extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    /**
     * 体系树节点列表数据
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialTreeData: Array<SpecialNode>;

    /**
     * 体系类型id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected specialTypeId: number;

    /**
     * 规则模块列表数据
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<SpecialRuleModule>;

    /**
     * 表头列
     * @property
     */
    protected column: Array<any> =
    [
        {
            title: "模块名称",
            key: "moduleName",
            width: 160
        },
        {
            title: "体系项",
            key: "primarySpecialNodeName",
            width: 160
        },
        {
            title: "体系权重(%)",
            key: "primarySpecialNodeWeight",
            width: 120
        },
        {
            title: "子体系",
            slot: "second"
        },
        {
            title: "操作",
            slot: "action",
            width: 140
        }
    ];

    /**
     * 表格数据
     * @property
     */
    protected dataCopy: Array<any> = [];

    protected handleSpan({ row, column, rowIndex, columnIndex })
    {
        if (columnIndex === 0 || columnIndex === 4)
        {
            return row.spanInfo;
        }
    }

    /**
     * 新增规则模块
     * @protected
     */
    protected onModuleAdd()
    {
        this._specialRuleModuleModal.open("insert", null, this.specialTypeId);
    }

    protected onModuleOps(type: string, row: SpecialRuleModule, index: number)
    {
        if (type === "update")
        {
            this._specialRuleModuleModal.open("update", row, this.specialTypeId);
        }
        else if (type === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除指定的规则模块",
                onOk: async () =>
                {
                    try
                    {
                        await this.specialRuleService.virtualRemoveById(row.moduleId);
                        this.$message.success("操作成功");
                        this.$emit("on-refresh");
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
     * data数据监听
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<SpecialRuleModule>)
    {
        if (Array.isArray(val))
        {
            let valCopy = JSON.parse(JSON.stringify(val));
            let results: Array<any> = [];
            valCopy.forEach((item: SpecialRuleModule) =>
            {
                item.specials.forEach(jtem =>
                {
                    results.push({
                        moduleId: item.moduleId,
                        moduleName: item.moduleName,
                        primarySpecialNodeId: jtem.primarySpecialNodeId,
                        primarySpecialNodeName: jtem.primarySpecialNodeName,
                        primarySpecialNodeWeight: jtem.weight,
                        // secondSpecialNodeIds: jtem.secondSpecialNodeIds,
                        secondSpecials: jtem.secondSpecials,
                        secondSpecialNodeIds: Array.isArray(jtem.secondSpecials) ? jtem.secondSpecials.map(ktem => ktem.id) : [],
                        specials: item.specials
                    });
                });
            });

            if (results.length > 0)
            {
                let pointer = results[0];
                let num = 1;
                for(let i = 1; i < results.length; i++)
                {
                    let item = results[i];
                    if (item.moduleId === pointer.moduleId)
                    {
                        item.spanInfo = [1, 0];
                        num++;
                    }
                    else
                    {
                        pointer.spanInfo = [num, 1];
                        num = 1;
                        pointer = item;
                    }

                    if (i === results.length - 1)
                    {
                        pointer.spanInfo = [num, 1];
                    }
                }
            }

            this.dataCopy = results;
        }
    }

    private get _specialRuleModuleModal(): any
    {
        return this.$refs["specialRuleModuleModal"] as any;
    }

    /**
     * @ref warningModal
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.special-rule-module-view
{
    .header
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

@{deep}.special-list
{
    display: flex;
    flex-wrap: wrap;
    margin-top: 3px;

    .special-item
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