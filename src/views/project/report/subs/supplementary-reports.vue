<template>
    <div class="sub-detail">

        <i-table class="table-normal mb20" :data="data" :columns="columuns2">
            <template slot-scope="{ row }" slot="dangers">
                <span class="dangers-slot">
                    <div class="danger" v-for="(item, i) in row.specialDangerItems" :key="i">{{row.riskType ? item.dangerPlusDetails : item.dangerDetails}}</div>
                </span>
            </template>

            <template slot-scope="{ row }" slot="media">
                <div class="slot-container">
                    <b-table-media
                        :data="row.commonFileList"
                        :size="[76, 76]"
                    ></b-table-media>
                </div>
            </template>
        </i-table>
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { SupplementaryService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class InfoView extends View
{
    @service("SupplementaryService")
    protected supplementaryService: SupplementaryService;

    protected showTable = false;

    protected showTableId = 0;

    protected data: Array<any> = [];

    protected columuns2: Array<any> =
    [
        // {
        //     title: "现场主要设备",
        //     minWidth: 130,
        //     render: (h, {row}: any) =>
        //     {
        //         return h("div", row.equipment || "-");
        //     }
        // },
        // {
        //     title: "项目主要风险",
        //     minWidth: 130,
        //     render: (h, {row}: any) =>
        //     {
        //         return h("div", row.danger || "-");
        //     }
        // },
        // {
        //     title: "是否有危大工程类型",
        //     minWidth: 170,
        //     render: (h, {row}: any) =>
        //     {
        //         return h("div", row.isRisk ? "是" : "否");
        //     }
        // },
        {
            title: "工程类别",
            minWidth: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.specialDanger && row.specialDanger.name || "-");
            }
        },
        {
            title: "危大情况",
            minWidth: 100,
            slot: "dangers"
            // render: (h, {row}: any) =>
            // {
            //     return h("div", row.riskDetails && row.riskDetails.riskType === 1 ? "危大" : (row.riskDetails.riskType === 2 ? "超危大" : "-"));
            // }
        },
        {
            title: "现场照片",
            slot: "media",
            width: 300
        },
        {
            title: "方案定制",
            minWidth: 130,
            key: "schemeValue"
        },
        {
            title: "专家论证",
            minWidth: 130,
            key: "demonstrationValue"
        },
        {
            title: "实施阶段及方案执行情况",
            minWidth: 220,
            key: "implementation"
        },
        {
            title: "问题隐患等级",
            minWidth: 120,
            key: "hazardLevelName"
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
        this.data.splice(0);
        const res = await this.supplementaryService.list({consultPlanId});
        if (res[0])
        {
            this.data.push(...res[0].riskDetails);
        }
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.statistics-num
{
    color: #182334;
    &-0
    {
        color: #A533F4;
    }
    &-1
    {
        color: #FF9832;
    }
    &-2
    {
        color: #FF4D3F;
    }
    &-3
    {
        color: #838D9C;
    }
}
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

@{deep}.dangers-slot
{
    .danger
    {
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 4px;
        margin-bottom: 4px;
        padding: 0 4px;
    }
}
</style>