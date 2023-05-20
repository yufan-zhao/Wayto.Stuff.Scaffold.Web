<template>
    <i-cascader
        class="org-cascader"
        :value="valueCopy"
        :data="data"
        :disabled="disabled"
        change-on-select
        transfer
        @on-change="onChange"
    ></i-cascader>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";

@component
export default class OrgSelect extends View
{
    /**
     * 双向绑定
     * @config
     */
    @config({required: false, type: Array, default: () => []})
    protected value: Array<any>;

    /**
     * 选择的数据源
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

    /**
     * 是否禁用
     * @config
     */
    @config({required: false, type: Boolean, default: false})
    protected disabled: boolean;

    /**
     * 数据副本
     * @property
     */
    protected valueCopy: Array<number> = [];

    /**
     * 数据变动监听
     * @watch
     */
    @watch("value", { immediate: true })
    protected valueWatcher(val: Array<any>)
    {
        this.valueCopy = val;
    }

    protected onChange(value: Array<number>, selectedData: Array<any>)
    {
        console.log("org-select", value);
        if (value.length > 0)
        {
            this.$emit("on-change", value);
        }
        else
        {
            this.$emit("on-change", value);
        }
    }
}
</script>

<style lang="less" scoped>
.org-cascader
{
    @{deep}.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text.ivu-input-wrapper-disabled
    {
        input
        {
            color: #333333;
        }
    }
}
</style>