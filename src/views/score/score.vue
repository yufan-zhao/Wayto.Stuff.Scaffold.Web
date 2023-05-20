<template>
    <div class="score-view">
        <div class="header">
            <div class="left">
                <span class="title">{{scoreTitle}}</span>
            </div>
            <div class="right">
                <i-button type="primary" :loading="finishBtnLoading" @click="onFinishClick">提交诊治</i-button>
            </div>
        </div>

        <div class="content">
            <i-tabs class="tabs-container" type="card" :animated="false">
                <i-tab-pane v-for="(item, i) in tabs" :key="i" :label="item.label">
                    <component
                        :is="item.component"
                        :consultId="consultId"
                        :consultDetail="consultDetail"
                    ></component>
                </i-tab-pane>
            </i-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { View, component } from "uxmid-vue-web";
import { ApplicationContext } from "src/application";
import { TestContent, Meeting, Progress, Highlights, Performance, Report, Total, ReportDevice, ReportDanger, SafetyKnowledge, SafetyCalendar } from "./subs";
import { ConsultPlanService, ScoreService } from "src/services";
import { service } from "src/common/decorator";

@component({
    components:
    {
        TestContent,
        Meeting,
        "project-progress": Progress,
        Highlights,
        Performance,
        Report,
        Total,
        ReportDevice,
        ReportDanger,
        "safety-knowledge": SafetyKnowledge,
        SafetyCalendar
    }
})
export default class ScoreView extends View
{
    @service("ConsultPlanService")
    private consultPlanService: ConsultPlanService;

    @service("ScoreService")
    private scoreService: ScoreService;

    /**
     * 标签页信息
     * @property
     */
    protected get tabs()
    {
        return [
            {label: "诊治内容", component: "test-content"},
            {label: "宣贯会", component: "meeting"},
            {label: "施工进度", component: "project-progress"},
            {label: "项目亮点", component: "highlights"},
            {label: "履职情况", component: "performance"},
            {label: "现场设备", component: "report-device"},
            {label: "风险概述", component: "report-danger"},
            {label: "危大工程", component: "report"},
            {label: "安全知识", component: "safety-knowledge"},
            {label: "安全日历", component: "safety-calendar"},
            {label: "总评分", component: "total"}
        ];
    }

    /**
     * 评分标题
     * @property
     */
    protected get scoreTitle()
    {
        return this.consultDetail ? this.consultDetail.projectManager.projectName : "-";
    }

    /**
     * 诊治id
     * @property
     */
    protected consultId: number = undefined;

    /**
     * 提交诊治按钮是否加载中
     * @property
     */
    protected finishBtnLoading: boolean = false;

    /**
     * 诊治详情
     * @property
     */
    protected consultDetail: any = null;

    /**
     * 提交诊治事件
     * @protected
     */
    protected async onFinishClick()
    {
        try
        {
            this.finishBtnLoading = true;
            const res = await this.scoreService.finish(this.consultDetail.id, this.consultDetail.specialTypeId);
            this.$message.success("提交成功");
        }
        catch(err)
        {
            this.$message.error(err.msg || err.message);
        }
        finally
        {
            this.finishBtnLoading = false;
        }
    }

    /**
     * vue钩子
     * @created
     */
    protected async created()
    {
        let consultIdStr = ApplicationContext.current.router.currentRoute.query.consultId;
        this.consultId = Number(consultIdStr);
        const consultRes = await this.consultPlanService.detail(this.consultId);
        this.consultDetail = consultRes.content;
    }
}
</script>

<style lang="less" scoped>
.score-view
{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #f6f8fc;

    .header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 0 0 auto;
        width: 100%;
        height: 60px;
        padding: 0 30px;
        background-color: #fff;
        box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.1);

        .left
        {
            .title
            {
                font-size: 18px;
                font-weight: bold;
                color: #182334;
            }
        }
    }

    .content
    {
        flex: 0 0 auto;
        height: 100%;

        .tabs-container
        {
            display: flex;
            flex-direction: column;
            height: 100%;

            @{deep}.ivu-tabs-bar
            {
                margin-bottom: 0;

                .ivu-tabs-nav-container
                {
                    display: flex;
                    align-items: flex-end;
                    height: 54px;
                    padding: 0 20px;

                    .ivu-tabs-nav-wrap
                    {
                        .ivu-tabs-nav-scroll
                        {
                            .ivu-tabs-nav
                            {
                                display: flex;

                                .ivu-tabs-tab
                                {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 38px;
                                    width: 140px;
                                    margin-right: 10px;
                                    border-radius: 4px 4px 0px 0px;
                                    border-bottom: 1px solid #D5DBDE;
                                }
                                .ivu-tabs-tab.ivu-tabs-tab-active
                                {
                                    border-bottom: 1px solid #fff !important;
                                }
                            }
                            
                        }
                    }
                }
            }
            @{deep}.ivu-tabs-content
            {
                overflow: auto;
                height: 100%;
                background-color: #fff;

                .ivu-tabs-tabpane
                {
                    height: 100%;
                }
            }
        }
    }
}
</style>