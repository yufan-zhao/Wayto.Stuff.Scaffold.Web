<template>
    <div class="org-tree">
        <div class="org-header">
            <span class="left">
                组织架构名称
                <span class="blank"></span>
            </span>

            <span class="right">
                <span class="column-status">状态</span>
                <!-- 状态 -->
                <span class="column-ops">操作</span>
            </span>
        </div>

        <i-tree 
            class="tree-ins"
            :data="treeData"
            :render="renderContent"
        >
        </i-tree>
    </div>
</template>

<script lang="ts">
import { EnumUtils } from "uxmid-core";
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class OrgTree extends CommonView
{
    /**
     * 传入的组织树数据
     * @protected
     * @config
     */
    @config({required: false, type: Array})
    protected data: any;

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
     * 新增按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected addAuthCode: string;

    /**
     * resolved组织树列表
     * @protected
     * @property
     */
    protected treeData: Array<any> = [];

    /**
     * 当前选择的组织
     * @protected
     * @property
     */
    protected currentOrg: any = null;

    /**
     * 传入的组织树结构数据监听
     * @protected
     * @watch
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        if (val)
        {
            this.treeData = val;
        }
    }

    /**
     * 节点绘制方法
     * @protected
     * @member
     */
    protected renderContent(h, { root, node, data })
    {
        return h("span", {
            class: "org-row",
            on:
            {
                click: () =>
                {
                    this.currentOrg = data;
                }
            }
        }, [
            h("span", {
                class: "left-part"
            }, [
                h("span", {
                    class: "org-label"
                }, data.name)
            ]),
            h("span", {
                class: "right-part"
            }, [
                h("span", {
                    class: `org-status ${data.enable ? "enable" : "disable"}`
                }, [
                    h("span", {
                        class: "dot"
                    }),
                    h("span", {
                        class: "status-label"
                    }, `${data.enable ? "启用" : "禁用"}`)
                ]),
                h("span", {
                    class: "org-ops"
                }, [
                    h("span", {
                        class: "split"
                    }),
                    h("span", {
                        class: "ops-btn",
                        on:
                        {
                            click: () =>
                            {
                                this.$emit("on-ops", "edit", data);
                            }
                        },
                        directives:
                        [
                            {
                                name: "permission",
                                value: this.editAuthCode
                            }
                        ]
                    }, "编辑"),
                    h("span", {
                        class: "ops-btn",
                        on:
                        {
                            click: () =>
                            {
                                this.$emit("on-ops", "delete", data);
                            }
                        },
                        directives:
                        [
                            {
                                name: "permission",
                                value: this.deleteAuthCode
                            }
                        ]
                    }, "删除"),
                    h("span", {
                        class: "ops-btn",
                        on:
                        {
                            click: () =>
                            {
                                this.$emit("on-ops", "add", data);
                            }
                        },
                        directives:
                        [
                            {
                                name: "permission",
                                value: this.addAuthCode
                            }
                        ]
                    }, "添加子组织")
                ])
            ])
        ]);
    }
}
</script>

<style lang="less" scoped>
.org-tree
{
    overflow-x: hidden;
    .org-header
    {
        background-color: #F2F6F9;
        height: 44px;
        line-height: 44px;
        color: #A6ABB5;
        font-size: 14px;
        
        .left
        {
            padding-left: 57px;
        }
        .right
        {
            display: flex;
            float: right;
            width: 960px;
            position: relative;
            left: 71px;

            .column-type
            {
                padding-left: 50px;
                width: 22%;
                border-left: 1px solid #ECECEC;
            }

            .column-status
            {
                padding-left: 50px;
                width: 22%;
                border-left: 1px solid #ECECEC;
            }
            .column-ops
            {
                padding-left: 59px;
                width: 56%;
                border-left: 1px solid #ECECEC;
            }
        }
    }

    .tree-ins
    {
        border-bottom: 1px solid #ECECEC;
        border-left: 1px solid #ECECEC;
        border-right: 1px solid #ECECEC;

        .ivu-tree-children
        {
            overflow: hidden;
        }
    }

    @{deep}.org-row
    {
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;

        .left-part
        {
            .org-label
            {
                color: #182334;
                font-size: 14px;
            }
        }
        .right-part
        {
            display: flex;
            float: right;
            width: 956px;

            .org-type
            {
                position: relative;
                padding-left: 50px;
                margin-right: 2px;
                border-left: 1px solid #ECECEC;
                width: 22%;
                color: #182334;
            }

            .org-status
            {
                position: relative;
                padding-left: 50px;
                margin-right: 2px;
                border-left: 1px solid #ECECEC;
                width: 22%;

                .dot
                {
                    position: relative;
                    bottom: 2px;
                    display: inline-block;
                    height: 6px;
                    width: 6px;
                    background-color: #32BA52;
                    border-radius: 50%;
                    margin-right: 6px;
                }
                .status-label
                {
                    color: #182334;
                }
            }
            .org-status.disable
            {
                .dot
                {
                    background-color: #C3C9CF;
                }
                .status-label
                {
                    color: #838D9C;
                }
            }
            .org-ops
            {
                padding-left: 59px;
                border-left: 1px solid #ECECEC;
                width: 56%;

                .ops-btn
                {
                    margin-right: 20px;
                    color: #3375f4;
                    font-size: 14px;
                    cursor: pointer;
                }
                .ops-btn:hover
                {
                    color: darken(#3375f4, 20%)
                }
            }
        }
    }
    @{deep}.ivu-tree ul li
    {
        // display: flex;
        margin: 0;
    }
    @{deep}.ivu-tree-arrow
    {
        margin-left: 56px;
        margin-top: 7px;
    }
    @{deep}.ivu-tree-title
    {
        width: 100%;
    }
    @{deep}.ivu-tree-title:hover
    {
        background-color: #f6f8fc;
        color: #3375f4;
    }
    @{deep}.ivu-tree-title.ivu-tree-title-selected
    {
        background-color: #fff;
    }
    @{deep}.ivu-tree-empty
    {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;

        font-size: 14px;
        color: #182334;
    }
}
</style>