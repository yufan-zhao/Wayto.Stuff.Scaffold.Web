<template>
    <section class="u-map-position">
        
        <div class="u-map-entry">
            <i-tooltip :content="valueCopy" transfer theme="light" :delay="1000" style="width:100%" :max-width="303">
                
            <i-input placeholder="请点击选择地址" v-model="valueCopy" @on-change="onInputLocationChange">
                <span slot="append" @click="visible = true">
                    <i-icon type="md-locate" />
                </span>
                
            </i-input>
            </i-tooltip>
            <!-- <i slot="append" class="iconfont icon-dibiao"></i> -->
        </div>
        

        <i-modal v-model="visible" width="650" class-name="u-map-modal" @on-ok="onOpen" @on-cancel="cancel">
            <u-map-picker v-if="!view" :position="pos" @on-change="onPickerChange" :visible="!view">
                <template slot="extends">
                    <amap-marker :visible="view" :position="pos"></amap-marker>
                </template>
            </u-map-picker>

            <span class="u-map-close" @click="cancel"><i class="iconfont icon-close"></i></span>
            <div class="u-map-controll">
                <i-button type="default" @click="cancel">取消</i-button>
                <i-button type="primary" @click="ok" v-if="!view">确定</i-button>
            </div>
        </i-modal>
    </section>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";

import MapPicker from "src/components/application/map-picker";
import globalConfig from "src/common/utils/global";

@component
({
    components:
    {
        "u-map-picker": MapPicker
    }
})
export default class MapPosition extends View
{
    /**
     * 地图弹窗显示状态。
     * @protected
     * @type {boolean}
     */
    protected visible: boolean = false;

    /**
     * 中心
     * @protected
     * @type {boolean}
     */
    @config({required: false, type: Array, default: () => globalConfig.mapCenter})
    protected mapCenter: any;

    /**
     * 地理位置信息。
     * @protected
     * @type {string}
     */
    protected location: string = "";

    /**
     * 当前的地理位置信息。
     * @protected
     * @type {string}
     */
    protected currLocation: string = "";

    /**
     * 当前的经纬度。
     * @protected
     * @type {Array<number>}
     */
    protected currPosition: Array<number> = [];

    /**
     * 信息点的经纬度(传入)。
     * @protected
     * @type {Array<number>}
     */
    @config({ type: Array, default: () => null })
    protected position: Array<number>;

    /**
     * 选取或显示状态。
     * @protected
     * @type {boolean}
     */
    @config({ type: Boolean, default: false })
    protected view: boolean;

    /**
     * 信息点的经纬度。
     * @protected
     * @type {Array<number>}
     */
    protected pos: Array<number> = null;

    /**
     * 地理位置信息。
     * @protected
     * @type {string}
     */
    @config({ type: String })
    protected value: string;

    protected valueCopy: string;

    /**
     * 获取默认坐标点。
     * @protected
     * @returns {Array<number>}
     */
    protected get defaultCenter(): Array<number>
    {
        try
        {
            const corporation = this.position || globalConfig.mapCenter;
            return corporation;
        }
        catch (e)
        {
            return this.mapCenter;
        }
    }

    /**
     * 经纬度变化。
     * @protected
     * @returns {void}
     */
    protected onPickerChange(payload: any): void
    {
        const { location, position } = payload;

        this.currLocation = location;
        this.currPosition = position;
    }

    protected onInputLocationChange(e)
    {
        this.$emit("input", this.valueCopy);
    }

    /**
     * 取消触发。
     * @protected
     * @returns {void}
     */
    protected cancel(): void
    {
        this.visible = false;

        this.pos = Object.assign([], this.pos);
    }

    /**
     * 确认触发。
     * @protected
     * @returns {void}
     */
    protected ok(): void
    {
        this.location = this.currLocation;
        this.pos = this.currPosition;
        
        this.$emit("input", this.location);

        this.$emit("on-change",
        {
            location: this.location,
            position: this.currPosition
        });

        this.cancel();
    }

    /**
     * 弹窗打开时候触发。
     * @protected
     * @returns {void}
     */
    protected onOpen(): void
    {
        this.pos = Object.assign([], this.pos);
    }

    /**
     * 监听经纬度。
     * @protected
     * @returns {void}
     */
    @watch("position", { deep: true, immediate: true })
    protected onPositionChange(): void
    {
        this.pos = this.position && this.position.length === 2 && this.position[0] && this.position[1] ? this.position : this.defaultCenter;
    }

    @watch("value", {immediate: true})
    protected valueWatcher(val: string)
    {
        this.valueCopy = val;
    }
}
</script>

<style lang="less">
    @import "./map-position.less";
</style>
