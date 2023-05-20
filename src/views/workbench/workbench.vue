<template>
    <div class="workbench-view">

        <amap ref="amap"
            :mapStyle="applicationContext.settings.amapSettings.style"
            :center="mapCenter"
            :zoom="13"
        >
            <amap-marker
                v-for="(item, i) in projectMapList.projectList"
                :key="'marker-' + i"
                :position="[item.longitude,item.latitude]"
                :title="item.projectName"
                :zIndex="currentItemIndex === i ? 130 : 100"
            >
                <ProjectMarker :data="item" :itemIndex="i" @on-select="onMarkerSelect" :color="getMarkerColor(projectMapList.colorList, item.score)" @on-hover="onHover"></ProjectMarker>
            </amap-marker>
        </amap>

        <div class="panel-container">
            
            <WorkbenchPanelContainer
                :width="40"
                :height="40"
                :top="15"
                :left="30"
                square
            >
                <div class="panel-switch-btn" @click="onZoomClick">
                    <img src="src/assets/zoom.png" v-if="!isPanelZoom" />
                    <img src="src/assets/zoom-collapse.png" v-else />
                </div>
            </WorkbenchPanelContainer>

            <WorkbenchPanelContainer
                :width="200"
                :height="40"
                :top="15"
                :left="90"
                square
            >
                <i-select class="panel-customer-select" v-model="selectedCustomerId" @on-change="onCustomerChange">
                    <i-option v-for="(item, i) in customerList" :key="i" :value="item.id">{{item.deptName}}</i-option>
                </i-select>
            </WorkbenchPanelContainer>
            
            <WorkbenchPanelContainer
                :width="388"
                :height="310"
                :top="75"
                :left="30"
                :hide="isPanelZoom"
            >
                <div class="panel-slot-container">
                    <ProjectTypePanel
                        :customerId="selectedCustomerId"
                    ></ProjectTypePanel>
                </div>
            </WorkbenchPanelContainer>

            <WorkbenchPanelContainer
                :width="388"
                :height="310"
                :top="400"
                :left="30"
                :hide="isPanelZoom"
            >
                <div class="panel-slot-container">
                    <ProjectRectifyPanel
                        :customerId="selectedCustomerId"
                    ></ProjectRectifyPanel>
                </div>
            </WorkbenchPanelContainer>

            <WorkbenchPanelContainer
                :width="388"
                :height="310"
                :top="725"
                :left="30"
                :hide="isPanelZoom"
            >
                <div class="panel-slot-container">
                    <ProjectDangerPanel
                        :customerId="selectedCustomerId"
                    ></ProjectDangerPanel>
                </div>
            </WorkbenchPanelContainer>

            <WorkbenchPanelContainer
                :width="388"
                :height="960"
                :top="75"
                :right="30"
                :hide="isPanelZoom"
            >
                <RightPanelV2
                    :customerId="selectedCustomerId"
                    :colorList="projectMapList.colorList"
                    :getMarkerColor="getMarkerColor"
                ></RightPanelV2>
            </WorkbenchPanelContainer>
        </div>

        <ProjectModal ref="projectModal"></ProjectModal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService, CustomerService } from "src/services";
import { service } from "src/common/decorator";
import { WorkbenchPanelContainer, RightPanel, ProjectMarker, ProjectTypePanel, ProjectRectifyPanel, ProjectDangerPanel, ProjectModal, RightPanelV2 } from "./_components";

@component({
    components:
    {
        WorkbenchPanelContainer,
        RightPanel,
        RightPanelV2,
        ProjectMarker,
        ProjectTypePanel,
        ProjectRectifyPanel,
        ProjectDangerPanel,
        ProjectModal
    }
})
export default class WorkbenchView extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    @service("CustomerService")
    protected customerService: CustomerService;
    
    protected mapCenter: Array<number> = [113.90735, 22.538335];

    /**
     * 客户列表
     * @property
     */
    protected customerList: Array<any> = [];

    /**
     * 当前悬浮marker索引
     * @property
     */
    protected currentItemIndex: number = -1;

    /**
     * 选中的客户
     * @property
     */
    protected selectedCustomerId: number = null;
    
    /**
     * 面板是否隐藏标识
     * @property
     */
    protected isPanelZoom: boolean = false;

    /**
     * 地图marker列表
     * @property
     */
    protected projectMapList = [];

    /**
     * 缩放按钮点击事件
     * @protected
     */
    protected onZoomClick()
    {
        this.isPanelZoom = !this.isPanelZoom;
    }

    protected onMarkerSelect(data: any)
    {
        this._projectModal.open(data);
    }

    protected onCustomerChange(customerId: number)
    {
        this.selectedCustomerId = customerId;
        this.getProjectMapList();
    }

    /**
     * i - 索引
     * trigger - 悬浮标识
     */
    protected onHover(i: number, trigger: boolean)
    {
        if (trigger)
        {
            this.currentItemIndex = i;
        }
        else
        {
            this.currentItemIndex = -1;
        }
    }

    protected getMarkerColor(colorList: Array<any>, score: number): string
    {
        let index = -1;
        for (let i = 0; i < colorList.length; i++)
        {
            let item = colorList[i];
            let scoreMinValue = item.scoreMinValue;
            let scoreMaxValue = item.scoreMaxValue;
            if (typeof scoreMinValue === "number" && typeof scoreMaxValue === "number" && scoreMinValue < scoreMaxValue)
            {
                if (scoreMinValue === 0)
                {
                    if (score >= scoreMinValue && score < scoreMaxValue)
                    {
                        index = i;
                        break;
                    }
                }
                if (scoreMaxValue === 100)
                {
                    if (score >= scoreMinValue && score <= scoreMaxValue)
                    {
                        index = i;
                        break;
                    }
                }
                if (score >= scoreMinValue && score < scoreMaxValue)
                {
                    index = i;
                    break;
                }
            }
        }
        if (index >= 0)
        {
            return colorList[index].colorStr;
        }
        else
        {
            return "";
        }
    }

    protected created()
    {
        this.initData();
    }
    
    private async initData()
    {
        const res = await this.customerService.list();
        this.customerList = res.content;
        this.selectedCustomerId = this.customerList[0].id;

        this.getProjectMapList();
    }

    /**
     * 地图marker数据获取
     */
    private async getProjectMapList()
    {
        let content = await this.workbenchService.getProjectMapList(this.selectedCustomerId);
        this.projectMapList = content;
        this.mapCenter = [content.projectList[0].longitude, content.projectList[0].latitude];
        // content.projectList
        // this.delIcon(content.projectList)

    }

    private get _projectModal(): ProjectModal
    {
        return this.$refs["projectModal"] as ProjectModal;
    }
}
</script>

<style lang="less" scoped>
.workbench-view
{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .panel-container
    {
        position: absolute;
        width: 0;
        height: 0;
        top: 0;
        left: 0;
    }
}

.panel-switch-btn
{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.06);
    cursor: pointer;
}
.panel-slot-container
{
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.06);
    border-radius: 4px;
}
.panel-customer-select
{
    height: 100%;

    @{deep}.ivu-select-selection
    {
        height: 100%;

        .ivu-select-placeholder
        {
            line-height: 40px;
        }
        .ivu-select-selected-value
        {
            line-height: 40px;
        }
    }
}
</style>