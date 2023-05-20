<template>
    <div class="score-special-check-view">
        <i-collapse class="check-collapse">
            <i-panel
                v-for="(item, i) in dataCopy"
                :key="i"
                :name="String(item.id)"
            >
                <div class="check-header">
                    <div class="left">
                        <span>
                            <span v-if="item.tag" class="tag">重</span>
                            {{item.content}}
                            <span class="extra-tag">{{getExtraInfo(i, item)}}</span>
                        </span>
                    </div>
                    <div class="right">
                        <span class="btn" @click.stop="onAddDanger(item, i)">添加隐患</span>
                        <!-- <span class="btn">保存</span> -->
                    </div>
                </div>
                <div slot="content">
                    <ScoreSpecialCheckDanger
                        :ref="'checkDanger-' + i"
                        :index="i"
                        :checkDetail="item"
                        :enableEdit="enableEdit"
                        :dangerLevelOptions="item.dangerLevelOptions"
                        :scoreSpecialNode="scoreSpecialNode"
                        :checkId="item.id"
                        :consultId="consultId"
                        :scoreSpecialId="item.scoreSpecialId"
                        :logoUrl="logoUrl"
                        @on-row-save="onRowSave"
                    ></ScoreSpecialCheckDanger>
                </div>
            </i-panel>
        </i-collapse>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import ScoreSpecialCheckDanger from "./score-special-check-danger.vue";
import { ScoreDangerService } from "src/services";
import { service } from "src/common/decorator";

@component({
    components:
    {
        ScoreSpecialCheckDanger
    }
})
export default class ScoreSpecialCheck extends CommonView
{
    @service("ScoreDangerService")
    private scoreDangerService: ScoreDangerService;

    /**
     * 传入的隐患数据源
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected data: Array<any>;

    /**
     * 是否允许编辑
     * @config
     */
    @config({required: false, type: Boolean, default: true})
    protected enableEdit: boolean;

    @config({required: false})
    protected scoreSpecialNode: any;

    @config({required: false})
    protected consultId: number;

    @config({required: false})
    protected specialTypeId: number;

    @config({required: false, default: ""})
    protected logoUrl: string;

    /**
     * data副本
     * @property
     */
    protected dataCopy: Array<any> = [];

    /**
     * 最近一次操作人信息列表
     */
    protected opUserList = [];

    protected onAddDanger(item, i)
    {
        // TODO
        (this.$refs[`checkDanger-${i}`] as any)[0].addRow();
    }

    /**
     * 隐患行保存事件
     * @protected
     */
    protected async onRowSave(row: any, checkId: number, scoreSpecialId: number, callback: (id: number) => void)
    {
        // 调用评分体系隐患保存接口
        try
        {
            const res = await this.scoreDangerService.addCheckInfo(row, this.specialTypeId, this.consultId, checkId, scoreSpecialId);
            callback(res.content.id);
            this.$message.success("保存成功");
        }
        catch(err)
        {
            this.$message.error(err.msg || err.message);
        }
    }

    protected getExtraInfo(i: number, item: any)
    {
        let target = this.opUserList[i];
        return target ? target : "";
    }

    protected resolveOpUser(payloadContainer: any)
    {
        let payload = payloadContainer.data;
        if (payload.nodeId === this.scoreSpecialNode.id)
        {
            this.$set(this.opUserList, payload.index, payload.opUser + " / " + payload.deductPoints + "分");
        }
    }

    /**
     * 数据源监听
     * @watcher
     */
    @watch("data", {immediate: true})
    protected dataWatcher(val: Array<any>)
    {
        this.dataCopy = JSON.parse(JSON.stringify(val));
        this.opUserList = [];
    }

    protected created()
    {
        this.applicationContext.eventProvider.addListener("score-last-opUser", this.resolveOpUser);
    }

    protected beforeDestroy()
    {
        this.applicationContext.eventProvider.removeListener("score-last-opUser", this.resolveOpUser);
    }
}
</script>

<style lang="less" scoped>
.score-special-check-view
{
    .check-collapse.ivu-collapse
    {
        .ivu-collapse-item
        {
            @{deep}.ivu-collapse-header
            {
                position: relative;

                .check-header
                {
                    position: absolute;
                    left: 44px;
                    top: 0;
                    display: flex;
                    width: calc(100% - 44px);
                    justify-content: space-between;
                    
                    .left
                    {
                        .tag
                        {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            border: 1px solid #FC532E;
                            border-radius: 2px;
                            font-size: 12px;
                            color: #FC532E;
                            text-align: center;
                            line-height: 17px;
                        }
                        .extra-tag
                        {
                            font-size: 12px;
                            color: #fe4529;
                            padding-left: 2px;
                        }
                    }
                    .right
                    {
                        padding-right: 30px;

                        .btn
                        {
                            border: 1px solid #5775f5;
                            color: #5775f5;
                            background-color: #fff;
                            border-radius: 4px;
                            padding: 0 4px;
                            margin-left: 5px;
                            white-space: nowrap;
                            cursor: pointer;
                        }
                        .btn:hover
                        {
                            color: #fff;
                            background-color: #5775f5;
                        }
                    }
                }
            }
        }
    }
}
</style>