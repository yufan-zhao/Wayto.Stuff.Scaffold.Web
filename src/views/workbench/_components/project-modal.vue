<template>
    <i-modal
        v-model="isShow"
        :mask-closable="false"
        :mask="false"
        :class-name="'workbench-project-modal'"
        @on-cancel="onCancel"
    >
        <div class="project-modal-content">
            <div class="header">
                {{data.projectName}}
            </div>

            <!-- <div class="tabs">
                <span class="tab-btn" :class="{active: tabIndex === 0}" @click="onTabChange(0)">概述</span>
                <span class="tab-btn" :class="{active: tabIndex === 1}" @click="onTabChange(1)">隐患统计</span>
            </div> -->

            <div class="panel-content">
                <div class="flag-title">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <span class="label">基础信息</span>
                </div>

                <div class="base-info-part">
                    <p class="info-item">项目类型：{{data.projectTypeName}}</p>
                    <p class="info-item">项目地址：{{data.projectAddress}}</p>
                    <p class="info-item">施工单位：{{data.constructionName}}</p>
                    <p class="info-item">监理单位：{{data.responsibleDepName}}</p>
                    <p class="info-item">工机具：{{data.tools}}</p>
                    <p class="info-item">施工人员：{{data.buildUnitCount}}人</p>
                    <p class="info-item">监理人员：{{data.supervisingCount}}人</p>
                </div>

                <div class="flag-title">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <span class="label">诊治统计</span>
                </div>
                <div class="rectify-info-part">
                    <div class="info-item">
                        <p class="upper">{{rectifyData.scheduleCount || 0}}</p>
                        <p class="lower">巡查次数</p>
                    </div>
                    <div class="info-item">
                        <p class="upper">{{rectifyData.total}}</p>
                        <p class="lower">问题总数</p>
                    </div>
                    <div class="info-item">
                        <p class="upper">{{rectifyData.toBeRectified}}</p>
                        <p class="lower">待整改</p>
                    </div>
                    <div class="info-item">
                        <p class="upper">{{rectifyData.closed}}</p>
                        <p class="lower">已闭合</p>
                    </div>
                    <div class="info-item">
                        <p class="upper">{{rectifyData.timeoutClose || 0}}</p>
                        <p class="lower">超时闭合</p>
                    </div>
                </div>

                <div class="flag-title">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <span class="label">隐患统计</span>
                </div>

                <div class="danger-panel-1">
                    <template v-for="(item, i) in dangerList">
                        <div class="label-item" :key="i">
                            <span class="upper l" :style="{color: item.color}">{{item.hazardCount}}</span>
                            <span class="lower">{{item.hazardLevelName}}</span>
                        </div>
                        <span class="split" :key="i + '-split'" v-if="i !== dangerList.length - 1"></span>
                    </template>
                    
                    <!-- <div class="label-item">
                        <span class="upper m">{{dangerData.levelBCount}}</span>
                        <span class="lower">B级</span>
                    </div>
                    <span class="split"></span>
                    <div class="label-item">
                        <span class="upper r">{{dangerData.levelCCount}}</span>
                        <span class="lower">C级</span>
                    </div> -->
                </div>
            </div>

            <!-- <div class="panel-content" v-if="tabIndex === 1">
                <div class="danger-panel-1">
                    <div class="label-item">
                        <span class="upper l">3</span>
                        <span class="lower">A级</span>
                    </div>
                    <span class="split"></span>
                    <div class="label-item">
                        <span class="upper m">17</span>
                        <span class="lower">B级</span>
                    </div>
                    <span class="split"></span>
                    <div class="label-item">
                        <span class="upper r">3</span>
                        <span class="lower">C级</span>
                    </div>
                </div>
            </div> -->
        </div>
    </i-modal>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { service } from "src/common/decorator";
import { ProjectService, HiddenService } from "src/services";

@component
export default class ProjectModal extends CommonView
{
    @service("ProjectService")
    private projectService: ProjectService;

    @service("HiddenService")
    private hiddenService: HiddenService;

    protected data: any = {};

    protected rectifyData: any = {};

    protected dangerData: any = {};

    protected dangerList: Array<any> = [];

    protected isShow = false;

    protected tabIndex = 0;

    public open(data: any)
    {
        this.tabIndex = 0;
        this.isShow = true;

        this.$set(this.data, "id", data.id);
        this.$set(this.data, "projectName", data.projectName);

        this.initData();
    }

    protected onCancel()
    {
        this.isShow = false;
        setTimeout(() =>
        {
            this.$set(this.data, "projectName", "-");
            this.$set(this.data, "id", undefined);
            this.$set(this.data, "projectAddress", "-");
            this.$set(this.data, "projectTypeName", "-");
            this.$set(this.data, "constructionName", "-");
            this.$set(this.data, "responsibleDepName", "-");
            this.$set(this.data, "buildUnitCount", "-");
            this.$set(this.data, "supervisingCount", "-");
            this.$set(this.data, "tools", "-");

            this.$set(this.rectifyData, "total", "-");
            this.$set(this.rectifyData, "closed", "-");
            this.$set(this.rectifyData, "toBeRectified", "-");
            this.$set(this.rectifyData, "scheduleCount", "-");
            this.$set(this.rectifyData, "timeoutClose", "-");

            this.$set(this.dangerData, "levelACount", "-");
            this.$set(this.dangerData, "levelBCount", "-");
            this.$set(this.dangerData, "levelCCount", "-");
        }, 500);
        
    }

