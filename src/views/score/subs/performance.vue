<template>
    <div class="performance-view">
        <div class="header">
            <div class="left"></div>
            <div class="right">
                <i-button type="primary" @click="onItemAdd">+ 履职情况</i-button>
            </div>
        </div>

        <i-table
            :columns="column"
            :data="data"
        >
            <template slot-scope="{ row }" slot="media">
                <div class="slot-container">
                    <b-table-media
                        :data="row.filePath ? [{filePath: row.filePath}] : []"
                        :size="[208, 117]"
                    ></b-table-media>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="action">
                <span class="action-slot">
                    <span class="btn" @click="onItemOps('update', row, index)">修改</span>
                    <span class="btn" @click="onItemOps('delete', row, index)">删除</span>
                </span>
            </template>
        </i-table>

        <main-modal ref="mainModal" :consultDetail="consultDetail" @on-refresh="initData"></main-modal>
        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { PerformanceModal } from "../_components";
import { ScorePerformanceService } from "src/services";
import { service } from "src/common/decorator";

/**
 * 项目亮点
 */
@component({
    components:
    {
        "main-modal": PerformanceModal
    }
})
export default class PerformanceView extends View
{
    @service("ScorePerformanceService")
    private mainService: ScorePerformanceService;

    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    protected column =
    [
        {
            title: "现场照片",
            slot: "media",
            width: 240
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
            key: "jobSituationValue"
        },
        {
            title: "离职情况描述",
            key: "description"
        },
        {
            title: "提交人",
            key: "submitName"
        },
        {
            title: "提交时间",
            key: "updateTime"
        },
        {
            title: "操作",
            slot: "action"
        }
    ];

    protected data: Array<any> = [];

    protected onItemAdd()
    {
        this._mainModal.open("insert", this.consultDetail.id);
    }

    protected onItemOps(type: string, data: any)
    {
        if (type === "update")
        {
            this._mainModal.open("update", this.consultDetail.id, data);
        }
        else if (type === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前项",
                onOk: async () => {
                    try
                    {
                        this.mainService.delete(data.id);
                        this.$message.success("操作成功");
                        this.initData();
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

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
        const res = await this.mainService.query(this.consultDetail.id);
        this.data = res.content;
    }

    private get _warningModal()
    {
        return this.$refs["warningModal"] as any;
    }

    private get _mainModal()
    {
        return this.$refs["mainModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.performance-view
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

@{deep}.action-slot
{
    .btn
    {
        margin-right: 20px;
        cursor: pointer;
        color: #3375F4;
        transition: color ease-in-out 0.3s;
    }
    .btn:hover
    {
        color: lighten(#3375F4, 10%);
    }
}
</style>