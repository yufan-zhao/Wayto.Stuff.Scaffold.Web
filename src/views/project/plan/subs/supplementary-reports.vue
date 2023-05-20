<template>
    <div class="sub-detail">

        <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table>
                                
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { SupplementaryService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("SupplementaryService")
    protected supplementaryService: SupplementaryService;

    protected showTable = false;

    protected showTableId = 0;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "现场主要设备",
            minWidth: 130,
            render: (h, {row}: any) =>
            {
                return h("div", row.equipment || "-");
            }
        },
        {
            title: "项目主要风险",
            minWidth: 130,
            render: (h, {row}: any) =>
            {
                return h("div", row.danger || "-");
            }
        },
        {
            title: "是否有危大工程类型",
            minWidth: 170,
            render: (h, {row}: any) =>
            {
                return h("div", row.isRisk ? "是" : "否");
            }
        },
        {
            title: "危大情况",
            minWidth: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.riskDetails && row.riskDetails.riskType === 1 ? "危大" : (row.riskDetails.riskType === 2 ? "超危大" : "-"));
            }
        },
        {
            title: "工程类别",
            minWidth: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.riskDetails && row.riskDetails.projType || "-");
            }
        },
        
        {
            title: "现场照片",

            width: 220,
            render: (h, {row}: any) =>
            {
                let items = [];
                row.riskDetails && row.riskDetails.commonFiles && row.riskDetails.commonFiles.forEach(item =>
                {
                    let content = h("div",
                    {
                        class: "img-box-item",
                        style:
                        {
                            background: `url(${imagePath(item.filePath)}) no-repeat center center`,
                            backgroundSize: "cover",
                            width: "208px",
                            minWidth: "208px",
                            height: "117px",
                            "border-radius": "2px",
                            overflow: "hidden",
                            marginRight: "5px",
                            marginBottom: "5px"
                        }
                    },
                    [
                        h("img",
                        {
                            attrs: {src: imagePath(item.filePath)},
                            style: {
                                opacity: 0,
                                width: "100%",
                                height: "100%"
                            }
                        })
                    ]);
                    items.push(content);
                });
                
                return h("section",
                {
                    directives: [{name: "previewer"}],
                    class: "d-f f-w"
                }, items);
            }
        },
        {
            title: "是否方案定制",
            minWidth: 130,
            render: (h, {row}: any) =>
            {
                return h("div",row.riskDetails && row.riskDetails.scheme ? "是" : "否");
            }
        },
        {
            title: "是否专家论证",
            minWidth: 130,
            render: (h, {row}: any) =>
            {
                return h("div", row.riskDetails && row.riskDetails.demonstration ? "是" : "否");
            }
        },
        {
            title: "实施阶段及方案执行情况",
            minWidth: 220,
            render: (h, {row}: any) =>
            {
                return h("div", row.implementation || "-");
            }
        },
        {
            title: "问题隐患等级",
            minWidth: 100,
            render: (h, {row}: any) =>
            {
                let dangerLevel = ["","一级","二级","三级"];
                return h("div",{class: "statistics-num-0"}, dangerLevel[row.dangerLevel]);
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
        this.data = await this.supplementaryService.list({consultPlanId});
        // console.log(this.data);
        
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
</style>