<template>
    <div class="sub-detail">
        <div>
            <!-- <SpecialRuleTotalCard :data="data" :extraData="extraData" disabled></SpecialRuleTotalCard> -->
            <ScoreDetail
                style="padding-top:0;"
                :consultId="consultId"
                :specialTypeId="specialTypeId"
            ></ScoreDetail>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { SpecialCustomRruleService } from "src/services";
import { service } from "src/common/decorator";
import ScoreDetail from "src/views/score/_components/score-detail.vue";

@component({
    components:
    {
        ScoreDetail
    }
})
export default class InfoView extends View
{
    @service("SpecialCustomRruleService")
    protected specialCustomRruleService: SpecialCustomRruleService;

    /**
     * row detail
     * @config
     */
    @config({required: true, default: () => ({})})
    protected detail: any;

    /**
     * 诊治id
     * @property
     */
    protected get consultId(): number
    {
        return this.detail ? this.detail.id : -1;
    }

    /**
     * 诊治的体系类型id
     * @property
     */
    protected get specialTypeId(): number
    {
        return this.detail ? this.detail.specialTypeId : -1;
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
h3
{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #182334;
}
.table-normal
{
    margin-top: 0 !important;
    margin-top: 10px !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
        line-height: 28px;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        // text-align: center;
    }
    // :first-child .ivu-table-column-ryKzwF 
    /deep/.ivu-table-body .ivu-table-row td:first-child
    {
        background: #F2F6F9 !important;
        .ivu-table-cell
        {
            background: #F2F6F9 !important;
        }
        
    }
}
</style>