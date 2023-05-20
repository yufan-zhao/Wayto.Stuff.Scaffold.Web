<template>
    <div class="safety-calendar-view">
        <div class="header">
            <div class="left"></div>
            <div class="right">
                <!-- <i-button type="primary" @click="onItemAdd">+ 项目亮点</i-button> -->
            </div>
        </div>

        <SafetyCalendarTable
            :consultId="consultId"
        ></SafetyCalendarTable>

        <!-- <main-modal ref="mainModal" :consultDetail="consultDetail" @on-refresh="initData"></main-modal> -->
        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
// import { HighlightsModal } from "../_components";
import { ScoreHighlightsService } from "src/services";
import { service } from "src/common/decorator";
import SafetyCalendarTable from "src/views/_components/safety-calendar-table.vue";

/**
 * 安全日历
 */
@component({
    components:
    {
        SafetyCalendarTable
    }
})
export default class SafetyCalendarView extends View
{
    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    protected get consultId()
    {
        if (this.consultDetail)
        {
            return this.consultDetail.id;
        }
        else
        {
            return -1;
        }
    }

    // protected column =
    // [
    //     {
    //         title: "所属类型",
    //         key: "type",
    //         width: 240
    //     },
    //     {
    //         title: "知识内容",
    //         key: "content",
    //         width: 680
    //     },
    //     {
    //         title: "提交人",
    //         key: "submitName"
    //     },
    //     {
    //         title: "提交时间",
    //         key: "updateTime"
    //     },
    //     {
    //         title: "操作",
    //         slot: "action"
    //     }
    // ];

    // /**
    //  * 表格数据
    //  * @property
    //  */
    // protected data: Array<any> = [];

    // /**
    //  * 操作事件
    //  * @protected
    //  */
    // protected onItemOps(type: string, data: any)
    // {
    //     // TODO 操作
    // }

    @watch("consultDetail", {immediate: true})
    protected consultDetailWatcher(val: any)
    {
        if (val)
        {
            this.initData();
        }
    }

    private async initData()
    {
        // TODO 初始化数据
    }

    private get _warningModal()
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.safety-calendar-view
{
    padding: 30px 20px;

    .header
    {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
}

// @{deep}.pic-list
// {
//     display: flex;
//     flex-wrap: wrap;

//     .pic-item
//     {
//         flex: 0 0 auto;
//         padding: 5px;

//         img
//         {
//             width: 208px;
//             height: 117px;
//             object-fit: cover;
//         }
//     }
// }

// @{deep}.action-slot
// {
//     .btn
//     {
//         margin-right: 20px;
//         cursor: pointer;
//         color: #3375F4;
//         transition: color ease-in-out 0.3s;
//     }
//     .btn:hover
//     {
//         color: lighten(#3375F4, 10%);
//     }
// }
</style>