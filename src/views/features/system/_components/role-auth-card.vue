<template>
    <div class="auth-card">

        <RoleAuthTree :data="permissionTreeCopy" :singleChild="singleChild" @on-change="onPermissionTreeChange"></RoleAuthTree>
    </div>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import RoleAuthTree from "./role-auth-tree.vue";

@component({
    components:
    {
        RoleAuthTree
    }
})
export default class AuthCard extends View
{
    /**
     * 权限树所拥有的权限
     * @config
     */
    @config({required: true, type: Array, default: () => [] })
    protected data: Array<number>;

    @config({required: false, type: Array, default: () => []})
    protected dataAuth: Array<any>;

    /**
     * 权限树数据源
     * @config
     */
    @config({required: false})
    protected permissionTree: Array<any>;

    /**
     * 最终子节点是否单选
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected singleChild: boolean;

    protected permissionTreeCopy = [];

    protected onPermissionTreeChange(newTree: Array<any>)
    {
        console.log("on-change", newTree);
        let result = this.getTargetPermission(newTree, []);
        this.$emit("on-permission-change", result);
    }

    @watch("permissionTree", {immediate: true})
    protected permissionTreeWatcher(val: Array<any>)
    {
        this.permissionTreeCopy = JSON.parse(JSON.stringify(val));
    }

    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<number>)
    {
        this.permissionTreeCopy = JSON.parse(JSON.stringify(this.permissionTree));
        val.forEach(item =>
        {
            this.setTargetPermissionNodeStatus(item, this.permissionTreeCopy);
        });
    }

    private setTargetPermissionNodeStatus(targetId: number, data: Array<any>)
    {
        data.forEach(item =>
        {
            if (item.id === targetId)
            {
                item.enable = true;
                let authTarget = this.dataAuth.find(authItem =>
                {
                    return authItem.id === targetId;
                });
                if (authTarget)
                {
                    item.selectedDataIsolationLevel = authTarget.selectedDataIsolationLevel;
                }
            }

            if (Array.isArray(item.children))
            {
                this.setTargetPermissionNodeStatus(targetId, item.children);
            }
        });
    }

    private getTargetPermission(data: Array<any>, result: Array<any>)
    {
        data.forEach(item =>
        {
            if (item.enable)
            {
                let t: any = {permissionId: item.id};
                if (item.selectedDataIsolationLevel)
                {
                    t.dataIsolationLevel = item.selectedDataIsolationLevel;
                }
                result.push(t);
            }

            if (Array.isArray(item.children))
            {
                this.getTargetPermission(item.children, result);
            }
        });
        return result;
    }
}
</script>

<style lang="less" scoped>
.auth-card
{
    .card-head
    {
        padding: 0 32px 0 91px;
        height: 44px;
        background-color: #f2f6f9;
        color: #A6ABB5;
        font-size: 14px;
        font-weight: 400;
        line-height: 44px;
        border-bottom: 1px solid #E9EBEC;

        .key-label
        {
            display: inline-block;
            width: 180px;
        }
        .ctrl-all
        {
            float: right;

            @{deep}.checkbox
            {
                margin-right: 0;
                color: #A6ABB5;
                font-size: 14px;
                font-weight: 400;

                .ivu-checkbox
                {
                    top: -1px;
                }
            }
        }
    }

    .simple-auth
    {
        padding: 0 32px 0 91px;
        height: 44px;
        font-size: 14px;
        font-weight: 400;
        color: #182334;
        line-height: 44px;
        border-left: 1px solid #E9EBEC;
        border-right: 1px solid #E9EBEC;
        border-bottom: 1px solid #E9EBEC;

        .key-label
        {
            display: inline-block;
            width: 180px;
        }
        .ctrl-all
        {
            float: right;
            @{deep}.checkbox
            {
                margin-right: 31px;
            }
        }
        @{deep}.ivu-checkbox
        {
            top: -1px;
        }
    }

    .multi-auth
    {
        border-radius: 0;
        border-top: none;
        border-color: #E9EBEC;

        @{deep}.panel-item
        {
            border-radius: 0;

            .panel-mask
            {
                display: inline-block;
                width: 100%;
                padding-left: 29px;

                .panel-title
                {
                    position: relative;
                    left: -12px;
                    font-size: 14px;
                    color: #182334;
                }
                .panel-ctrl
                {
                    float: right;
                    margin-right: 55px;
                }
            }

            .ivu-collapse-header
            {
                position: relative;
                border-radius: 0;
                padding-left: 74px;
                height: 44px;
                line-height: 44px;
                background-color: #fff;
                

                .ivu-icon-ios-arrow-forward
                {
                    position: absolute;
                    top: 16px;
                }
            }
            .ivu-collapse-content
            {
                border-radius: 0;
                line-height: 44px;
                padding: 0;

                .ivu-collapse-content-box
                {
                    padding: 0;
                    font-size: 14px;
                    color: #182334;

                    .auth-item-container
                    {
                        padding-left: 107px;
                        border-bottom: 1px solid #E9EBEC;
                    }
                    .auth-item-container:last-child
                    {
                        border-bottom: none;
                    }
                    .key-label
                    {
                        display: inline-block;
                        width: 164px;
                    }
                    .ctrl-all
                    {
                        float: right;
                        margin-right: 55px;
                    }
                }
            }
            .ivu-checkbox
            {
                top: -1px;
            }
        }
    }
    
    @{deep}.ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active>.ivu-collapse-header
    {
        border-color: #E9EBEC;
    }

    @{deep}.ivu-checkbox-indeterminate
    {
        .ivu-checkbox-inner
        {
            background-color: #3375f4;
            border: 1px solid #3375f4;
        }
        .ivu-checkbox-inner:after
        {
            left: 3px;
            width: 10px;
            top: 7px;
        }
    }
}
</style>
