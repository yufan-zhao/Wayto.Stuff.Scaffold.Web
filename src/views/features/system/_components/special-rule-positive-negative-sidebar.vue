<template>
    <div class="special-rule-positive-negative-sidebar-view">
        <div class="ops">
            <span class="add-btn" @click="onInsertClick(null)">+ 添加类别</span>
        </div>
        <div class="tree-container">
            <i-tree
                :data="dataCopy"
                :render="renderContent"
                class="sidebar-tree"
                @on-select-change="onSelectChange"
            ></i-tree>
        </div>

        <SpecialRulePositiveNegativeTypeModal
            ref="mainModal"
            :insert="specialListService.save.bind(specialListService)"
            :update="specialListService.updateById.bind(specialListService)"
            @on-refresh="onRefresh"
        ></SpecialRulePositiveNegativeTypeModal>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import SpecialRulePositiveNegativeTypeModal from "./special-rule-positive-negative-type-modal.vue";
import { SpecialListService } from "src/services";
import { service } from "src/common/decorator";

@component({
    components:
    {
        SpecialRulePositiveNegativeTypeModal
    }
})
export default class SpecialRulePositiveNegativeSidebar extends CommonView
{
    @service("SpecialListService")
    private specialListService: SpecialListService;

    @config({required: true, type: Number})
    protected specialTypeId: number;

    @config({required: false, type: Boolean, default: false})
    protected isPositive: boolean;

    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

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

    protected dataCopy = [];

    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        let data = this.resolveTreeData(val);
        this.dataCopy = data;
    }

    protected renderContent(h, { root, node, data }: { root: any; node: any; data: any})
    {
        return h(
            "span",
            {
                class: "node-content"
            },
            [
                h("span", data.name),
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
                                    if (data.level !== 2)
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

    protected onSelectChange(treeData: Array<any>, nodeData: any)
    {
        this.$emit("on-node-change", JSON.parse(JSON.stringify(nodeData)));
    }

    protected onInsertClick(data: any)
    {
        this._mainModal.open("insert", this.specialTypeId, data, this.isPositive);
    }

    protected onUpdateClick(data: any)
    {
        this._mainModal.open("update", this.specialTypeId, data, this.isPositive);
    }

    protected onDeleteClick(data: any)
    {
        this._warningModal.open({
            title: "确定删除",
            content: "是否确定删除当前正负面类型节点",
            onOk: async () => {
                try
                {
                    await this.specialListService.virtualRemoveById(data.id);
                    this.$message.success("操作成功");
                    this.onRefresh();
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                }
            }
        });
    }

    protected onRefresh()
    {
        this.$emit("on-refresh");
    }

    private resolveTreeData(data: Array<any>, result: Array<any> = [])
    {
        if (Array.isArray(data))
        {
            data.forEach(item =>
            {
                result.push({
                    id: item.id,
                    parentId: item.parentId,
                    level: item.level,
                    name: item.name,
                    children: this.resolveTreeData(item.childList)
                });
            });
        }
        
        return result;
    }

    private get _mainModal()
    {
        return this.$refs["mainModal"] as any;
    }

    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
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
.sidebar-tree
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
            overflow: hidden;
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

@{deep}.node-content
{
    display: inline-block;
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding-right: 15px;

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
</style>