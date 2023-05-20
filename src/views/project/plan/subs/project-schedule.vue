<template>
    <div class="sub-detail">

        <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table>
                                
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { ProjectscheduleService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("ProjectscheduleService")
    protected projectscheduleService: ProjectscheduleService;

    protected showTable = false;

    protected showTableId = 0;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "现场照片",
            minWidth: 220,
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
            title: "施工阶段",
            width: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.constructionStageName || "-");
            }
        },
        {
            title: "项目进度概述",
            width: 160,
            render: (h, {row}: any) =>
            {
                return h("div", row.describe || "-");
            }
        },
        {
            title: "提交人",
            width: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.submitName || "-");
            }
        },
        {
            title: "提交时间",
            width: 100,
            render: (h, {row}: any) =>
            {
                return h("div", row.createTime || "-");
            }
        },
        {
            title: "操作",
            width: 100,
            render: (h, {row}: any) =>
            {
                return h("div", [
                    h("div",
                    {
                        class: "cursor-pointer font-main",
                        on:
                        {
                            "click": () =>
                            {
                                this.$modal.confirm({
                                title: "提示",
                                content: "您确定要删除该数据吗？",
                                onOk: async () =>
                                {
                                    try
                                    {
                                        await this.projectscheduleService.virtualRemoveById(row.id);
                                        this.$message.success("操作成功");
                                        this.getPublicity(this.detail.id);
                                    } catch (error) {
                                        this.$message.success("操作失败：" + error);
                                    }
                                }
                            });
                            }
                        }
                    }, "删除")
                ]);
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
        this.data = await this.projectscheduleService.list({consultPlanId});
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