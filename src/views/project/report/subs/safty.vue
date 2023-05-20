<template>
    <div class="sub-detail">

        <!-- <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table> -->
        <SafetyKnowledgeTable :consultId="consultId"></SafetyKnowledgeTable>
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { SafetyService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
import { ExtendUtils } from "src/common/utils";
import SafetyKnowledgeTable from "src/views/_components/safety-knowledge-table.vue";

@component({
    components:
    {
        SafetyKnowledgeTable
    }
})
export default class InfoView extends View
{
    @service("SafetyService")
    protected safetyService: SafetyService;

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

    // protected showTable = false;

    // protected imagePath = imagePath;

    // protected showTableId = 0;

    // protected data: any = [];

    // protected columuns2: Array<any> =
    // [
    //     {
    //         title: "所属体系",
    //         width: 320,
    //         render: (h, {row}: any) =>
    //         {
                
    //             let specialTypeName = ExtendUtils.createTipElement(h, row.specialTypeName, "#0DBF47", false);
    //             return h("section",row.parentPath);
    //         }
    //     },
    //     {
    //         title: "所属类型",
    //         width: 100,
    //         render: (h, {row}: any) =>
    //         {
    //             return h("section", row.specialTypeName);
    //         }
    //     },
    //     {
    //         title: "内容",
            
    //         render: (h, {row}: any) =>
    //         {
    //             return h("div", {
    //                 domProps:
    //                 {
    //                     innerHTML: row.content
    //                 }
                    
    //             });
    //         }
    //     },
    //     {
    //         title: "操作",
    //         width: 130,
    //         render: (h, {row}: any) =>
    //         {
    //             return h("div", {
    //                 class: "font-main",
    //                 on:
    //                 {
    //                     click: e =>
    //                     {
    //                         this.$modal.confirm({
    //                             title: "提示",
    //                             content: "您确定要删除该数据吗？",
    //                             onOk: async () =>
    //                             {
    //                                 try
    //                                 {
    //                                     await this.safetyService.virtualRemoveById(row.id);
    //                                     this.$message.success("操作成功");
    //                                     this.getPublicity(this.detail.id);
    //                                 } catch (error) {
    //                                     this.$message.error("操作失败：" + error.msg);
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 }
    //             }, "删除");
    //         }
    //     }
    // ];

    @config({required: true, default: () => ({})})
    protected detail: any;

    // @watch("detail",{immediate: true})
    // protected onChange(value)
    // {
    //     this.getPublicity(value.id);
    // }

    // protected async getPublicity(consultId?)
    // {
    //     this.data = await this.safetyService.listDetails({consultId});
    //     // {consultId}
    // }

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

// .table-normal
// {
//     margin-top: 0 !important;
//     /deep/.ivu-table th
//     {
//         background-color: #F2F6F9;
//         font-size: 14px;
//         font-family: Microsoft YaHei;
//         font-weight: 400;
//         color: #838D9C;
//         text-align: center;
//     }
//     /deep/.ivu-table-row .ivu-table-cell
//     {
//         background: none !important;
//         font-size: 14px;
//         font-family: PingFang SC;
//         font-weight: 500;
//         color: #182334;
//         padding: 8px;
//         text-align: center;
//     }
// }
</style>