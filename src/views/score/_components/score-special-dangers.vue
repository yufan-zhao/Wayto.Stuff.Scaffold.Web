<template>
    <div class="score-special-danger-view">
        <i-table
            class="score-special-danger-table"
            :columns="columns"
            :data="dataCopy"
            border
        >
            <template slot-scope="{ row, index }" slot="label">
                <div class="slot-container center">
                    <i-checkbox v-model="row.label" :disabled="!enableEdit" @on-change="onLabelChange(index, arguments)">甩项</i-checkbox>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="danger">
                <div class="slot-container">
                    <i-select v-model="row.dangerLevel" transfer :disabled="!enableEdit" @on-change="onDangerLevelChange(index, arguments)">
                        <i-option v-for="(item, i) in row.dangerLevelOptions" :key="i" :value="item.value">{{item.name}}</i-option>
                    </i-select>
                </div>
            </template>

            <template slot-scope="{ row, index }" slot="desc">
                <div class="slot-container question">
                    <i-input type="textarea" placeholder="请输入" v-model="row.problemDescribe" :disabled="!enableEdit" @on-change="onDescInputChange(index, row.problemDescribe)" :rows="4"></i-input>
                    <ScoreSpecialDangersTip
                        :checkId="row.checkId"
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
                </div>
            </template>
        </i-table>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { ScoreSpecialDanger } from "src/models";
import { CommonFileService } from "src/services";
import { service } from "src/common/decorator";
import ScoreSpecialDangersTip from "./score-special-danger-tip.vue";

@component({
    components:
    {
        ScoreSpecialDangersTip
    }
})
export default class ScoreSpecialDangersView extends View
{
    @service("CommonFileService")
    private commonFileService: CommonFileService;

    /**
     * 传入的隐患数据源
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<ScoreSpecialDanger>;

    /**
     * 是否允许编辑
     * @config
     */
    @config({required: false, type: Boolean, default: true})
    protected enableEdit: boolean;

    /**
     * 表头信息
     * @property
     */
    protected columns: Array<any> =
    [
        {
            title: "内容",
            key: "content"
        },
        {
            title: "甩项",
            slot: "label",
            width: 100,
            align: "center"
        },
        {
            title: "问题隐患等级",
            slot: "danger",
            width: 120,
            align: "center"
        },
        {
            title: "问题描述",
            slot: "desc"
        },
        {
            title: "问题图片/视频",
            slot: "media"
        },
        {
            title: "整改建议",
            slot: "suggest"
        },
        {
            title: "扣分",
            slot: "score",
            width: 100,
            align: "center"
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

    /**
     * data副本
     * @property
     */
    protected dataCopy: Array<ScoreSpecialDanger> = [];

    /**
     * 甩项勾选选择事件
     * @protected
     */
    protected onLabelChange(index: number, args: Array<any>)
    {
        this.$set(this.dataCopy[index], "label", args[0]);
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
     * 问题描述输入框值改变事件
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
     * 隐患描述选择自动填充事件
     * @protected
     */
    protected onDangerTipChange(item: any, rowIndex: number)
    {
        // TODO
        this.$set(this.dataCopy[rowIndex], "deductPoints", item.deduction);
        this.$set(this.dataCopy[rowIndex], "problemDescribe", item.questionDescription);
        this.$set(this.dataCopy[rowIndex], "rectifySuggestion", item.rectifyDescription);
        this.$set(this.dataCopy[rowIndex], "dangerLevel", item.hazardLevel);
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

    /**
     * 行保存事件
     * @protected
     */
    protected onRowSave(row: ScoreSpecialDanger, index: number)
    {
        if (!this.enableEdit)
        {
            return;
        }
        // 抛出这一行保存的事件，交给外部处理提交
        this.$emit("on-row-save", row, this.onRowSaveAfter(index).bind(this));
        // 修改本地的行数据
        // let data = this.dataCopy[index];
        // data.label = row.label;
        // data.dangerLevel = row.dangerLevel;
        // data.problemDescribe = row.problemDescribe;
        // data.rectifySuggestion = row.rectifySuggestion;
        // data.deductPoints = row.deductPoints;
        // this.$set(this.dataCopy, index, data);
        // console.log("WTF", this.dataCopy);
    }

    /**
     * 数据源监听
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<ScoreSpecialDanger>)
    {
        this.dataCopy = JSON.parse(JSON.stringify(val));
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