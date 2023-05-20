<template>
    <div class="">
        <i-table
            v-if="dataCopy.length > 0"
            class="score-special-danger-table"
            :data="dataCopy"
            :columns="columns"
            border
        >
            <template slot-scope="{ row, index }" slot="danger">
                <div class="slot-container">
                    <i-select v-model="row.dangerLevel" transfer :disabled="!enableEdit" @on-change="onDangerLevelChange(index, arguments)">
                        <i-option v-for="(item, i) in dangerLevelOptions" :key="i" :value="item.value">{{item.name}}</i-option>
                    </i-select>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="desc">
                <div class="slot-container question">
                    <i-input type="textarea" placeholder="请输入" v-model="row.problemDescribe" :disabled="!enableEdit" @on-change="onDescInputChange(index, row.problemDescribe)" :rows="4"></i-input>
                    <ScoreSpecialDangersTip
                        :checkId="checkId"
                        :rowIndex="index"
                        @on-change="onDangerTipChange"
                    ></ScoreSpecialDangersTip>
                </div>
            </template>

            <!-- 视频图片 -->
            <template slot-scope="{ row, index }" slot="media">
                <div class="slot-container">
                    <ux-image-upload
                        v-model="row.mediaFiles"
                        :uploadSingleFunction="commonFileService.uploadBlobSingle.bind(commonFileService)"
                        :uploadFunction="commonFileService.upload.bind(commonFileService)"
                        :payload="consultDetail"
                        :watermarkLogoUrl="logoUrl"
                        @on-change="onMediaFilesChange(index, arguments)"
                    ></ux-image-upload>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="suggest">
                <div class="slot-container">
                    <i-input type="textarea" placeholder="请输入" v-model="row.rectifySuggestion" :disabled="!enableEdit" @on-change="onSuggestInputChange(index, row.rectifySuggestion)" :rows="4"></i-input>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="score">
                <div class="slot-container">
                    <i-input type="number" placeholder="请输入" v-model="row.deductPoints" :disabled="!enableEdit" @on-change="onDeductInputChange(index, row.deductPoints)"></i-input>分
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="time">
                <div class="slot-container">
                    <i-select placeholder="请选择" transfer :disabled="!enableEdit" v-model="row.rectifyDay" @on-change="onTimeChange(index, arguments)">
                        <i-option :value="1">1天</i-option>
                        <i-option :value="3">3天</i-option>
                        <i-option :value="5">5天</i-option>
                        <i-option :value="7">7天</i-option>
                        <i-option :value="15">半个月</i-option>
                        <i-option :value="30">1个月</i-option>
                    </i-select>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="action">
                <div class="slot-container center ops">
                    <span class="ops-btn" :class="{disabled: !enableEdit}" @click="onRowSave(row, index)">保存</span>
                    <span class="ops-btn" :class="{disabled: !enableEdit}" @click="onRowDelete(row, index)">删除</span>
                </div>
            </template>
        </i-table>
        <span v-else>暂无数据</span>

        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
    
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { CommonFileService, ScoreDangerService, ConsultPlanService } from "src/services";
import { service } from "src/common/decorator";
import CommonView from "src/views/common-view";
import ScoreSpecialDangersTip from "./score-special-danger-tip.vue";

@component({
    components:
    {
        ScoreSpecialDangersTip
    }
})
export default class ScoreSpecialCheckDanger extends CommonView
{
    @service("CommonFileService")
    private commonFileService: CommonFileService;

    @service("ScoreDangerService")
    private scoreDangerService: ScoreDangerService;

    @service("ConsultPlanService")
    private consultPlanService: ConsultPlanService;

    /**
     * 是否允许编辑
     * @config
     */
    @config({required: false, type: Boolean, default: true})
    protected enableEdit: boolean;

    @config({required: false, type: Array, default: () => []})
    protected dangerLevelOptions: Array<any>;

    @config({required: false})
    protected scoreSpecialNode: any;

    @config({required: false})
    protected checkId: number;

    @config({required: false})
    protected consultId: number;

    @config({required: false})
    protected scoreSpecialId: number;

    @config({required: false})
    protected checkDetail: any;

    @config({required: true})
    protected index: number;

    @config({required: false, default: ""})
    protected logoUrl: string;

    protected consultDetail: any = null;

    protected dataCopy = [];

    protected columns =
    [
        {
            title: "问题描述",
            slot: "desc"
        },
        {
            title: "问题描述等级",
            slot: "danger",
            width: 120,
            align: "center"
        },
        {
            title: "扣分",
            slot: "score",
            width: 100,
            align: "center"
        },
        {
            title: "整改建议",
            slot: "suggest"
        },
        {
            title: "问题描述图片/视频",
            slot: "media"
        },
        {
            title: "整改时间",
            slot: "time",
            width: 120
        },
        {
            title: "操作",
            slot: "action",
            width: 150,
            align: "center"
        }
    ];

    public addRow()
    {
        this.dataCopy.push({
            rectifyDay: undefined,
            dangerLevel: undefined,
            problemDescribe: "",
            mediaFiles: [],
            rectifySuggestion: "",
            deductPoints: undefined
        });
    }

    public refresh()
    {
        this.initData();
    }

