<template>
    <div class="report-view">
        <div class="header">
            <div class="left"></div>
            <div class="right">
                <i-button type="primary" @click="onItemAdd">+ 危大工程</i-button>
            </div>
        </div>

        <i-table
            :columns="column"
            :data="data"
            border
        >
            <template slot-scope="{ row }" slot="dangers">
                <span class="dangers-slot">
                    <div class="danger" v-for="(item, i) in row.epicDangerItems" :key="i">{{row.riskType ? item.dangerPlusDetails : item.dangerDetails}}</div>
                </span>
            </template>

            <template slot-scope="{ row }" slot="media">
                <div class="slot-container">
                    <!-- <div class="pic-list" v-previewer v-if="Array.isArray(row.mediaFiles)">
                        <span class="pic-item" v-for="(item, i) in row.mediaFiles" :key="i">
                            <img :src="'/serverApi' + item.filePath" />
                        </span>
                    </div>
                    <span v-else>-</span> -->
                    <b-table-media
                        :data="row.mediaFiles"
                        :size="[76, 76]"
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
import ReportModal from "../_components/report-modal.vue";
import { ScoreReportService } from "src/services";
import { service } from "src/common/decorator";

/**
 * 补充报告
 */
@component({
    components:
    {
        "main-modal": ReportModal
    }
})
export default class ReportView extends View
{
    @service("ScoreReportService")
    private mainService: ScoreReportService;

    /**
     * 诊治计划id
     * @config
     */
    @config({required: true, type: Number, default: undefined})
    protected consultId: number | undefined;

    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    protected wtfId: number = -1;

    protected isRisk = false;

    protected column =
    [
        {
            title: "工程类别",
            key: "epicDangerTypeName"
        },
        {
            title: "危大情况",
            slot: "dangers"
        },
        {
            title: "现场照片",
            slot: "media",
            width: 300
        },
        {
            title: "方案定制",
            key: "schemeValue",
            width: 110
        },
        {
            title: "专家论证",
            key: "demonstrationValue",
            width: 110
        },
        {
            title: "实施阶段及方案执行情况",
            key: "implementation"
        },
        {
            title: "问题隐患等级",
            key: "dangerLevelName",
            width: 110
        },
        {
            title: "操作",
            slot: "action",
            width: 140
        }
    ];

    protected data: Array<any> = [];

    // protected handleSpan({ row, column, rowIndex, columnIndex })
    // {
    //     if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 10)
    //     {
    //         return row.spanInfo;
    //     }
    // }

    protected onItemAdd()
    {
        this._mainModal.open("insert", null, this.consultId, this.consultDetail.specialTypeId, this.wtfId, this.data);
    }

    protected onItemOps(type: string, data: any)
    {
        if (type === "update")
        {
            this._mainModal.open("update", data, this.consultId, this.consultDetail.specialTypeId, this.wtfId, this.data);
        }
        else if (type === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前项",
                onOk: async () => {
                    try
                    {
                        try
                        {
                            // await this.mainService.deleteById(data.id);
                            await this.mainService.delete(
                                this.wtfId,
                                data.id,
                                this.data.map(item =>
                                {
                                    return {
                                        id: item.id,
                                        projTypeId: item.projTypeId,
                                        scheme: item.scheme,
                                        dangerLevel: item.dangerLevel,
                                        fileIds: item.mediaFiles.map(item => item.id),
                                        demonstration: item.demonstration,
                                        implementation: item.implementation,
                                        riskType: item.riskType ? 2 : 1,
                                        dangerItemIds: item.epicDangerItemIds.join(",")
                                    };
                                }),
                                this.isRisk
                            );
                            this.$message.success("操作成功");
                            this.initData();
                        }
                        catch(err)
                        {
                            this.$message.error("服务器异常");
                            console.error(err);
                        }
                        
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

    /**
     * 诊治详情监听
     * @watch
     */
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
        const res = await this.mainService.query(this.consultId);
        this.data = res.content;

        if (res.content.length === 1)
        {
            this.wtfId = res.content[0].id;
            this.isRisk = res.content[0].isRisk;
            this.data = res.content[0].riskDetails.map(item =>
            {
                return {
                    id: item.id,
                    consultPlanId: res.content.consultPlanId,
                    mediaFiles: item.commonFileList,
                    scheme: Boolean(item.scheme),
                    schemeValue: item.schemeValue,
                    demonstration: Boolean(item.demonstration),
                    demonstrationValue: item.demonstrationValue,
                    implementation: item.implementation,
                    riskType: item.riskType === 2,
                    dangerLevel: item.dangerLevel,
                    dangerLevelName: item.hazardLevelName,
                    projTypeId: item.projTypeId,
                    epicDangerTypeId: item.specialDanger.id,
                    epicDangerTypeName: item.specialDanger.name,
                    epicDangerItemIds: item.specialDangerItems.map(jtem => jtem.id),
                    epicDangerItems: item.specialDangerItems
                };
            });
        }
        else if (res.content.length === 0)
        {
            this.wtfId = -1;
            this.data = [];
        }
        else
        {
            this.wtfId = -1;
            this.data = [];
            console.error("危大工程数据异常");
        }
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
.report-view
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
//             width: 76px;
//             height: 76px;
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