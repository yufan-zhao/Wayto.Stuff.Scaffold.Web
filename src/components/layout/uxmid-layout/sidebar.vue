<template>
    <div class="layout-sidebar">
        <div class="header">
            <span class="logo-container">
                <img src="src/assets/logo-banner.png" />
            </span>
            <!-- <span class="brand">智慧工程安全</span> -->
        </div>

        <div class="menu">
            <template v-for="(item, i) in menus">
                <template v-if="item.children && item.children.length > 0">
                    <div class="sub-title" :key="i">{{item.label}}</div>

                    <div class="menu-item" :class="{active: currentMenuLabel === jtem.label}" v-for="(jtem, j) in item.children" :key="i + '-' + j" @click="onMenuClick(jtem, jtem.label)">
                        <span class="brand"></span>
                        <span class="icon-container">
                            <i v-if="jtem.icon" class="iconfont" :class="jtem.icon" :style="{color: jtem.iconColor}"></i>
                        </span>
                        <span class="label">{{jtem.label}}</span>
                    </div>
                </template>

                <div class="menu-item" :class="{active: currentMenuLabel === item.label}" v-else :key="i" @click="onMenuClick(item, item.label)">
                    <span class="brand"></span>
                    <span class="icon-container">
                        <i v-if="item.icon" class="iconfont" :class="item.icon" :style="{color: item.iconColor}"></i>
                    </span>
                    <span class="label">{{item.label}}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";
import { IApplicationMenu } from "src/models";

@component
export default class Sidebar extends Component
{
    /**
     * 传入的侧栏菜单列表
     * @config
     */
    @config({required: false, type: Array, default: () => []})
    protected menus: Array<IApplicationMenu>;

    /**
     * 当前应该高亮的菜单
     * @config
     */
    @config({required: false, type: String, default: ""})
    protected activeMenu: string;

    /**
     * 当前应该高亮的菜单名字（默认菜单名称都不一样）
     * @property
     */
    protected currentMenuLabel: string = "";

    /**
     * 菜单点击事件
     * @protected
     */
    protected onMenuClick(menuItem: IApplicationMenu, menuLabel: string)
    {
        this.currentMenuLabel = menuLabel;
        // 传递消息给父组件
        this.$emit("on-menu-change", menuItem.routeName, menuItem);
    }

    /**
     * 布局组件初始化时触发监听
     * @watcher
     */
    @watch("activeMenu", {immediate: true})
    protected activeMenuWatcher(val: string)
    {
        this.currentMenuLabel = val;
    }
}
</script>

<style lang="less" scoped>
.layout-sidebar
{
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.0600);
    overflow: auto;

    .header
    {
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-top: 20px;

        .logo-container
        {
            width: 90%;
            height: 50px;
            // background-color: #ddd;
            border-radius: 50%;
            margin-right: 10px;

            img
            {
                width: 100%;
            }
        }
        .brand
        {
            font-size: 16px;
            font-weight: bold;
            color: #0759A6;
        }
    }

    .menu
    {
        margin-top: 22px;

        .sub-title
        {
            height: 30px;
            padding-left: 35px;
            margin-top: 15px;
            font-size: 12px;
            color: #AAB1BD;
        }
        .menu-item
        {
            position: relative;
            display: flex;
            align-items: center;
            height: 48px;
            padding-left: 34px;
            cursor: pointer;
            transition: background-color ease-in-out 0.3s;

            .icon-container
            {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 18px;
                height: 18px;
                margin-right: 18px;
                // background-color: #ddd;

                i
                {
                    font-size: 20px;
                }
            }

            .label
            {
                font-size: 14px;
                color: #182334;
                transition: color ease-in 0.3s;
            }
            .brand
            {
                position: absolute;
                left: 0;
                width: 3px;
                height: 100%;
                background-color: #417EF3;
                opacity: 0;
                transition: opacity ease-in-out 0.3s;
            }
        }
        .menu-item.active
        {
            background-color: #EFF5FE;

            .brand
            {
                opacity: 1;
            }
            .label
            {
                color: #417EF3;
                font-weight: bold;
            }
        }
        .menu-item:hover
        {
            background-color: #EFF5FE;

            .brand
            {
                opacity: 1;
            }
            .label
            {
                color: #417EF3;
            }
        }
    }
}
</style>