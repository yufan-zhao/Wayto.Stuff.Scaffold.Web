<template>
    <section class="u-map-box">
        <!-- :center="mapConfig.center" -->
        <amap
            ref="amap"
            @map-ready="onMapComplete"
            vid="amap"
            :zoom="volatileZoom"
            
            :expandZoomRange="true"
            :zooms="[0, 20]"
            @click="getPosition"
            :doubleClickZoom="false">
            <!-- :map-style="mapConfig.mapStyle" -->
            <amap-marker :visible="searchIcon && searchVisible" :position="searchPosition" @click="getPosition"></amap-marker>
            
            <slot name="extends"></slot>
        </amap>
        
        <div class="u-map-box-side">
            <div class="u-map-box-search" v-if="searchStatus">
                <!-- @keyup.enter="autoCompleteSelect" -->
                <input v-model="searchKeywords" ref="keywords" autocomplete="off" @keyup.enter="enterSearch" :placeholder="searchPlaceholder" />
                <i class="iconfont icon-guanbi" v-show="searchIcon && searchCloseVisible" @click="searchClose"></i>
            </div>
            <div class="u-map-box-zoom">
                <i class="iconfont icon-plus" @click="zoomChange(true)"></i>
                <i class="iconfont icon-minus" @click="zoomChange(false)"></i>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import globalConfig from "src/common/utils/global";

@component
export default class MapBox extends View
{
    /**
     * 地图搜索自动补充组件。
     * @private
     * @type {any}
     */
    private _autocomplete: any = null;

    /**
     * 地图实例。
     * @private
     * @type {any}
     */
    private mapIns: any = null;
   
    /**
     * 中心
     * @protected
     * @type {boolean}
     */
    @config({required: false, type: Array, default: () => [113.91113, 22.78242]})
    protected mapCenter: any;

    /**
     * 搜索定位图标。
     * @protected
     * @returns {Array<number>}
     */
    protected searchPosition: Array<number> = [0, 0];

    /**
     * 搜索定位图标显示状态。
     * @protected
     * @returns {boolean}
     */
    protected searchVisible: boolean = false;

    /**
     * 搜索定位关闭显示状态。
     * @protected
     * @returns {boolean}
     */
    protected searchCloseVisible: boolean = false;

    /**
     * 搜索关键字。
     * @protected
     * @returns {string}
     */
    protected searchKeywords: string = "";

    /**
     * 搜索提示。
     * @protected
     * @returns {string}
     */
    protected searchPlaceholder: string = "输入关键字选取地点";

    /**
     * 当前地图层级。
     * @protected
     * @type {number}
     */
    protected zoom: number = 12;

    /**
     * 地图缩放倍数(变化)。
     * @protected
     * @type {number}
     */
    protected volatileZoom: number = this.zoom;

    /**
     * 地图中心点。
     * @protected
     * @type {Array<number>}
     */
    @config({ type: Array, default: null })
    protected center: Array<number>;
    
    /**
     * 地图配置
     * @member
     * @protected
     * @returns any
     */
    protected mapConfig: any =
    {
        center: globalConfig.mapCenter,
        mapStyle: "amap://styles/aac976ac63cf46ba0aa9195c15e51efa"
    };

    /**
     * 搜索图标。
     * @public
     * @type {boolean}
     */
    @config({ type: Boolean, default: true })
    public searchIcon: boolean;

    /**
     * 搜索功能状态。
     * @public
     * @type {boolean}
     */
    @config({ type: Boolean, default: true })
    public searchStatus: boolean;
    
    /**
     * 重置状态。
     * @public
     * @type {boolean}
     */
    @config({ type: Boolean, default: false })
    public resetStatus: boolean;

    /**
     * 获取默认坐标点。
     * @protected
     * @returns {Array<number>}
     */
    protected get defaultCenter(): Array<number>
    {
        try
        {
            const corporation = this.center || globalConfig.mapCenter;
            return corporation;
        }
        catch (e)
        {
            return this.mapCenter;
        }
    }

