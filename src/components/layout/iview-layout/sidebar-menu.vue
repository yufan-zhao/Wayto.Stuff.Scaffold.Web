<template>
    <i-menu theme="dark" width="auto" class="menu-instance" :class="menuitemClasses">
        <div class="sub-title">
            <img class="logo-img" src="~assets/application/logo.png" alt="logo">
            <span class="label">后台管理</span>
        </div>

        <!-- <i-menu-item
            class="menu-instance-item"
            name="workbench"
        >
            <i class="iconfont" :class="'iconicon_board'"></i>
            <span>工作台</span>
        </i-menu-item>

        <i-submenu>
            <template slot="title">
                示例代码
            </template>

            <i-menu-item class="menu-instance-item">
                <i class="iconfont" :class="'iconicon_board'"></i>
                <span>表格</span>
            </i-menu-item>
        </i-submenu> -->

        <template v-for="(item, i) in menus">
            <i-submenu 
                v-if="item.children && item.children.length > 0"
                class="menu-instance-sub"
                :key="i"
            >
                <template slot="title">
                    <i class="iconfont" :class="[item.icon]"></i>
                    {{item.label}}
                </template>
                <i-menu-item
                    v-for="(jtem, j) in item.children"
                    class="menu-instance-item"
                    :key="i + '-' +j"
                >
                    <i class="iconfont" :class="[jtem.icon]"></i>
                    <span>{{jtem.label}}</span>
                </i-menu-item>
            </i-submenu>
            <i-menu-item
                v-else
                class="menu-instance-item"
                :key="i"
            >
                <i class="iconfont" :class="[item.icon]"></i>
                <span>{{item.label}}</span>
            </i-menu-item>
        </template>
    </i-menu>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";
import { ApplicationContext } from "src/application";
import { IApplicationMenu } from "src/models";

@component
export default class SidebarMenu extends Component
{
    /**
     * 侧栏菜单是否折叠
     * @config
     */
    @config({required: true, type: Boolean, default: false})
    protected isCollapsed: boolean;

    /**
     * 菜单列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected menus: Array<IApplicationMenu>;

    /**
     * 菜单动态class
     * @property
     * @get
     */
    protected get menuitemClasses(): Array<string>
    {
        const classList: Array<string> =
        [
            "menu-item",
            this.isCollapsed ? "collapsed-menu" : ""
        ];
        return classList;
    }
}
</script>

<style lang="less" scoped>
@import "./menu.less";
</style>