    protected onTabChange(i: number)
    {
        this.tabIndex = i;
    }

    private async initData()
    {
        this.dangerList.splice(0);
        let resList = await Promise.all([
            this.projectService.detail({params: {id: this.data.id}}),
            this.hiddenService.getDangerStatsBy({projectId: this.data.id})
        ]);
        let projectRes = resList[0];
        let hiddenRes = resList[1];
        let constructionName = "-";
        let tools = "-";
        if (Array.isArray(projectRes.content.construction) && projectRes.content.construction.length > 0)
        {
            constructionName = projectRes.content.construction[0].constructionName;
        }
        if (Array.isArray(projectRes.content.tools))
        {
            let target = projectRes.content.tools.map(item =>
            {
                return `${item.toolsName}（${item.toolsAmount}）`;
            });
            tools = target.join("/");
        }
        this.$set(this.data, "projectAddress", projectRes.content.projectAddress);
        this.$set(this.data, "projectTypeName", projectRes.content.projectTypeName);
        this.$set(this.data, "constructionName", constructionName);
        this.$set(this.data, "responsibleDepName", projectRes.content.responsibleDepName);
        this.$set(this.data, "buildUnitCount", projectRes.content.buildUnit ? projectRes.content.buildUnit.length : 0);
        this.$set(this.data, "supervisingCount", projectRes.content.supervising.length);
        this.$set(this.data, "tools", tools);

        if (projectRes.content.hazard)
        {
            let item = projectRes.content.hazard;
            
            this.$set(this.rectifyData, "total", item.total);
            this.$set(this.rectifyData, "closed", item.closed);
            this.$set(this.rectifyData, "toBeRectified", item.toBeRectified);
            this.$set(this.rectifyData, "timeoutClose", item.timeoutClose);
            if (Array.isArray(projectRes.content.scheduleList))
            {
                this.$set(this.rectifyData, "scheduleCount", projectRes.content.scheduleList.length);
            }
        }
        
        if (hiddenRes.hazardSumList.length > 0)
        {
            this.$set(this.dangerData, "levelACount", hiddenRes.hazardSumList[0].hazardCount);
            this.$set(this.dangerData, "levelBCount", hiddenRes.hazardSumList[1].hazardCount);
            this.$set(this.dangerData, "levelCCount", hiddenRes.hazardSumList[2].hazardCount);
            this.dangerList.push(...hiddenRes.hazardSumList);
        }
    }
}
</script>

<style lang="less">
.workbench-project-modal
{
    transform: translateX(91px);

    .ivu-modal-footer
    {
        display: none;
        height: 0;
    }
    .ivu-modal-body
    {
        padding: 30px;
    }

    .project-modal-content
    {
        .header
        {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .tabs
        {
            display: flex;
            margin-bottom: 20px;

            .tab-btn
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                width: 84px;
                border: 1px solid #525A65;
                color: #525A65;
                cursor: pointer;
            }
            .tab-btn:hover
            {
                z-index: 1;
                border-color: #4B7EFE;
                color: #4B7EFE;
            }
            .tab-btn.active
            {
                z-index: 1;
                border-color: #4B7EFE;
                color: #4B7EFE;
            }
            .tab-btn:nth-child(1)
            {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            .tab-btn:nth-child(2)
            {
                transform: translateX(-1px);
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }

        .panel-content
        {
            .flag-title
            {
                .statis-item-icon
                {
                    height: 14px;
                    width: 14px;
                    margin-right: 8px;
                    transform: translateY(2px);
                }
                .label
                {
                    font-size: 14px;
                    font-weight: bold;
                }
            }
        }

        .base-info-part
        {
            padding-left: 22px;
            margin-bottom: 30px;
            margin-top: 10px;

            .info-item
            {
                color: #5D6673;
                padding: 3px 0;
            }
        }
        .rectify-info-part
        {
            display: flex;
            padding-left: 20px;
            margin-top: 10px;
            margin-bottom: 30px;

            .info-item
            {
                display: flex;
                flex-direction: column;
                margin-right: 35px;

                .upper
                {
                    display: flex;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: bold;
                }
                .lower
                {
                    color: #838D9C;
                }
            }
        }

        .danger-panel-1
        {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 10px;
            width: 100%;
            height: 84px;
            background-color: #FBFCFE;
            border: 1px solid #E9EDF2;
            border-radius: 4px;

            .split
            {
                width: 1px;
                height: 40px;
                background-color: #DADFE6;
            }
            .label-item
            {
                display: flex;
                flex-direction: column;

                .upper
                {
                    display: flex;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 500;
                }
                .upper.l
                {
                    color: #FF4D3F;
                }
                .upper.m
                {
                    color: #FF9832;
                }
                .upper.r
                {
                    color: #A533F4;
                }
                .lower
                {
                    color: #838D9C;
                }
            }
        }
    }
}
</style>