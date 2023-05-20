<template>
    <i-table  style="max-height: 600px;overflow-y: scroll;"
        class="table-normal"
        highlight-row
        :data="rankDataCopy"
        :columns="unitColumuns"
        @on-row-click="onRankItemClick"
        @on-sort-change="onSortChange"
    >
        <template slot="rank" slot-scope="{ row }">
            {{row.sort}}
        </template>
        <template slot="content" slot-scope="{ row }">
            <div class="project-name-container">
                <p class="score-label" :style="{color: getFinalMarkerColor(row.projectScore)}">{{typeof row.projectScore === "number" ? row.projectScore : "-"}}</p>
                <p class="unit-label">{{row.projectName}}</p>
            </div>
        </template>

        <template slot="cons" slot-scope="{ row }">
            <div class="score-item-container">
                <p class="score-label">{{typeof row.constructionScore === "number" ? row.constructionScore : "-"}}</p>
                <p class="unit-label">{{row.constructionName || "-"}}</p>
            </div>
        </template>

        <template slot="sup" slot-scope="{ row }">
            <div class="score-item-container">
                <p class="score-label">{{typeof row.supervisingScore === "number" ? row.supervisingScore : "-"}}</p>
                <p class="unit-label">{{row.supervisingName || "-"}}</p>
            </div>
        </template>

        <template slot="buil" slot-scope="{ row }">
            <div class="score-item-container">
                <p class="score-label">{{typeof row.buildScore === "number" ? row.buildScore : "-"}}</p>
                <p class="unit-label">{{row.buildName || "-"}}</p>
            </div>
        </template>
    </i-table>
</template>

<script lang="ts">
import { component, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class RightPanelRankTable extends CommonView
{
    @config({required: true, default: 0, type: Number})
    protected rankTypeIndex: number;

    /**
     * 红黑榜排名
     * @config
     */
    @config({required: true, default: () => []})
    protected rankData: Array<any>;

    /**
     * 获取项目分值数值颜色函数，参数有来自系统设置的分值颜色表列表，和目标分值
     * @config
     */
    @config({required: true})
    protected getMarkerColor: Function;

    /**
     * 系统设置的分值颜色表列表
     * @config
     */
    @config({required: false, default: () => []})
    protected colorList: Array<any>;

    /**
     * 榜单排名副本
     * @property
     */
    protected rankDataCopy: Array<any> = [];

    protected get unitColumuns(): Array<any>
    {
        return [
            {
                title: "排名",
                align: "center",
                type: "index",
                className: "rank-index",
                width: 48
            },
            {
                title: "项目名称",
                align: "left",
                slot: "content",
                sortable: "custom"
            },
            {
                title: "施工单位综合得分",
                slot: "cons",
                sortable: "custom"
            },
            {
                title: "监理单位综合得分",
                slot: "sup",
                sortable: "custom"
            },
            {
                title: "代建单位综合得分",
                slot: "buil",
                sortable: "custom"
            }
            
        ];
    }

    protected getFinalMarkerColor(projectScore: number)
    {
        let color = this.getMarkerColor(this.colorList, projectScore);
        return color || "#182334";
    }

    /**
     * 排行项点击事件
     * @protected
     */
    protected onRankItemClick(item: any, i: number)
    {
        this.$emit("on-rank-item-change", item, i);
    }

    protected onSortChange({column, key, order})
    {
        if (column.title === "项目名称")
        {
            this.rankDataCopy.sort(function(a, b)
            {
                let left = typeof a.projectScore === "number" ? a.projectScore : 0;
                let right = typeof b.projectScore === "number" ? b.projectScore : 0;
                return order === "asc" ? right - left : left - right;
            });
        }
        else if (column.title === "施工单位综合得分")
        {
            this.rankDataCopy.sort(function(a, b)
            {
                let left = typeof a.constructionScore === "number" ? a.constructionScore : 0;
                let right = typeof b.constructionScore === "number" ? b.constructionScore : 0;
                return order === "asc" ? right - left : left - right;
            });
        }
        else if (column.title === "监理单位综合得分")
        {
            this.rankDataCopy.sort(function(a, b)
            {
                let left = typeof a.supervisingScore === "number" ? a.supervisingScore : 0;
                let right = typeof b.supervisingScore === "number" ? b.supervisingScore : 0;
                return order === "asc" ? right - left : left - right;
            });
        }
        else if (column.title === "代建单位综合得分")
        {
            this.rankDataCopy.sort(function(a, b)
            {
                let left = typeof a.buildScore === "number" ? a.buildScore : 0;
                let right = typeof b.buildScore === "number" ? b.buildScore : 0;
                return order === "asc" ? right - left : left - right;
            });
        }
    }

    @watch("rankData", {immediate: true})
    protected rankDataWatcher(val: Array<any>)
    {
        this.rankDataCopy.splice(0);
        this.rankDataCopy.push(...val);
    }
}
</script>

<style lang="less" scoped>
.table-normal
{
    @{deep}.ivu-table-cell
    {
        height: 100%;
        padding: 0;
    }
    @{deep}.ivu-table td
    {
        height: 34px;
    }
}

@{deep}.project-name-container
{
    display: flex;
    flex-direction: column;
    align-items: center;
    .score-label
    {

    }
    .unit-label
    {
        white-space: pre-wrap;
        text-align: center;
        font-size: 12px;
    }
}

@{deep}.score-item-container
{
    display: flex;
    flex-direction: column;
    align-items: center;

    .score-label
    {
        color: #FC532E;
    }
    .unit-label
    {
        white-space: pre-wrap;
        text-align: center;
        font-size: 12px;
    }
}

@{deep}.rank-index
{
    .ivu-table-cell
    {
        height: auto;
    }
}

// .pop-content
// {
//     display: flex;

//     .score-item
//     {
//         display: flex;
//         flex-direction: column;
//         width: 104px;

//         .header
//         {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             color: #9c9d9f;
//         }
//         .content
//         {
//             display: flex;
//             flex-direction: column;
//             align-items: center;

//             .score
//             {
//                 color: #ad7e77;
//             }
//             .label
//             {
//                 white-space: pre-wrap;
//                 text-align: center;
//             }
//         }
//     }
// }
</style>