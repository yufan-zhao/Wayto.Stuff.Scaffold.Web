<template>
    <div class="sub-detail">

        <!-- <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table> -->
        <SafetyCalendarTable :consultId="consultId"></SafetyCalendarTable>
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { SafetyService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
import { ExtendUtils } from "src/common/utils";
import SafetyCalendarTable from "src/views/_components/safety-calendar-table.vue";

@component({
    components:
    {
        SafetyCalendarTable
    }
})
export default class InfoView extends View
{
    @service("SafetyService")
    protected safetyService: SafetyService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected get consultId()
    {
        if (this.detail)
        {
            return this.detail.id;
        }
        else
        {
            return -1;
        }
    }

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

}
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
        width: 100%;
        height: 100%;
    }
    
}
</style>