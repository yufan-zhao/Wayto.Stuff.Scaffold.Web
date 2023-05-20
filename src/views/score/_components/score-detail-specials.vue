<template>
    <i-tree
        class="score-detail-specials-tree"
        :data="specialTreeData"
        :render="renderContent"
        :load-data="loadData"
        expand-node
    >
    </i-tree>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { ScoreService, ScoreDangerService } from "src/services";
import { service } from "src/common/decorator";
import { ScoreSpecialNode, ScoreSpecialDanger } from "src/models";

@component
export default class ScoreDetailSpecials extends View
{
    @service("ScoreService")
    private scoreService: ScoreService;

    @service("ScoreDangerService")
    private scoreDangerService: ScoreDangerService;

    /**
     * 诊治id
     * @config
     */
    @config({required: true, type: Number})
    protected consultId: number;

    /**
     * 体系类型id
     * @config
     */
    @config({required: true, type: Number})
    protected specialTypeId: number;

    /**
     * 当前激活的诊治体系id列表
     */
    @config({required: true, type: Array, default: () => []})
    protected specialIds: Array<number>;

    /**
     * 体系评分树
     * @property
     */
    protected specialTreeData: Array<ScoreSpecialNode | ScoreSpecialDanger> = [];

    /**
     * tree组件节点render方法
     * @protected
     */
    protected renderContent(h, { root, node, data }: { root: any; node: any; data: ScoreSpecialNode | ScoreSpecialDanger})
    {
        if (typeof (data as ScoreSpecialNode).consultId === "number")
        {
            // 类型为ScoreSpecialNode，level级别为1、2、3
            let rowData = data as ScoreSpecialNode;
            let title = `${rowData.code} ${rowData.name}`;
            if (rowData.label)
            {
                title += "（甩项）";
            }
            let label = "";
            if (typeof rowData.deservedScore === "number")
            {
                label += `（应得分：${rowData.deservedScore}）`;
            }
            if (typeof rowData.actualScore === "number")
            {
                label += `（实际得分：${rowData.actualScore.toFixed(2)}）`;
            }

            return h(
                "div",
                {
                    class: "node-content"
                },
                [
                    h("span", {class: "left"}, title),
                    h("span", {class: "right"}, label)
                ]
            );
        }
        else
        {
            // 类型为ScoreSpecialDanger，level级别为4
            let rowData = data as ScoreSpecialDanger;
            let title = `${rowData.content}`;
            let label = "";
            if (typeof rowData.deductPoints === "number")
            {
                label += `扣分：（${rowData.deductPoints}分）`;
            }
            
            return h(
                "div",
                {
                    class: "node-content"
                },
                [
                    h("span", {class: "left"}, title),
                    h("span", {class: "right"}, label)
                ]
            );
        }
    }

    /**
     * tree组件异步加载方法
     * @protected
     */
    protected async loadData(item: ScoreSpecialNode | ScoreSpecialDanger, callback: (param: Array<ScoreSpecialNode | ScoreSpecialDanger>) => {}): Promise<void>
    {
        if (typeof (item as ScoreSpecialNode).level === "number" && (item as ScoreSpecialNode).level < 3)
        {
            let data = item as ScoreSpecialNode;
            const res = await this.scoreService.getScoreSpecialNodeTree(data.consultId ,data.specialTypeId, this.specialIds, data.id, data.level + 1);
            if (data.level === 2)
            {
                res.forEach(thirdItem =>
                {
                    thirdItem.loading = false;
                    thirdItem.children = [];
                });
            }
            callback(res);
        }
        else
        {
            let data = item as ScoreSpecialNode;
            const res = await this.scoreDangerService.getTargetScoreDangers(data.id, this.consultId);
            callback(res);
        }
    }

    /**
     * 数据源监听
     * @watcher
     */
    @watch("consultId", {immediate: true})
    protected consultIdWatcher(val: number)
    {
        if (val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        this.specialTreeData = [];
        this.specialTreeData = await this.scoreService.getScoreSpecialNodeTree(
            this.consultId,
            this.specialTypeId,
            this.specialIds
        );
    }
}
</script>

<style lang="less" scoped>
.score-detail-specials-tree
{
    @{deep}.ivu-tree-title
    {
        width: 100%;
        line-height: 1;
    }
    @{deep}.ivu-tree-children
    {
        li
        {
            margin: 0;

            .ivu-tree-arrow
            {
                display: none;
            }
        }
    }
}
@{deep}.node-content
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 34px;
    border-bottom: 1px solid #ddd;
}
</style>