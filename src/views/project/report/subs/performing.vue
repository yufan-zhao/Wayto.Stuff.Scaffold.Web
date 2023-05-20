<template>
    <div class="sub-detail">

        <i-table class="table-normal mb20" :data="data" :columns="columuns2">
            <template slot-scope="{ row }" slot="media">
                <div class="slot-container">
                    <b-table-media
                        :data="[{filePath: row.filePath}]"
                        :size="[208, 117]"
                    ></b-table-media>
                </div>
            </template>
        </i-table>
                                
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { PerformanceService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("PerformanceService")
    protected performanceService: PerformanceService;

    protected showTable = false;

    protected showTableId = 0;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "现场照片",
            width: 220,
            slot: "media"
        },
        {
            title: "人员名称",
            key: "userName"
        },
        {
            title: "人员职位",
            key: "position"
        },
        {
            title: "在岗情况",
            render: (h, {row}: any) =>
            {
                return h("div", row.jobSituation ? "在岗" : "离岗");
            }
        },
        {
            title: "离岗情况描述",
            render: (h, {row}: any) =>
            {
                return h("div", row.description);
            }
        }
    ];

    @config({required: true, default: () => ({})})
    protected detail: any;

    @watch("detail",{immediate: true})
    protected onChange(value)
    {
        this.getPublicity(value.id);
    }

    protected async getPublicity(consultPlanId)
    {
        this.data = await this.performanceService.list({consultPlanId});
        // console.log(this.data);
        
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

.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
        text-align: center;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        text-align: center;
    }
}
</style>