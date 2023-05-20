<template>
    <div class="sub-detail">

        <i-table class="table-normal mb20 " :data="data" :columns="columuns2"></i-table>
                                
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { ProjecthighlightsService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("ProjecthighlightsService")
    protected projecthighlightsService: ProjecthighlightsService;

    protected showTable = false;

    protected showTableId = 0;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "现场照片",
           
            render: (h, {row}: any) =>
            {
                let items = [];
                let types = [".jpg", ".jpeg", ".png", ".gif", ".3gp", ".avi", ".mpeg"];
                row && row.commonFileList && row.commonFileList.forEach(item =>
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
                        
                        (types.filter(it => it === item.fileSuffix).length > 0) && h("img",
                        {
                            attrs: {src: imagePath(item.filePath)},
                            style: {
                                opacity: 0,
                                width: "100%",
                                height: "100%"
                            }
                        }),
                        (item.fileSuffix === ".mp4" ||  item.fileSuffix === ".ogg" || item.fileSuffix === ".mov") && h("img",
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
            title: "情况描述",
            width: 220,
            render: (h, {row}: any) =>
            {
                return h("div", row.describe);
            }
        },
        {
            title: "操作",
            width: 130,
            render: (h, {row}: any) =>
            {
                return h("div", {
                    class: "font-main",
                    on:
                    {
                        click: e =>
                        {
                            this.$modal.confirm({
                                title: "提示",
                                content: "您确定要删除该数据吗？",
                                onOk: async () =>
                                {
                                    try
                                    {
                                        await this.projecthighlightsService.virtualRemoveById(row.id);
                                        this.$message.success("操作成功");
                                        this.getPublicity(this.detail.id);
                                    } catch (error) {
                                        this.$message.error("操作失败：" + error.msg);
                                    }
                                }
                            });
                        }
                    }
                }, "删除");
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

    protected async getPublicity(projectId)
    {
        this.data = await this.projecthighlightsService.list({projectId});
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
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
    }
    
}
</style>