<template>
    <i-table
        class="special-danger-tips-table"
        :show-header="true"
        :columns="columns"
        :data="data"
        border
    >
        <template slot-scope="{ row, index }" slot="action">
            <span class="action-slot">
                <span class="btn" @click="onSpecialDangerTipOps('edit', row, index)">修改</span>
                <span class="btn" @click="onSpecialDangerTipOps('delete', row, index)">删除</span>
            </span>
        </template>
    </i-table>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialDangerTipService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class SpecialDangerTips extends View
{
    @service("SpecialDangerTipService")
    private specialDangerTipService: SpecialDangerTipService;
    /**
     * 当前体系树节点下的隐患项详情信息
     * @config
     */
    @config({required: true})
    protected parentDetail: any;

    protected columns: Array<any> =
    [
        {
            title: "问题描述",
            key: "questionDescription"
        },
        {
            title: "问题隐患等级",
            key: "hazardLevelName"
        },
        {
            title: "扣分",
            key: "deduction"
        },
        {
            title: "整改建议",
            key: "rectifyDescription"
        },
        {
            title: "整改时间",
            width: 100,
            render: (h, {row}) =>
            {
                if (typeof row.checkDay === "undefined")
                {
                    return h("span", "-");
                }
                else
                {
                    if (row.checkDay === "0")
                    {
                        return h("span", "无");
                    }
                    else if (row.checkDay === 15)
                    {
                        return h("span", "半个月");
                    }
                    else if (row.checkDay === 30)
                    {
                        return h("span", "1个月");
                    }
                    else
                    {
                        return h("span", row.checkDay + "天");
                    }
                    
                }
            }
        },
        {
            title: "操作",
            slot: "action",
            width: 155
        }
    ];

    protected data = [];

    protected onSpecialDangerTipOps(type: string, data: any, index: number)
    {
        if (type === "edit")
        {
            this.$emit("on-ops", "tip-edit", {parent: this.parentDetail, child: data}, index);
        }
        else if (type === "delete")
        {
            this.$emit("on-ops", "tip-delete", {parent: this.parentDetail, child: data}, index);
        }
    }

    @watch("parentDetail", {immediate: true})
    protected parentDetailWatcher(val: any)
    {
        if (val && val.id)
        {
            this.initData();
        }
        else
        {
            this.data = [];
        }
    }

    private async initData()
    {
        const res = await this.specialDangerTipService.query(this.parentDetail.id);
        this.data = res.content;
    }
}
</script>

<style lang="less" scoped>
.special-danger-tips-table
{
    @{deep}.ivu-table-tbody
    {
        td
        {
            // background-color: #ddd;
        }
        
    }
}

</style>