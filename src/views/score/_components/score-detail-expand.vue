<template>
    <div class="score-detail-expand">
        <i-table
            :columns="column"
            :data="dataCopy"
            :show-header="false"
            disabled-hover
        ></i-table>
    </div>
</template>

<script lang="ts">
import { component, config, View, watch } from "uxmid-vue-web";

@component({
    name: "score-detail-expand"
})
export default class ScoreDetailExpand extends View
{
    /**
     * 递归次数
     * @config
     */
    @config({required: true, type: Number, default: 1})
    protected level: number;

    /**
     * 表格数据
     * @config
     */
    @config({required: false, type: Array, default: () => []})
    protected data: Array<any>;

    /**
     * 是否可以继续递归折叠
     * @config
     */
    @config({required: false, type: Boolean, default: true})
    protected expandable: boolean;

    /**
     * 表格列
     * @property
     */
    protected get column()
    {
        if (this.expandable)
        {
            let placeholder = [];
            for (let i = 0; i < this.level; i++)
            {
                placeholder.push({width: 50});
            }
            return [
                ...placeholder,
                {
                    type: "expand",
                    width: 50,
                    render: (h, params) =>
                    {
                        return h(ScoreDetailExpand, {
                            props:
                            {
                                level: this.level + 1,
                                expandable: this.level < 2,
                                data: params.row.subs || []
                            }
                        });
                    }
                },
                {
                    title: "体系",
                    key: "name"
                },
                {
                    title: "得分情况",
                    key: "value"
                }
            ];
        }
        else
        {
            return [
                {
                    width: 50
                },
                {
                    title: "体系",
                    key: "name"
                },
                {
                    title: "得分情况",
                    key: "value"
                }
            ];
        }
    }

    /**
     * 数据源副本
     * @property
     */
    protected dataCopy = [];

    /**
     * 传入的数据监听
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        this.dataCopy = JSON.parse(JSON.stringify(val));
    }
}
</script>

<style lang="less" scoped>
.score-detail-expand
{
    // padding-left: 50px;
    background-color: #fff;

    .ivu-table-wrapper
    {
        margin-top: 0 !important;
    }
}
</style>