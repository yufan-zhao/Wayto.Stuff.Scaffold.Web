<template>
    <section class="u-map-picker">
        <u-map-box :search-icon="false" ref="searchBox" @on-search="search">
            <template slot="extends">
                <amap-position-picker
                    @initialized="initialize"
                    v-model="currPosition"
                    mode="dragMarker"
                    :allowClick="true"
                    :iconStyle="iconStyle"
                    @select="onSelect">
                </amap-position-picker>
            </template>
        </u-map-box>
    </section>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import MapBox from "src/components/application/map-box";
import globalConfig from "src/common/utils/global";

@component
({
    components:
    {
        "u-map-box": MapBox
    }
})
export default class Consoles extends View
{
    
    /**
     * 中心
     * @protected
     * @type {boolean}
     */
    @config({required: false, type: Array, default: () => globalConfig.mapCenter})
    protected mapCenter: any;

    /**
     * 图标实例。
     * @private
     * @type {any}
     */
    protected marker: any = null;
    
    /**
     * 地理位置。
     * @protected
     * @type {string}
     */
    protected location: string = "";

    /**
     * 图标样式。
     * @protected
     * @type {Object}
     */
    protected iconStyle: any =
    {
        url: this.defaultIconPath,
        size: [38, 38],
        ancher: [19, 19]
    };

    /**
     * 地图选点坐标。
     * @protected
     * @type {Array<number>}
     */
    protected currPosition: Array<number> = null;

    /**
     * 图标路径。
     * @protected
     * @type {string}
     */
    @config({type: String, default: ""})
    protected iconPath: string;

    /**
     * 所在经纬度。
     * @protected
     * @type {Array<number>}
     */
    @config({type: Array})
    protected position: Array<number>;

    /**
     * 默认图标地址。
     * @private
     * @type {string}
     */
    private get defaultIconPath(): string
    {
        return require("src/assets/application/map.png");
    }

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
     * 地图选择器加载完成后触发。
     * @protected
     * @returns {void}
     */
    protected initialize({source}): void
    {
        this.marker = source.component.marker;
        this.onIconPathChange();
    }

    /**
     * 选点触发。
     * @protected
     * @param {any} payload - 当前坐标的信息。
     * @returns {void}
     */
    protected onSelect(payload: any): void
    {
        this.location = payload.address;

        this.$emit("on-change",
        {
            location: this.location,
            position: this.currPosition
        });
    }

    /**
     * 设置中心点。
     * @protected
     * @param {Array<number>} - position 将要设置成中心点的经纬度。
     * @returns {void}
     */
    protected setCenter(position: Array<number>): void
    {
        this.currPosition = Object.assign([], position);
    }

    /**
     * 搜索。
     * @protected
     * @param {any} - e 地图组件传入进来的坐标信息。
     * @returns {void}
     */
    protected search(e: any): void
    {
        if (e.poi && e.poi.location)
        {
            const
                loc = e.poi.location,
                center = [loc.lng, loc.lat];

            this.setCenter(center);
        }
    }

    /**
     * 清空搜索框关键词。
     * @protected
     * @returns {void}
     */
    protected clearKeyword(): void
    {
        const searchBox: any = this.$refs.searchBox;

        searchBox && searchBox.searchClose();
    }

    /**
     * 组件创建完成后的钩子函数。
     * @private
     * @returns {void}
     */
    private created(): void
    {
        this.currPosition = this.defaultCenter;
    }

    /**
     * 监听图标路径的变化。
     * @private
     * @returns {void}
     */
    @watch("iconPath", { immediate: true })
    private onIconPathChange(): void
    {
        this.marker && this.marker.setContent(`<img src="${this.iconPath || this.defaultIconPath}" style="width: ${this.iconStyle.size[0]}px; height: ${this.iconStyle.size[1]}px;"/>`);
    }

    /**
     * 监听传入的经纬度。
     * @private
     * @returns {void}
     */
    @watch("position", { deep: true, immediate: true })
    private onValueChange(): void
    {
        this.setCenter(this.position);
    }
}
</script>

<style lang="less">
    @import "./map-picker.less";
</style>
