<template>
    <i-poptip v-model="visible" placement="right" transfer>
        <span class="score-special-danger-tip danger-tip">问题描述</span>
        <div class="api" slot="content">
            <div class="score-special-danger-tip-content">
                <ul class="tip-list" v-if="data.length > 0">
                    <li class="tip-item" v-for="(item, i) in data" :key="i" @click="onTipClick(item, i)">{{item.questionDescription}}</li>
                </ul>
                <span v-else>暂无问题描述</span>
            </div>
        </div>
    </i-poptip>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { SpecialDangerTipService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class ScoreSpecialDangerTipView extends View
{
    @service("SpecialDangerTipService")
    private specialDangerTipService: SpecialDangerTipService;

    /**
     * 隐患id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected checkId: number;

    @config({required: false})
    protected rowIndex: number;

    protected data: Array<any> = [];

    protected visible = false;

    protected onTipClick(item: any, i: number)
    {
        this.$emit("on-change", item, this.rowIndex);
        this.visible = false;
    }

    @watch("checkId", {immediate: true})
    protected checkIdWatcher(val: number)
    {
        if (val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        const res = await this.specialDangerTipService.query(this.checkId);
        this.data = res.content;
    }
}
</script>

<style lang="less">
.score-special-danger-tip.danger-tip
{
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    position: relative;
    width: 30px;
    height: 100%;
    padding-left: 5px;
    border: 1px solid #ddd;
    background-color: #e3e3e3;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.score-special-danger-tip-content
{
    .tip-list
    {
        .tip-item
        {
            cursor: pointer;
        }
        .tip-item:hover
        {
            background-color: #3375f4;
            color: #fff;
        }
    }
}


</style>