<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">基础信息</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" style="width: 100%">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="计量/校准合格证书">{{detail.metrologyCalibrationCertificate  || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="计量/校准单位">{{detail.calibrationUnit  || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="不确定度">{{detail.uncertainty  || "-"}}%</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="效验依据">{{detail.validationBasis  || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="检定/校准周期">{{detail.verificationCalibrationCycle  || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="有效期">{{detail.validityPeriod  || "-"}}天</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="最新检定/校准日期">{{detail.latestCalibrationDate  || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="下次检定/校准日期">{{detail.nextCalibrationDate  || "-"}}</i-form-item>
                    </i-col>
                    <!-- <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="备注">{{detail.xxx  || "-"}}</i-form-item>
                    </i-col> -->
                    
                    <!-- <i-col class-name="u-row" span="24">
                        <i-form-item class="u-form-item" :label-width="180" label="设备照片"></i-form-item>
                        <section class="i-form-details">
                            <div class="img-box-item" style="background: url(https://ts3.cn.mm.bing.net/th?id=OIP-C.S3QOsgnlzrpbpAdOXF4YMAHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2) no-repeat center center;background-size: cover">
                                <img src="src/assets/application/none-data.png" alt="" srcset="">
                            </div>
                        </section>
                    </i-col> -->
                </i-row>
            </i-form>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";

@component
export default class InfoView extends View
{
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

    .img-box-item
    {
        width: 210px;
        height: 120px;
        border-radius: 2px;
        overflow: hidden;
        background-size: cover;
        
        img
        {
            opacity: 0;
        }
        
    }
}
</style>