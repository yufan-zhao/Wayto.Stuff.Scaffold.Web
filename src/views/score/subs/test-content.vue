<template>
    <div class="score-sub-view">
        <div class="left">
            <ScoreSpecialSidebar
                :specialIds="currentConsultSpecialIds"
                :specialTypeId="currentConsultSpecialTypeId"
                :specialTreeData="specialTreeData"
                @on-node-change="onNodeChange"
                @on-refresh="initData"
                @on-label-change="onSidebarLabelChange"
            ></ScoreSpecialSidebar>
        </div>
        <div class="right">
            <div class="header">
                <span class="title">{{currentNodeName}}</span>
                <span class="sub-title">{{currentNodeSubName}}</span>
            </div>
            <div class="container" v-if="isShowSpecialDanger">
                <!-- <ScoreSpecialDangers
                    :data="scoreSpecialDangers"
                    :enableEdit="enableDangersEdit"
                    @on-row-save="onRowSave"
                ></ScoreSpecialDangers> -->
                <ScoreSpecialCheck
                    :data="scoreSpecialDangers"
                    :enableEdit="enableDangersEdit"
                    :scoreSpecialNode="currentNodeData"
                    :consultId="consultId"
                    :specialTypeId="currentConsultSpecialTypeId"
                    :logoUrl="logoUrl"
                ></ScoreSpecialCheck>
            </div>
            <div class="container" v-else>
                请选择第三级体系节点
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { View, component, config, watch } from "uxmid-vue-web";
import { ScoreSpecialSidebar, ScoreSpecialDangers, ScoreSpecialCheck } from "../_components";
import { ScoreService, ScoreDangerService } from "src/services";
import { service } from "src/common/decorator";
import { ScoreSpecialNode, ScoreSpecialDanger } from "src/models";

/**
 * 检测内容
 */
@component({
    components:
    {
        ScoreSpecialSidebar,
        ScoreSpecialDangers,
        ScoreSpecialCheck
    }
})
export default class TestContentView extends View
{
    @service("ScoreService")
    private scoreService: ScoreService;

    @service("ScoreDangerService")
    private scoreDangerService: ScoreDangerService;

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

    /**
     * 当前诊治计划包含的体系id列表
     * @property
     */
    protected get currentConsultSpecialIds(): Array<number>
    {
        return this.consultDetail ? this.consultDetail.specialIds.split(",") : [];
    }

    /**
     * 当前诊治计划包含的体系类型id
     * @property
     */
    protected get currentConsultSpecialTypeId(): number
    {
        return this.consultDetail ? this.consultDetail.specialTypeId : undefined;
    }

    /**
     * 当前选中的体系节点名称
     * @property
     */
    protected get currentNodeName(): string
    {
        return this.currentNodeData ? this.currentNodeData.code + " " + this.currentNodeData.name : "-";
    }

    /**
     * 当前选中的体系节点附带信息名称
     * @property
     */
    protected get currentNodeSubName(): string
    {
        let result = "";
        if (this.currentNodeData && typeof this.currentNodeData.deservedScore === "number")
        {
            result += "应得分：" + this.currentNodeData.deservedScore;
        }
        if (result)
        {
            result = "（" + result + "）";
        }
        return result || "";
    }

    protected get logoUrl()
    {
        if (this.consultDetail)
        {
            return "/serverApi" + this.consultDetail.logoUrl;
        }
        return "";
    }

    /**
     * 当前节点下的体系隐患是否能够编辑
     * @property
     */
    protected enableDangersEdit: boolean = true;

    /**
     * 打分体系树节点数据
     * @property
     */
    protected specialTreeData: Array<ScoreSpecialNode> = [];
    
    /**
     * 打分体系树节点数据副本
     * @property
     */
    protected specialTreeDataCopy: Array<ScoreSpecialNode> = [];

    /**
     * 当前选中的体系树节点
     * @property
     */
    protected currentNodeData: ScoreSpecialNode = null;

    /**
     * 是否展示体系隐患
     * @property
     */
    protected isShowSpecialDanger: boolean = false;

    /**
     * 评分体系隐患
     * @property
     */
    protected scoreSpecialDangers: Array<ScoreSpecialDanger> = [];

    /**
     * 评分体系树节点选择事件
     * @protected
     */
    protected async onNodeChange(nodeData: ScoreSpecialNode)
    {
        this.$set(this, "currentNodeData", nodeData);
        if (nodeData && nodeData.level === 3)
        {
            this.isShowSpecialDanger = true;
            this.scoreSpecialDangers = [];
            this.scoreSpecialDangers = await this.scoreDangerService.getTargetScoreDangers(nodeData.id, nodeData.consultId);
        }
        else
        {
            this.isShowSpecialDanger = false;
            this.scoreSpecialDangers = [];
        }
        
        this.onSidebarLabelChange(this.specialTreeDataCopy);
    }

    protected onSidebarLabelChange(sidebarTree: Array<ScoreSpecialNode>)
    {
        this.specialTreeDataCopy = sidebarTree;
        let result = true;

        if (!this.currentNodeData)
        {
            return;
        }

        if (this.currentNodeData.label)
        {
            this.enableDangersEdit = false;
            return;
        }

        if (this.currentNodeData)
        {
            let disableFlag = this.scoreService.checkParentsLabel(sidebarTree, this.currentNodeData);
            if (typeof disableFlag === "boolean")
            {
                result = !disableFlag;
            }
        }

        if (result)
        {
            result = !this.scoreService.checkSelfLabel(sidebarTree, this.currentNodeData);
        }

        this.enableDangersEdit = result;
    }

    /**
     * 隐患行保存事件
     * @protected
     */
    // protected async onRowSave(row: ScoreSpecialDanger, callback: (id: number) => void)
    // {
    //     // 调用评分体系隐患保存接口
    //     try
    //     {
    //         const res = await this.scoreDangerService.addCheckInfo(row, this.currentConsultSpecialTypeId, this.consultId);
    //         callback(res.content.id);
    //         this.$message.success("保存成功");
    //     }
    //     catch(err)
    //     {
    //         this.$message.error(err.msg || err.message);
    //     }
    // }

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

    /**
     * 获取数据
     * @private
     */
    private async initData()
    {
        this.specialTreeData = [];
        this.specialTreeData = await this.scoreService.getScoreSpecialNodeTree(
            this.consultId,
            this.currentConsultSpecialTypeId,
            this.currentConsultSpecialIds
        );
    }
}
</script>

<style lang="less" scoped>
.score-sub-view
{
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 38px;

    .left
    {
        flex: 0 0 auto;
        width: 380px;
        height: calc(100% - 60px);
        padding-left: 30px;
        border-right: 1px solid #E9EBEC;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .right
    {
        width: 100%;
        height: calc(100% - 60px);
        overflow-x: hidden;
        overflow-y: auto;
        padding-bottom: 30px;

        .header
        {
            padding: 0 30px;
            margin-bottom: 20px;

            .title
            {
                font-size: 18px;
                font-weight: bold;
            }
        }
        
        .container
        {
            padding: 0 30px;
        }
    }
}
</style>