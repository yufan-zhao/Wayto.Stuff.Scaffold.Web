<template>
    <div class="dict-atlas">
        <div class="org-header">
            <span class="left">
                标准图集名称
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
            :data="valueCopy"
            :render="renderContent"
        ></i-tree>

        <MainModal
            ref="mainModal"
            @on-refresh="$emit('on-refresh')"
        ></MainModal>
        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, config, watch, View } from "uxmid-vue-web";
import MainModal from "./dict-atlas-modal.vue";
import { DictService } from "src/services";
import { service } from "src/common/decorator";

@component({
    components:
    {
        MainModal
    }
})
export default class DictAtlas extends View
{
    @service("DictService")
    private dictService: DictService;

    /**
     * 传入的表格数据
     * @protected
     * @config
     */
    @config({required: true, type: Array, default: []})
    protected value: Array<any>;
    /**
     * 增加方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected insert: Function;

    /**
     * 更新方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected update: Function;

    /**
     * 删除方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected delete: Function;

    protected valueCopy = [];

    public addRow()
    {
        (this.$refs["mainModal"] as any).open("insert");
    }

    protected renderContent(h, { root, node, data })
    {
        return h("span", {
            class: "org-row"
            // on:
            // {
            //     click: () =>
            //     {
            //         this.currentOrg = data;
            //     }
            // }
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
                                (this.$refs["mainModal"] as any).open("update", data);
                            }
                        }
                        // directives:
                        // [
                        //     {
                        //         name: "permission",
                        //         value: this.editAuthCode
                        //     }
                        // ]
                    }, "编辑"),
                    h("span", {
                        class: "ops-btn",
                        on:
                        {
                            click: () =>
                            {
                                this.$warningModal.open({
                                    title: "提示",
                                    content: "是否删除该标准图集？",
                                    onOk: async () =>
                                    {
                                        try
                                        {
                                            if (Array.isArray(data.children) && data.children.length > 0)
                                            {
                                                this.$message.error("请先删除子节点");
                                                return;
                                            }
                                            await this.dictService.delete(data.id);
                                            this.$message.success("删除成功");
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
                        // directives:
                        // [
                        //     {
                        //         name: "permission",
                        //         value: this.deleteAuthCode
                        //     }
                        // ]
                    }, "删除"),
                    data.level === 1 ? h("span", {
                        class: "ops-btn",
                        on:
                        {
                            click: () =>
                            {
                                (this.$refs["mainModal"] as any).open("insert", data);
                            }
                        }
                        // directives:
                        // [
                        //     {
                        //         name: "permission",
                        //         value: this.addAuthCode
                        //     }
                        // ]
                    }, "添加子节点") : undefined
                ])
            ])
        ]);
    }

    @watch("value", {immediate: true})
    protected valueWatcher(val)
    {
        this.valueCopy = this.resovleData(val);
    }

    private resovleData(data: Array<any>, level = 1)
    {
        let results = [];
        data.forEach(item =>
        {
            let target: any =
            {
                name: item.typeName,
                id: item.id,
                parentId: item.parentId ? item.parentId : undefined,
                enumValue: item.enumValue,
                enable: item.enable,
                level: level
            };
            if (Array.isArray(item.child) && item.child.length > 0)
            {
                target.children = this.resovleData(item.child, level + 1);
            }
            results.push(target);
        });
        return results;
    }

    /**
     * 警告弹层
     * @private
     * @ref
     */
    private get $warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.dict-atlas
{
    overflow-x: hidden;
}
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
</style>