<template>
    <div class="org-tree">
        <div class="org-header">
            <span class="left">
                权限名称
                <span class="blank"></span>
            </span>

            <span class="right">
                <span class="column-status">状态</span>
                <span class="column-status" v-if="singleChild">级别</span>
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
     * 最终子节点是否单选
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected singleChild: boolean;

    /**
     * 编辑按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: Number, default: 0})
    protected editAuthCode: number;

    /**
     * 删除按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: Number, default: 0})
    protected deleteAuthCode: number;

    /**
     * 新增按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: Number, default: 0})
    protected addAuthCode: number;

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
            this.treeData = JSON.parse(JSON.stringify(val));
            this.$emit("on-change", this.treeData);
        }
    }

    /**
     * 节点绘制方法
     * @protected
     * @member
     */
    protected renderContent(h, { root, node, data })
    {
        let midCol;
        if (this.singleChild)
        {
            if (Array.isArray(data.canSelectLevels))
            {
                let options = [];
                options = data.canSelectLevels.filter(item =>
                {
                    return Boolean(item);
                });
                let renderOptions = [];
                options.forEach(item =>
                {
                    renderOptions.push(h("i-option", {
                        props:
                        {
                            value: item.level
                        }
                    }, item.name));
                });
                midCol = [h("i-select", {
                    props:
                    {
                        value: data.selectedDataIsolationLevel
                    },
                    on:
                    {
                        "on-change": (value: any) =>
                        {
                            data.selectedDataIsolationLevel = value;
                            this.$emit("on-change", this.treeData);
                        }
                    }
                }, renderOptions)];
            }
            else
            {
                midCol = "-";
            }
        }
        else
        {
            midCol = data.code;
        }

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
            h(
                "span",
                {
                    class: "right-part"
                },
                [
                    h(
                        "span",
                        {
                            class: `org-status ${data.enable ? "enable" : "disable"}`
                        },
                        [
                            h("span", {
                                class: "dot"
                            }),
                            h("span", {
                                class: "status-label"
                            }, `${data.enable ? "启用" : "禁用"}`)
                        ]
                    ),
                    this.singleChild && h(
                        "span",
                        {
                            class: "org-status"
                        },
                        midCol
                    ),
                    h("span", {
                        class: "org-ops"
                    },
                    [
                        h("span", {
                            class: "split"
                        }),
                        h("span", {
                            class: "ops-btn",
                            on:
                            {
                                click: () =>
                                {
                                    this.onOps("enable", data);
                                }
                            }
                            // directives:
                            // [
                            //     {
                            //         name: "permission",
                            //         value: this.editAuthCode
                            //     }
                            // ]
                        }, "启用"),
                        h("span", {
                            class: "ops-btn",
                            on:
                            {
                                click: () =>
                                {
                                    this.onOps("disable", data);
                                }
                            }
                            // directives:
                            // [
                            //     {
                            //         name: "permission",
                            //         value: this.deleteAuthCode
                            //     }
                            // ]
                        }, "禁用")
                    ])
                ]
            )
        ]);
    }

    private onOps(type: "enable" | "disable", data: any)
    {
        this.setTargetStatus(data.id, this.treeData, type === "enable");
        if (type === "enable")
        {
            let result = this.setTargetParentsStatus(data.id, this.treeData);
            result.forEach(item =>
            {
                item.enable = true;
            });
        }
        this.$emit("on-change", this.treeData);
    }

    private setTargetStatus(targetId: number, treeData: Array<any>, status: boolean)
    {
        treeData.forEach(item =>
        {
            if (item.id === targetId)
            {
                item.enable = status;

                if (Array.isArray(item.children))
                {
                    this.setTargetStatus(null, item.children, status);
                }
            }
            else if (targetId === null)
            {
                item.enable = status;

                if (Array.isArray(item.children))
                {
                    this.setTargetStatus(null, item.children, status);
                }
            }
            else
            {
                if (Array.isArray(item.children))
                {
                    this.setTargetStatus(targetId, item.children, status);
                }
            }
        });
    }

    private setTargetParentsStatus(targetId: number, data: Array<any>, chain: Array<any> = []): any
    {
        for (let i = 0; i < data.length; i++)
        {
            let item = data[i];
            let tempChain = [...chain];
            if (item.id === targetId)
            {
                return tempChain;
            }
            else
            {
                tempChain.push(item);
            }

            if (Array.isArray(item.children))
            {
                let result = this.setTargetParentsStatus(targetId, item.children, tempChain);
                if (result)
                {
                    return result;
                }
            }
        }
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
                padding-left: 40px;
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
                padding-left: 40px;
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