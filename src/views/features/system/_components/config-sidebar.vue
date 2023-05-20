<template>
    <div class="sidebar">
        <ul class="menu">
            <li 
                class="item"
                v-for="(item, i) in data"
                :key="i"
                :class="{active: i === activeIndex}"
                @click="onMenuClick(i)"
            >
                <span class="label">{{item.name}}</span>
            </li>

            <p class="split" v-if="hasExtra"></p>
            <li
                class="item extra-item"
            >
                <span class="label">
                    <slot name="button"></slot>
                </span>
            </li>
            <li
                v-if="hasExtra"
                class="item extra-item"
                :class="{active: data.length === activeIndex}"
                @click="onMenuClick(data.length)"
            >
                <span class="label">
                    <slot name="extra"></slot>
                </span>
            </li>
            
        </ul>
    </div>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class Sidebar extends CommonView
{
    /**
     * 传入的菜单列表
     * @protected
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

    /**
     * 是否有额外菜单
     * @protected
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected hasExtra: boolean;

    /**
     * 当前激活的菜单
     * @protected
     * @property
     */
    protected activeIndex: number = null;

    /**
     * 传入菜单列表数据监听事件
     * @protected
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        if (val.length > 0)
        {
            this.onMenuClick(0);
        }
    }

    /**
     * 菜单点击事件
     * @protected
     * @member
     */
    protected onMenuClick(index: number)
    {
        this.activeIndex = index;
        if (index < this.data.length)
        {
            this.$emit("on-item-click", this.data[index]);
        }
        else
        {
            this.$emit("on-extra-item-click");
        }
    }
}
</script>

<style lang="less" scoped>
.sidebar
{
    border-right: 1px solid #E9EBEC;
    overflow-y: auto;

    .menu
    {
        display: flex;
        flex-direction: column;
        // width: 160px;

        .item
        {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            height: 40px;
            width: 100%;
            line-height: 40px;
            border-right: 3px solid #fff;
            padding-left: 50px;
            cursor: pointer;

            .label
            {
                font-size: 14px;
                color: #182334;
                white-space:nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .item.extra-item
        {
            flex-direction: column;
            align-items: flex-start;
            // margin-top: 16px;
            // margin-bottom: 10px;
        }
        .item.active
        {
            border-right-color: #3375f4;

            .label
            {
                color: #3375f4;
                font-weight: bold;
            }
        }
        .split
        {
            margin-left: 50px;
            width: calc(80% - 50px);
            height: 1px;
            background-color: #F1F2F2;
            margin-top: 16px;
            margin-bottom: 16px;
        }
    }
}
.sidebar::-webkit-scrollbar
{
    width: 0;
}
</style>