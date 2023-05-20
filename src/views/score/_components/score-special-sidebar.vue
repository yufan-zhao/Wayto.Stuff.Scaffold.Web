<template>
    <div class="system-sidebar-view">
        <div class="ops">
            <!-- <span class="add-btn" @click="onInsertClick(null)">+ 添加体系</span> -->

            <div class="search-container">
                <i-input v-model="keyword" @keydown.enter="onSearch"></i-input>
            </div>
        </div>

        <div class="tree-container">
            <i-tree
                :data="specialTreeDataCopy"
                :render="renderContent"
                :load-data="loadData"
                class="system-tree"
                @on-select-change="onSelectChange"
            ></i-tree>
        </div>

        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { ScoreSpecialNode } from "src/models";
import { ScoreService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class SpecialSidebar extends View
{
    @service("ScoreService")
    private scoreService: ScoreService;

    /**
     * 当前激活的诊治体系id列表
     */
    @config({required: true, type: Array, default: () => []})
    protected specialIds: Array<number>;

    /**
     * 当前激活的体系类型id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected specialTypeId: number;

    /**
     * 体系树节点列表数据
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialTreeData: Array<ScoreSpecialNode>;
    
    /**
     * 体系树展示数据
     * @property
     */
    protected specialTreeDataCopy: Array<ScoreSpecialNode> = [];

    /**
     * 搜索关键词
     * @property
     */
    protected keyword: string = "";

    /**
     * tree组件节点render方法
     * @protected
     */
    protected renderContent(h, { root, node, data }: { root: any; node: any; data: ScoreSpecialNode})
    {
        let subTitle = "";
        let titleFrag = [];
        let indeterminate = false;
        if (data.deservedScore)
        {
            subTitle += data.deservedScore + "分";
        }
        if (typeof data.weight === "number")
        {
            subTitle += subTitle ? "，权重" + data.weight + "%" : "权重" + data.weight + "%";
        }
        if (subTitle)
        {
            subTitle = "（" + subTitle + "）";
        }
        titleFrag.push(h("span", { class: "title-label" }, data.code + " " + data.name));
        titleFrag.push(h("span", { class: "sub-title-label" }, subTitle));

        if (data.tag)
        {
            titleFrag.push(h("span", { class: "sub-title-tag" }, "重"));
        }

        // console.log(data.dangerCount);
        if (typeof data.dangerCount === "number" && data.dangerCount > 0)
        {
            titleFrag.push(h("span", { class: "title-label-danger-count" }, `隐患(${data.dangerCount})`));
        }

        let disableFlag = this.scoreService.checkParentsLabel(this.specialTreeDataCopy, data);
        let disabled = false;
        if (typeof disableFlag === "boolean")
        {
            disabled = disableFlag;
        }

        let labelCount = "";
        if (typeof data.labelCount === "number" && data.labelCount > 0 && !data.label)
        {
            labelCount += `(${data.labelCount})`;
            indeterminate = true;
        }

        return h(
            "span",
            {
                class: "system-item-content"
            },
            [
                h(
                    "span",
                    { class: "title-container" },
                    titleFrag
                ),
                h(
                    "span",
                    {
                        class: "ops",
                        on: {
                            "click": (e: PointerEvent) =>
                            {
                                e.stopPropagation();
                            }
                        }
                    },
                    [
                        data.level !== 1 ? h("i-checkbox", {
                            props:
                            {
                                value: data.label,
                                disabled: disabled,
                                indeterminate: indeterminate
                            },
                            on:
                            {
                                "on-change": (value: boolean) =>
                                {
                                    this.onLabelChange(value, data);
                                }
                            }
                        }, "甩项" + labelCount) : undefined
                    ]
                )
            ]
        );
    }

    /**
     * tree组件异步加载方法
     * @protected
     */
    protected async loadData(item: ScoreSpecialNode, callback: (param: Array<ScoreSpecialNode>) => {}): Promise<void>
    {
        const res = await this.scoreService.getScoreSpecialNodeTree(item.consultId ,item.specialTypeId, this.specialIds, item.id, item.level + 1);
        callback(res);
    }

    protected onSelectChange(treeData: Array<ScoreSpecialNode>, nodeData: any)
    {
        this.$emit("on-node-change", JSON.parse(JSON.stringify(nodeData)));
    }

    /**
     * 甩项切换事件
     * @protected
     */
    protected async onLabelChange(value: boolean, currentNode: ScoreSpecialNode)
    {
        // console.log("label change", arguments);
        currentNode.label = value;
        // TODO 调用接口设置节点甩项，并且设置下级甩项为不可选中
        // console.log(this.specialTreeDataCopy);
        this.$emit("on-label-change", JSON.parse(JSON.stringify(this.specialTreeDataCopy)));

        try
        {
            await this.scoreService.setLabel(currentNode.consultId, currentNode.id, currentNode.specialTypeId, value);
            this.$message.success("操作成功");
        }
        catch(err)
        {
            this.$message.error(err.msg || err.message);
        }
    }

    protected onSearch()
    {
        // TODO
        console.log(this.specialTreeDataCopy);
    }

    protected onTreeRefresh()
    {
        this.$emit("on-refresh");
    }

    /**
     * 数据源监听
     * @watcher
     */
    @watch("specialTreeData", {immediate: true, deep: true})
    protected specialTreeDataWatcher(val: Array<ScoreSpecialNode>)
    {
        const data = JSON.parse(JSON.stringify(val));
        this.specialTreeDataCopy.splice(0);
        this.specialTreeDataCopy.push(...data);
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
.system-sidebar-view
{
    .ops
    {
        width: 100%;
        padding-right: 15px;

        .add-btn
        {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 36px;
            margin-bottom: 10px;
            border: 1px solid #3375F4;
            color: #3375F4;
            cursor: pointer;
            transition: color,border-color ease-in-out 0.3s;
        }
        .add-btn:hover
        {
            color: lighten(#3375F4, 12%);
            border-color: lighten(#3375F4, 12%);
        }
    }

    .tree-container
    {
        padding-top: 13px;
    }
    .system-tree
    {
        @{deep}.ivu-tree-title
        {
            width: 100%;
        }
        @{deep}.ivu-tree-children
        {
            li
            {
                margin-top: 0;
                margin-bottom: 0;
            }
            .ivu-tree-arrow
            {
                margin-top: 4px;

                i
                {
                    font-size: 16px;
                }
            }
            .ivu-tree-title:hover
            {
                .ops
                {
                    opacity: 1;
                }
            }
        }
    }
}

@{deep}.system-item-content
{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding-right: 15px;

    .title-container
    {
        overflow: hidden;
        width: calc(100% - 68px);
        text-overflow: ellipsis;

        .sub-title-label
        {
            color: #A6ABB5;
        }
        .sub-title-tag
        {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 1px solid #FC532E;
            border-radius: 2px;
            color: #FC532E;
            font-size: 12px;
            line-height: 17px;
            text-align: center;
        }
        .title-label-danger-count
        {
            color: #ff4529;
            font-size: 12px;
            padding-left: 2px;
        }
    }
    .ops
    {
        width: 68px;

        .ivu-checkbox-wrapper
        {
            color: #838D9C;
        }
    }
}
</style>