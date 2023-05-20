<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" style="width: 100%">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="编号">{{detail.toolsNumber || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="设备名称">{{detail.deviceName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="工具类型">{{detail.toolTypeName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="规格型号">{{detail.specifications || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="设备等级">{{detail.toolsLevel || "-"}}级</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="出厂编号">{{detail.factoryNo || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="里程">{{detail.mileage || "-"}}km</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="设备重量">{{detail.deviceWeight || "-"}}kg</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="精度">{{detail.accuracy || "-"}}%</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="设备尺寸">{{detail.deviceSize || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="电压等级">{{detail.voltageLevel || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="功率">{{detail.power || "-"}}FV</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="是否计量器具">{{detail.isEasuringInstrument ? "是" : "否" || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="生产厂家">{{detail.manufacturer || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="生产厂家国别">{{detail.manufacturerCountry || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-row" span="24">
                        <i-form-item class="u-form-item" :label-width="180" label="设备照片"></i-form-item>
                        <section class="i-form-details" v-previewer v-if="detail.scheduleList && detail.scheduleList.length">
                            <div class="img-box-item" :style="{background: `url(${imagePath(item.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-for="item in detail.scheduleList || []" :key="'i' + item.id">
                                <img :src="item.filePath | imagePath" alt="" srcset="">
                            </div>
                        </section>
                        <div class="detail-nodata" v-else>
                                <u-nodata></u-nodata>
                            </div>
                    </i-col>
                </i-row>
            </i-form>
        </div>
    </div>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";

@component
export default class InfoView extends View
{
    protected imagePath = imagePath;

    @config({required: true, default: () => ({})})
    protected detail: any;
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.i-form-details
{
    background: #F6F8FC;
    border: 1px solid #E7E8EC;
    border-radius: 4px;
    padding: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #525A65;
    line-height: 24px;
    display: flex;
    flex-wrap: wrap;

    .img-box-item
    {
        width: 210px;
        height: 120px;
        border-radius: 2px;
        overflow: hidden;
        background-size: cover;
        margin-bottom: 10px;
        margin-right: 10px;
        
        img
        {
            opacity: 0;
            width: 100%;
            height: 100%;
        }
        
    }
}
</style>