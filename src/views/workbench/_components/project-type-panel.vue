<template>
    <div class="project-type-panel common-panel">
        <div class="header">
            <span class="title">
                <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                <span class="label">项目类型</span>
            </span>
            <div class="extra">
                <ux-tab-btns
                    :data="btnLabels"
                    @on-change="onTabChange"
                ></ux-tab-btns>
            </div>
        </div>

        <div class="content">
            <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="projectTypeGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class ProjectTypePanel extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    @config({required: false})
    protected customerId: number;

    protected btnLabels = ["全部", "工作中", "已完结"];

    protected projectTypeSun = 0;

    protected showTypeProject: number = 2; // 项目类型状态 

    // protected projectTypeData: Array<any> = [{value: 15, name: "市政",ename: "市政"},{value: 15, name: "消防",ename: "消防"}];
    protected projectTypeData = [];

    protected  filters: any =
    {
        projectType:
        {
            status: this.showTypeProject,
            constructionId: null,
            customerId: null
        }
    };

    protected get projectTypeGraphic(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  this.projectTypeSun,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "53%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "项目总数",
                    font: " 14px Microsoft YaHei"
                }
            }
        ];
    }

    protected onTabChange(i: number)
    {
        if (i === 0)
        {
            this.changeTabs(2, "showTypeProject");
        }
        else if (i === 1)
        {
            this.changeTabs(0, "showTypeProject");
        }
        else
        {
            this.changeTabs(1, "showTypeProject");
        }
    }

    protected changeTabs(num,name)
    {
        this[name] = num;

        switch (name) {
            case "showTypeProject":
                this.filters.projectType.status = num;
                this.getProjectTypeStatisticsList();
                break;
            default:
                break;
        }
    }

    @watch("customerId", {immediate: false})
    protected customerIdWatcher(val: number | undefined)
    {
        this.getProjectTypeStatisticsList();
    }

    // 项目类型
    protected async getProjectTypeStatisticsList()
    {
        // console.log("???", this.customerId);
        if (typeof this.customerId !== "number")
        {
            return;
        }
        this.projectTypeData = [];
        let content = await this.workbenchService.getProjectTypeStatisticsList({
            status: this.filters.projectType.status,
            customerId: this.customerId
        });
        this.projectTypeSun = content[0].projectSum || 0;
        if (this.projectTypeSun > 0)
        {
            content.forEach(ele =>
            {
                this.projectTypeData.push({value: ele.projectCount, name: ele.projectTypeName,ename: ele.projectTypeName});
            });
        }
    }
}
</script>

<style lang="less" scoped>
.common-panel
{
    display: flex;
    flex-direction: column;

    .header
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 53px;
        padding-left: 17px;
        padding-right: 22px;
        border-bottom: 1px solid #E7E8EC;

        .title
        {
            .statis-item-icon
            {
                height: 16px;
                width: 16px;
                margin-right: 8px;
                transform: translateY(2px);
            }
            .label
            {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    .content
    {

    }
}
</style>