<template>
    <div class="system-sidebar-view" ref="sidebar">
        <div class="ops">
            <span class="add-btn" @click.stop="onPositiveNegativeSet" v-if="isCustomer">
                <i-checkbox v-model="positiveNegativeActive" style="pointer-events: none;">正负面清单</i-checkbox>
            </span>
            <span class="add-btn" @click="onInsertClick(null)" v-permission="addAuthCode">+ 添加体系</span>
            
            <!-- <div class="search-container">
                <i-input v-model="keyword" @keydown.enter="onSearch"></i-input>
            </div> -->
        </div>

        <div class="tree-container" :style="treeContainerStyles">
            <i-tree
                :data="specialTreeDataCopy"
                :render="renderContent"
                :load-data="loadData"
                class="system-tree"
                @on-select-change="onSelectChange"
            ></i-tree>
        </div>

        <div class="special-type-rule">
            <span :class="{active: currentRuleIndex === 0}" @click="onRuleClick(0)">项目综合得分规则</span>
            <span :class="{active: currentRuleIndex === 1}" @click="onRuleClick(1)">总分计算规则</span>
            <span :class="{active: currentRuleIndex === 2}" @click="onRuleClick(2)" v-if="positiveNegativeActive">正负面清单设置</span>
            <span :class="{active: currentRuleIndex === 3}" @click="onRuleClick(3)">危大工程配置</span>
        </div>

        <SpecialNodeModal
            ref="specialNodeModal"
            :insert="specialService.addSpecialNodeByParentId.bind(specialService)"
            :update="specialService.editSpecialNodeById.bind(specialService)"
            @on-refresh="onTreeRefresh"
            @on-local-update="onNodeUpdate"
        ></SpecialNodeModal>
        <SpecialNodePrimaryModal
            ref="specialNodePrimaryModal"
            :insert="specialService.addSpecialNodeByParentId.bind(specialService)"
            :update="specialService.editSpecialNodeById.bind(specialService)"
            @on-refresh="onTreeRefresh"
        ></SpecialNodePrimaryModal>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialNode } from "src/models";
import { SpecialService, SpecialTypeService } from "src/services";
import { service } from "src/common/decorator";
import SpecialNodeModal from "./special-node-modal.vue";
import SpecialNodePrimaryModal from "./special-node-primary-modal.vue";

@component({
    components:
    {
        SpecialNodeModal,
        SpecialNodePrimaryModal
    }
})
export default class SpecialSidebar extends View
{
    @service("SpecialService")
    private specialService: SpecialService;

    @service("SpecialTypeService")
    private specialTypeService: SpecialTypeService;

    @config({required: false, type: Boolean, default: false})
    protected isCustomer: boolean;

    /**
     * 默认体系类型是否需要正负面反馈设置
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected positiveNegativeStatus: boolean;

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
    protected specialTreeData: Array<SpecialNode>;

    /**
     * 新增按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected addAuthCode: string;

    /**
     * 编辑按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected editAuthCode: string;

    /**
     * 删除按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected deleteAuthCode: string;

    /**
     * 侧栏菜单容器style对象
     * @property
     */
    protected treeContainerStyles: any = {};

    /**
     * 规则菜单激活索引
     * @property
     */
    protected currentRuleIndex: number = -1;
    
    /**
     * 体系树展示数据
     * @property
     */
    protected specialTreeDataCopy: Array<SpecialNode> = [];

    /**
     * 搜索关键词
     * @property
     */
    protected keyword: string = "";

    /**
     * 是否需要设置正负面反馈
     * @property
     */
    protected positiveNegativeActive: boolean = false;

    /**
     * 正负面反馈设置锁
     * @property
     */
    protected positiveNegativeLoading: boolean = false;