    /**
     * 隐患等级选择事件
     * @protected
     */
    protected onDangerLevelChange(index: number, args: Array<any>)
    {
        this.$set(this.dataCopy[index], "dangerLevel", args[0]);
    }

    /**
     * 隐患描述输入框值改变事件
     * @protected
     */
    protected onDescInputChange(index: number, value: string)
    {
        this.$set(this.dataCopy[index], "problemDescribe", value);
    }

    /**
     * 媒体文件变化事件
     * @protected
     */
    protected onMediaFilesChange(index: number, args: Array<any>)
    {
        this.$set(this.dataCopy[index], "mediaFiles", args[0]);
    }

    /**
     * 整改建议输入框值改变事件
     * @protected
     */
    protected onSuggestInputChange(index: number, value: string)
    {
        this.$set(this.dataCopy[index], "rectifySuggestion", value);
    }

    /**
     * 扣分输入框值改变事件
     * @protected
     */
    protected onDeductInputChange(index: number, value: string)
    {
        this.$set(this.dataCopy[index], "deductPoints", value);
    }

    /**
     * 整改时间输入值改变事件
     * @protected
     */
    protected onTimeChange(index: number, args: Array<any>)
    {
        this.$set(this.dataCopy[index], "rectifyDay", args[0]);
    }

    /**
     * 问题描述选择自动填充事件
     * @protected
     */
    protected onDangerTipChange(item: any, rowIndex: number)
    {
        this.$set(this.dataCopy[rowIndex], "deductPoints", item.deduction);
        this.$set(this.dataCopy[rowIndex], "problemDescribe", item.questionDescription);
        this.$set(this.dataCopy[rowIndex], "rectifySuggestion", item.rectifyDescription);
        this.$set(this.dataCopy[rowIndex], "dangerLevel", item.hazardLevel);
        this.$set(this.dataCopy[rowIndex], "rectifyDay", item.checkDay);
    }

    /**
     * 行保存回调事件
     * @protected
     */
    protected onRowSaveAfter(index: number)
    {
        let _this = this;
        return function(id: number)
        {
            _this.$set(_this.dataCopy[index], "id", id);
        };
    }

    protected onRowDelete(row: any, index: number)
    {
        if (row.id)
        {
            this._warningModal.open({
                title: "提示",
                content: "是否删除该项？",
                onOk: async () =>
                {
                    try
                    {
                        await this.scoreDangerService.deleteTargetScoreCheckDanger(row.id);
                        this.dataCopy.splice(index, 1);
                        this.$message.success("删除成功");
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
        else
        {
            this.dataCopy.splice(index, 1);
        }
    }

    /**
     * 行保存事件
     * @protected
     */
    protected onRowSave(row: any, index: number)
    {
        if (!this.enableEdit)
        {
            return;
        }
        // 抛出这一行保存的事件，交给外部处理提交
        // console.log("检查项", this.checkDetail);
        this.$emit("on-row-save", row, this.checkDetail.id, this.checkDetail.scoreSpecialId, this.onRowSaveAfter(index).bind(this));
    }

    protected created()
    {
        this.initData();
    }

    private async initData()
    {
        const res = await this.scoreDangerService.getTargetScoreCheckDangers(this.checkDetail.id, this.checkDetail.scoreSpecialId, this.consultId);
        this.dataCopy = res;

        if (res.length > 0)
        {
            let opUsers = [];
            res.forEach(item =>
            {
                opUsers.push(item.opUser);
            });
            let opUsersSet = new Set(opUsers);
            let singleOpUsers = Array.from(opUsersSet);
            let payload =
            {
                opUser: singleOpUsers.join("/"),
                deductPoints: res.reduce((pre, cur) =>
                {
                    pre += (cur.deductPoints || 0);
                    return pre;
                }, 0),
                index: this.index,
                nodeId: this.scoreSpecialNode.id
            };
            // 通知上级组件最近更新人
            this.applicationContext.eventProvider.dispatchEvent("score-last-opUser", payload);
        }

        const consultDetailRes = await this.consultPlanService.detail(this.consultId);
        this.consultDetail = consultDetailRes.content;
    }

    /**
     * 警告弹层
     * @private
     * @ref
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.score-special-danger-table
{
    @{deep}.ivu-table-tbody
    {
        tr
        {
            td
            {
                .ivu-table-cell
                {
                    display: flex;
                    align-items: center;
                    height: 100%;

                    .ivu-table-cell-slot
                    {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
@{deep}.slot-container
{
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 5px 0;
    text-align: left;
}
@{deep}.slot-container.question
{
    position: relative;

    .ivu-poptip
    {
        height: 100%;

        .ivu-poptip-rel
        {
            height: 100%;
        }
    }
}
@{deep}.slot-container.center
{
    justify-content: center;
}
@{deep}.slot-container.ops
{
    .ops-btn
    {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 76px;
        height: 32px;
        margin-right: 5px;
        border: 1px solid #3375F4;
        color: #3375F4;
        cursor: pointer;
    }
    .ops-btn:hover
    {
        border-color: darken(#3375F4, 20%);
        color: darken(#3375F4, 20%);
    }
    .ops-btn.disabled
    {
        color: #ccc;
        border-color: #ccc;
        background-color:#f3f3f3;
    }
}
</style>