<template>
    <div class="ux-tab-btns">
        <span
            class="btn"
            v-for="(item, i) in data"
            :key="'ux-tab-btn-' + i"
            :class="{active: index === i}"
            @click="onBtnChange(i)"
        >
            {{item}}
            <span class="split" v-if="i !== data.length - 1"></span>
        </span>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";

@component
export default class UxTabBtns extends View
{
    @config({required: true, type: Array, default: () => []})
    protected data: Array<string>;

    protected index: number = 0;

    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<string>)
    {
        if (val.length > 0)
        {
            this.emitIndex();
        }
    }

    protected onBtnChange(i: number)
    {
        this.index = i;
        this.emitIndex();
    }

    protected emitIndex()
    {
        this.$emit("on-change", this.index);
    }
}
</script>

<style lang="less" scoped>
.ux-tab-btns
{
    display: flex;
    height: 26px;

    .btn
    {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 10px;
        font-size: 14px;
        color: #838D9C;
        border-top: 1px solid #838D9C;
        border-bottom: 1px solid #838D9C;
        white-space: nowrap;
        cursor: pointer;

        .split
        {
            width: 1px;
            height: 100%;
            background-color: #838D9C;
            transform: translateX(10px);
        }
    }
    .btn:hover
    {
        color: #4B7EFE;
        border-color: #4B7EFE;

        .split
        {
            background-color: #4B7EFE;
        }
    }
    .btn:nth-child(1)
    {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-left: 1px solid #838D9C;
    }
    .btn:last-child
    {
        border-right: 1px solid #838D9C;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .btn.active
    {
        color: #4B7EFE;
        border-color: #4B7EFE;
    }
    .btn:nth-child(1).active
    {
        border-color: #4B7EFE;
        color: #4B7EFE;
    }
}
</style>