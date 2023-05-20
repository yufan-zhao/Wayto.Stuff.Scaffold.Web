<template>
    <div class="special-rule-score-view">
        <div class="header">
            <div class="left">
                分值
            </div>
            <div class="right">
                <i-button type="primary" @click="onRowAdd">添加分值</i-button>
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
                    <span class="btn" @click="onRowOps('update', row, index)">修改</span>
                    <span class="btn" @click="onRowOps('delete', row, index)">删除</span>
                </span>
            </template>
        </i-table>

        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
        <SpecialRuleScoreModal
            ref="mainModal"
            :moduleList="moduleList"
            @on-refresh="$emit('on-refresh')"
        ></SpecialRuleScoreModal>
    </div>
</template>

<script lang="ts">
import { EnumUtils } from "uxmid-core";
import { component, View, config, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { SpecialRuleService } from "src/services";
import { SpecialRuleModule } from "src/models";
import { SPECIAL_RULE_TYPE } from "src/enums";

import SpecialRuleScoreModal from "./special-rule-score-modal.vue";

@component({
    components:
    {
        SpecialRuleScoreModal
    }
})
export default class SpecialRuleScoreView extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

    @config({required: true, type: Array, default: () => []})
    protected moduleList: Array<any>;

    @config({required: true, type: Number})
    protected specialTypeId: number;

    protected column =
    [
        {
            title: "分值名称",
            key: "scoreName"
        },
        {
            title: "类型",
            render: (h, {row}) =>
            {
                const target = EnumUtils.getEntry(row.type, SPECIAL_RULE_TYPE);
                if (target)
                {
                    return h("span", target.alias);
                }
                else
                {
                    return h("span", "-");
                }
            }
        },
        {
            title: "包含模块",
            key: "moduleName"
        },
        {
            title: "模块权重(%)",
            key: "moduleWeight"
        },
        {
            title: "操作",
            slot: "action",
            width: 140
        }
    ];

    protected dataCopy = [];

    protected handleSpan({ row, column, rowIndex, columnIndex })
    {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4)
        {
            return row.spanInfo;
        }
    }

    protected onRowAdd()
    {
        this._mainModal.open("insert", null, this.specialTypeId);
    }

    protected onRowOps(type: string, row: any)
    {
        if (type === "update")
        {
            this._mainModal.open("update", row, this.specialTypeId);
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
                        await this.specialRuleService.deleteGeneralRule(row.scoreId);
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

    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        let valCopy = JSON.parse(JSON.stringify(val));
        let target = [];
        if (Array.isArray(valCopy))
        {
            valCopy.forEach(item =>
            {
                if (Array.isArray(item.ruleModelInfoVos))
                {
                    item.ruleModelInfoVos.forEach(jtem =>
                    {
                        target.push({
                            id: item.id,
                            scoreId: item.id,
                            scoreName: item.name,
                            type: item.type,
                            moduleKeyId: jtem.id,
                            moduleId: jtem.modelId,
                            moduleName: jtem.modelName,
                            moduleWeight: jtem.weight,
                            ruleId: jtem.ruleId,
                            modules: item.ruleModelInfoVos.map(ktem =>
                            {
                                return {
                                    id: ktem.id,
                                    moduleKeyId: ktem.id,
                                    moduleId: ktem.modelId,
                                    moduleName: ktem.modelName,
                                    moduleWeight: ktem.weight,
                                    type: ktem.type,
                                    moduleUuId: ktem.uuId
                                };
                            })
                        });
                    });
                }
                else
                {
                    console.error("严重的数据异常，分值没有包含模块");
                }
            });

            if (target.length > 0)
            {
                let pointer = target[0];
                let num = 1;
                for(let i = 1; i < target.length; i++)
                {
                    let item = target[i];
                    if (item.scoreId === pointer.scoreId)
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

                    if (i === target.length - 1)
                    {
                        pointer.spanInfo = [num, 1];
                    }
                }
            }
        }
        this.dataCopy = target;
    }

    private get _mainModal(): any
    {
        return this.$refs["mainModal"] as any;
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
.special-rule-score-view
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
</style>