    /**
     * 获取设备信息
     * @protected
     * @param {any} - e map实例对象
     * @returns {Promise<void>}
     */
    protected async onMapComplete(map: any): Promise<void>
    {
        const
            AMap: any = (<any>window).AMap,
            AMapUI: any = (<any>window).AMapUI;

        this.$emit("on-map-ready", this.mapIns = map);

        AMap.plugin(["AMap.Autocomplete"], () =>
        {
            this._autocomplete = new AMap.Autocomplete
            ({
                datatype: "all",
                input: this.$refs.keywords as HTMLInputElement
            });

            this._autocomplete.on("select", this.autoCompleteSelect);
        });
    }

    /**
     * enter键搜索 地址->经纬度
     * @protected
     * @param {any} - e map实例对象
     * @returns {Promise<void>}
     */
    protected async enterSearch(e)
    {
        const
            AMap: any = (<any>window).AMap,
            AMapUI: any = (<any>window).AMapUI;

        AMap.plugin(["AMap.Geocoder"], () =>
        {
            this._autocomplete = new AMap.Geocoder({}).getLocation(this.searchKeywords,
                (status, result) =>
                {
                    if (status === "complete" && result.geocodes.length)
                    {
                        let lnglat = result.geocodes[0].location;
                        let center = [lnglat.lng, lnglat.lat];
                        this.mapIns.setCenter(lnglat);
                        this.mapIns.setZoom(16);
                        this.searchPosition = center;
                        this.mapConfig.center = Object.assign([], center);
                    }
                }
            );
        });
    }

    /**
     * 获取点位置 经纬度->地址
     * @protected
     * @returns {void}
     */
    protected getPosition(data, data1, data2): void
    {
        const
            AMap: any = (<any>window).AMap,
            AMapUI: any = (<any>window).AMapUI;

        AMap.plugin(["AMap.Geocoder"], () =>
        {
            this._autocomplete = new AMap.Geocoder({}).getAddress(data.lnglat,
                (status, result) =>
                {
                    if (status === "complete" && result.regeocode)
                    {
                        this.searchPlaceholder = result.regeocode.formattedAddress;
                    }
                }
            );
        });
    }

    /**
     * 设置中心点。
     * @protected
     * @returns {void}
     */
    protected setCenter(center: Array<number>): void
    {
        center && center[0] && center[1] && (this.mapConfig.center = Object.assign([], center));
    }

    /**
     * 重置地图。
     * @protected
     * @returns {void}
     */
    protected reset(): void
    {
        this.onCenterChange();
        this.mapIns.setZoom(this.zoom);

        this.$emit("update:resetStatus", false);
    }

    /**
     * 搜索地图。
     * @protected
     * @returns {void}
     */
    protected autoCompleteSelect(e: any): void
    {
        
        this.searchKeywords = e.poi && e.poi.name || "";

        if (e.poi && e.poi.location)
        {
            const
                loc = e.poi.location,
                center = [loc.lng, loc.lat];
            
            this.mapIns.setZoom(16);
            this.mapConfig.center = Object.assign([], center);
            this.searchVisible = true;
            this.searchCloseVisible = true;
            this.searchPosition = center;
        }

        this.$emit("on-search", e);
    }

    /**
     * 搜索结果关闭。
     * @protected
     * @returns {void}
     */
    protected searchClose(): void
    {
        this.searchVisible = false;
        this.searchCloseVisible = false;
        this.searchKeywords = "";
    }

    /**
     * 地图缩放。
     * @protected
     * @param {boolean} - increase 是不是增加层级。
     * @returns {void}
     */
    protected zoomChange(increase: boolean): void
    {
        increase ? ++this.volatileZoom : --this.volatileZoom;
    }

    /**
     * 组件销毁前的钩子函数。
     * @private
     * @returns {void}
     */
    private beforeDestory(): void
    {
        this._autocomplete && this._autocomplete.off("select", this.autoCompleteSelect);
    }

    /**
     * 监听中心点的数据变化。
     * @private
     * @returns {void}
     */
    @watch("center", { deep: true, immediate: true })
    private onCenterChange(): void
    {
        this.mapConfig.center = Object.assign([], this.center && this.center[0] && this.center[1] && this.center || this.defaultCenter);
    }

    /**
     * 监听重置状态。
     * @private
     * @returns {void}
     */
    @watch("resetStatus")
    private onResetStatusChange(): void
    {
        this.resetStatus && this.reset();
    }
}
</script>

<style lang="less">
    @import "./map-box.less";
</style>
