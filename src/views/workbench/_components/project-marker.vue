<template>
    <div class="project-marker">
        <div class="content" @click="onMarkerClick">
            <div class="title" :style="{'background-color': color}" v-if="isShowTitle">
                <span class="label">{{projectName}}</span>
            </div>
            <div class="pin" @mouseenter="onHover(true)" @mouseleave="onHover(false)">
                <Icon type="ios-pin" :style="{color: color}" size="30" />
            </div>
            <div class="sub-title">
                <!-- <div class="main" :style="{'color': color, 'border-color': color}">
                    <span class="label">安全生产 {{safetyDay}} 天</span>
                </div> -->
                <div class="left" :style="{'border-color': color}"></div>
            </div>
        </div>
        <!-- <div class="hook" :style="{'background-color': color}"></div> -->
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class ProjectMarker extends CommonView
{
    @config({required: false})
    protected data: any;

    @config({required: false, default: "#4A88FF"})
    protected color: string;

    @config({required: true})
    protected itemIndex: number;

    /**
     * 是否展示title
     */
    protected isShowTitle: boolean = false;

    protected get projectName()
    {
        return this.data ? this.data.projectName : "-";
    }

    protected get safetyDay()
    {
        return this.data ? this.data.safetyDay : "-";
    }

    protected onMarkerClick()
    {
        this.$emit("on-select", JSON.parse(JSON.stringify(this.data)));
    }

    protected onHover(trigger: boolean)
    {
        this.isShowTitle = trigger;
        this.$emit("on-hover", this.itemIndex, trigger);
    }
}
</script>

<style lang="less" scoped>
.project-marker
{
    width: 2px;
    height: 2px;
    // background-color: red;
    margin-top: 39px;
    margin-left: 9px;
    position: relative;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    
    .content
    {
        position: absolute;
        z-index: 10;
        bottom: 6px;

        .title
        {
            display: flex;
            align-items: center;
            height: 38px;
            min-width: 120px;
            padding: 0 15px;
            background-color: #4A88FF;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            border-top-right-radius: 4px;
        }
        .pin
        {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sub-title
        {
            position: absolute;
            top: -23px;
            height: 24px;
            overflow: hidden;

            .main
            {
                display: flex;
                align-items: center;
                height: 100%;
                white-space: nowrap;
                transform: skewX(30deg);
                background-color: #fff;
                font-size: 12px;
                color: #1C4BA5;
                padding-right: 16px;
                padding-left: 20px;
                border: 1px solid #4A88FF;
                transform-origin: bottom;
                border-top-left-radius: 12px;
                border-top-right-radius: 4px;

                .label
                {
                    display: block;
                    transform: skewX(-30deg);
                }
            }
            .left
            {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 2px;
                border-left: 1px solid #4A88FF;
                border-top: 1px solid #4A88FF;
                border-top-left-radius: 8px;
            }
        }
    }
    .hook
    {
        position: absolute;
        bottom: 2px;
        z-index: 5;
        width: 8px;
        height: 8px;
        background-color: #4A88FF;
        transform: rotate(45deg);
    }
}
</style>