    /**
     * tree组件节点render方法
     * @protected
     */
    protected renderContent(h, { root, node, data }: { root: any; node: any; data: SpecialNode})
    {
        let subTitle = "";
        let titleFrag = [];
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
                    { class: "ops" },
                    [
                        h("i-poptip", {
                            props:
                            {
                                transfer: true,
                                "popper-class": "special-sidebar-ops-poptip",
                                trigger: "hover"
                            },
                            directives:
                            [
                                {
                                    name: "permission",
                                    value: [this.addAuthCode, this.editAuthCode, this.deleteAuthCode]
                                }
                            ],
                            scopedSlots:
                            {
                                content: (props: any) =>
                                {
                                    let ops = [];
                                    if (data.level !== 3)
                                    {
                                        ops.push(h("span", {
                                            class: "btn",
                                            on: {"click": () => this.onInsertClick(data)},
                                            directives:
                                            [
                                                {
                                                    name: "permission",
                                                    value: this.addAuthCode
                                                }
                                            ]
                                        }, "新增"));
                                        
                                    }
                                    if (data.level > 1)
                                    {
                                        ops.push(h("span", {
                                            class: "btn",
                                            on: {"click": () => this.onTagClick(data)},
                                            directives:
                                            [
                                                {
                                                    name: "permission",
                                                    value: this.addAuthCode
                                                }
                                            ]
                                        }, "标记重点"));
                                    }
                                    ops.push(h("span", {
                                        class: "btn",
                                        on: {"click": () => this.onUpdateClick(data)},
                                        directives:
                                        [
                                            {
                                                name: "permission",
                                                value: this.editAuthCode
                                            }
                                        ]
                                    }, "编辑"));
                                    ops.push(h("span", {
                                        class: "btn",
                                        on: {"click": () => this.onDeleteClick(data)},
                                        directives:
                                        [
                                            {
                                                name: "permission",
                                                value: this.deleteAuthCode
                                            }
                                        ]
                                    }, "删除"));

                                    return h(
                                        "div",
                                        {
                                            class: "ops-btns"
                                        },
                                        [
                                            ...ops
                                        ]
                                    );
                                }
                            }
                        }, [
                            h("i-icon", { attrs: { type: "ios-more"} })
                        ])
                    ]
                )
            ]
        );
    }

    /**
     * tree组件异步加载方法
     * @protected
     */
    protected async loadData(item: SpecialNode, callback: (param: Array<SpecialNode>) => {}): Promise<void>
    {
        const res = await this.specialService.getSpecialListByParentId(item.specialTypeId, item.id, item.level + 1);
        callback(res);
    }

    /**
     * 节点切换事件
     * @protected
     */
    protected onSelectChange(treeData: Array<SpecialNode>, nodeData: any)
    {
        this.onRuleClick(-1);
        this.$emit("on-node-change", JSON.parse(JSON.stringify(nodeData)));
    }

    protected onSearch()
    {
        // TODO
        console.log(this.specialTreeDataCopy);
    }

    /**
     * 新增体系节点事件
     * @protected
     */
    protected onInsertClick(item?: SpecialNode)
    {
        if (item)
        {
            this._specialNodeModal.open(
                "insert",
                this.specialTypeId,
                item ? item.level + 1 : 1,
                item ? item.id : 0,
                item
            );
        }
        else
        {
            this._specialNodePrimaryModal.open("insert", this.specialTypeId, 1, 0, item);
        }
    }

    protected onTagClick(item: SpecialNode)
    {
        this._warningModal.open({
            title: "标记重点",
            content: item.tag ? "是否取消标记当前体系节点为重点" : "是否标记当前体系节点为重点",
            onOk: async () => {
                try
                {
                    item.tag = !item.tag;
                    await this.specialService.editSpecialNodeById(item);
                    this.$message.success("操作成功");
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                }
            }
        });
    }

    protected async onPositiveNegativeSet()
    {
        if (this.positiveNegativeLoading)
        {
            return;
        }

        try
        {
            this.positiveNegativeLoading = true;
            await this.specialTypeService.setSpecialTypeStatus(this.specialTypeId, !this.positiveNegativeActive);
            this.positiveNegativeActive = !this.positiveNegativeActive;
            this.$message.success("操作成功");
        }
        catch(err)
        {
            this.$message.error("操作异常");
            console.error(err);
        }
        finally
        {
            this.positiveNegativeLoading = false;
        }
    }

    /**
     * 编辑体系节点
     * @protected
     */
    protected onUpdateClick(item: SpecialNode)
    {
        if (item.level === 1)
        {
            this._specialNodePrimaryModal.open("update", this.specialTypeId, item.level, item.parentId, item);
        }
        else
        {
            this._specialNodeModal.open("update", this.specialTypeId, item.level, item.parentId, item);
        }
    }

    /**
     * 删除体系节点
     * @protected
     */
    protected onDeleteClick(item: SpecialNode)
    {
        this._warningModal.open({
            title: "确定删除",
            content: "是否确定删除当前体系节点",
            onOk: async () => {
                try
                {
                    await this.specialService.deleteById(item.id, item.level, item.specialTypeId);
                    this.$message.success("操作成功");
                    // this.onTreeRefresh();
                    this.onNodeUpdate("delete", item);
                    this.$emit("on-node-change", null);
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                }
            }
        });
    }

    protected onNodeUpdate(type: string, data: SpecialNode)
    {
        if (type === "insert")
        {
            const target = this.findTargetNode(data.parentId, this.specialTreeDataCopy);
            // console.log("insert", target);
            if (target)
            {
                if (Array.isArray(target.children) && target.children.length > 0)
                {
                    target.children.push(data);
                }
                else
                {
                    // this.$set(target, "children", [data]);
                }
            }
        }
        else if (type === "update")
        {
            const target = this.findTargetNode(data.id, this.specialTreeDataCopy);
            if (target)
            {
                this.$set(target, "name", data.name);
                this.$set(target, "code", data.code);
                this.$set(target, "deservedScore", data.deservedScore);
                this.$set(target, "weight", data.weight);
            }
        }
        else if (type === "delete")
        {
            const target = this.findTargetNode(data.parentId, this.specialTreeDataCopy);
            // console.log("delete", target);
            if (target)
            {
                let pointIndex = -1;
                for(let i = 0; i < target.children.length ; i++)
                {
                    let item = target.children[i];
                    if (item.id === data.id)
                    {
                        pointIndex = i;
                        break;
                    }
                }

                if (pointIndex >= 0)
                {
                    target.children.splice(pointIndex, 1);
                }
            }
        }
    }

    /**
     * 规则菜单点击事件
     * @protected
     */
    protected onRuleClick(type: number)
    {
        this.currentRuleIndex = type;
        if (type >= 0)
        {
            this.$emit("on-rule-active", type);
        }
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
    protected specialTreeDataWatcher(val: Array<SpecialNode>)
    {
        const data = JSON.parse(JSON.stringify(val));
        this.specialTreeDataCopy.splice(0);
        this.specialTreeDataCopy.push(...data);
        this.positiveNegativeActive = this.positiveNegativeStatus;
    }

    /**
     * vue钩子
     * @mounted
     */
    protected mounted()
    {
        let totalHeight = this._sidebar.clientHeight;
        let treeHeight = totalHeight - 46 - 135 - 46;
        this.$set(this.treeContainerStyles, "height", treeHeight + "px");
    }

    private findTargetNode(nodeId: number, nodeTree: Array<SpecialNode>)
    {
        for (let i = 0; i < nodeTree.length; i++)
        {
            let item = nodeTree[i];
            if (item.id === nodeId)
            {
                return item;
            }
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                let newResult = this.findTargetNode(nodeId, item.children);
                if (newResult)
                {
                    return newResult;
                }
            }
        }
    }

    /**
     * @ref specialNodeModal
     */
    private get _specialNodeModal(): SpecialNodeModal
    {
        return this.$refs["specialNodeModal"] as SpecialNodeModal;
    }

    /**
     * @ref specialNodePrimaryModal
     */
    private get _specialNodePrimaryModal(): SpecialNodePrimaryModal
    {
        return this.$refs["specialNodePrimaryModal"] as SpecialNodePrimaryModal;
    }

    /**
     * @ref warningModal
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }

    private get _sidebar(): any
    {
        return this.$refs["sidebar"] as any;
    }
}
</script>

<style lang="less" scoped>
.system-sidebar-view
{
    position: relative;
    height: 100%;

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
        overflow-x: hidden;
        overflow-y: auto;
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

    .special-type-rule
    {
        display: flex;
        flex-direction: column;
        height: 135px;
        padding-top: 26px;
        margin-right: 16px;
        border-top: 1px solid #E9EBEC;

        span
        {
            height: 34px;
            cursor: pointer;
        }
        span.active
        {
            color: #3375F4;
        }
    }
}

@{deep}.system-item-content
{
    display: inline-block;
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding-right: 15px;

    .title-container
    {
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
    }
    .ops
    {
        opacity: 0;
        float: right;
        transform: rotate(90deg) scale(1.5);
        transition: opacity ease-in-out 0.3s;
        
        i
        {
            font-size: 16px;
            // font-weight: bold;
        }
    }
}

.special-sidebar-ops-poptip
{
    min-width: 70px;
}
</style>