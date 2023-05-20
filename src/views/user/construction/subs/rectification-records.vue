<template>
    <div class="sub-detail">
        <div class="header d-f">
            <div class="time">
                <span>选择时间：</span>
                <div class="select-width">
                    <i-date-picker v-model="date" type="daterange" @on-change="changeDate" split-panels placeholder="请选择" style="width: 200px"  clearable></i-date-picker>
                </div>
            </div> 
            <div class="project d-f"> 
                <span class="project-span">项目：</span>
                <i-select class="project-select-width d-i"  v-model="showTableId"  @on-change="changeDate" clearable width="200">
                    <option v-for="item in protectedList" :key="item.id" :value="item.id">{{item.projectName}}</option>
                </i-select>
            </div>
        </div>

        <section class="statistics-info mb20 ml20">
            <div class="statistics-item">
                <p class="statistics-num">
                    {{ dataStat.dzgsum }}
                    <span class="font-400">
                        (<template  v-for="(item,i) in dataStat.dzg">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dataStat.dzg.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                        </span>
                    </p>
                <p  class="statistics-name">待整改</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num">
                     {{ dataStat.dzgbhsum }}
                    <span class="font-400">
                        (<template  v-for="(item,i) in dataStat.dzgbh">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dataStat.dzgbh.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                        
                    </span>
                </p>
                <p  class="statistics-name">待闭合</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num">
                    {{ dataStat.ybhsum }}
                    <span class="font-400">
                        (<template  v-for="(item,i) in dataStat.ybh">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dataStat.ybh.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                        
                    </span>
                </p>
                <p  class="statistics-name">已闭合</p>
            </div>

            <div class="statistics-item" v-for="(item,i) in dataStat.dj" :key="i+'d'">
                <p :class="`statistics-num`" :style="{color: item.color}">{{item.hazardCount}}</p>
                <p  class="statistics-name">{{item.hazardLevelName}}</p>
            </div>
            <!-- <div class="statistics-item"><p class="statistics-num statistics-num-1">2</p><p  class="statistics-name">二级</p></div> -->
            <!-- <div class="statistics-item"><p class="statistics-num statistics-num-0">2</p><p  class="statistics-name">三级</p></div> -->
        </section>

        <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table>

    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { ConstructService, ProjectService } from "src/services";
import { service } from "src/common/decorator";
@component
export default class InfoView extends View
{
    @service("ConstructService")
    protected constructService: ConstructService;

    @service("ProjectService")
    protected projectService: ProjectService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected showTable = false;

    protected date = null;

    protected showTableId = 0;

    protected data: any = [];
    protected protectedList: any = [];
    protected dataStat: any = {};

    protected columuns2: Array<any> =
    [
        {
            title: "编号",
            minWidth: 120,
            render: (h, {row}: any) =>
            {
                return h("div", row.consult_num || "-");
            }
        },
        {
            title: "项目名称",
            minWidth: 120,
            render: (h, {row}: any) =>
            {
                return h("div", row.project_name || "-");
            }
        },
        {
            title: "问题隐患等级",
            minWidth: 100,
            render: (h, {row}: any) =>
            {
                                // A           B       C 
                let colors = ["#FF4D3F", "#FF9832", "#A533F4"];
                return h("div",{class: "statistics-num statistics-num-1"}, row.type_number);
            }
        },
        {
            title: "状态",
            minWidth: 70,
            render: (h, {row}: any) =>
            {
                return h("div", row.mend_status || "-");
            }
        },
        {
            title: "通知整改时间",
            minWidth: 140,
            render: (h, {row}: any) =>
            {
                return h("div", row.mend_time || "-");
            }
        },
        {
            title: "整改提交时间",
            minWidth: 140,
            render: (h, {row}: any) =>
            {
                return h("div", row.create_time || "-");
            }
        },
        {
            title: "操作",
            render: (h, {row}: any) =>
            {
                return h("div",
                {
                    class: "font-main",
                    on:
                    {
                        click:  () =>
                        {
                            this.toProject(row.projectId);
                        }
                    }},"查看");
            }
        }
    ];

    @watch("detail",{immediate: true})
    protected onChange(value)
    {
        this.getPublicity();
        this.getCorrectionRecordTj();
    }

    protected async getPublicity()
    {
        this.data = await this.constructService.getCorrectionRecordDetails({
            id: this.detail.id,
            projectId: this.showTableId || undefined,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
    }

    protected async getCorrectionRecordTj()
    {
        this.dataStat = await this.constructService.getCorrectionRecordTj({
            id: this.detail.id,
            projectId: this.showTableId || undefined,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
        let dzgsum = 0, dzgbhsum = 0, ybhsum = 0;
        this.dataStat.dzg && this.dataStat.dzg.map(item => dzgsum += item.hazardCount);
        this.dataStat.dzgsum = dzgsum || 0;

        this.dataStat.dzgbh && this.dataStat.dzgbh.map(item => dzgbhsum += item.hazardCount);
        this.dataStat.dzgbhsum = dzgbhsum || 0;

        this.dataStat.ybh && this.dataStat.ybh.map(item => ybhsum += item.hazardCount);
        this.dataStat.ybhsum = ybhsum || 0;
    }

    protected changeDate(id)
    {
        this.getPublicity();
        this.getCorrectionRecordTj();
    }

    protected created()
    {
        this.getProjectList();
    }

    protected async getProjectList()
    {
        let res: any = await this.projectService.list();
        
        this.protectedList = res.content;
    }
    
    protected toProject(val)
    {
        this.$router.push({path: "/project/manage",query: {id: val}});
    }

}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.header
{
    margin-top: 20px;
    margin-bottom: 33px;
    .mr
    {
        margin-right: 8px;
        width: 76px;
        text-align: center;
    }
    .time
    {
        margin-left: 10px;
        display: inline-block;
        .select-width
        {
            display: inline-block;
        }
    }
    .project-span
    {
        line-height: 28px;
        width: 90px;
        display: inline-block;
        text-align: right;
    }
    .project-select-width
    {
        width: 200px;
    }
}
.i-form-details
{
    background: #F6F8FC;
    border: 1px solid #E7E8EC;
    border-radius: 4px;
    padding: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #525A65;
    line-height: 24px;

}
.img-box-item
{
    width: 210px;
    height: 120px;
    border-radius: 2px;
    overflow: hidden;
    background-size: cover;
    
    img
    {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
    
}
.statistics-num
{
    color: #182334;
    
    &-0
    {
        color: #A533F4;
    }
    &-1
    {
        color: #FF9832 !important;
    }
    &-2
    {
        color: #FF4D3F;
    }
}
.font-400
{
    font-weight: 400;
    font-size: 12px;
}
.statistics-info
{
    display: flex;
    width: 100%;
    padding: 15px 20px 5px;
    .statistics-item
    {
        flex: 1;
        text-align: center;
        margin-bottom: 15px;
        .statistics-num
        {
            font-size: 24px;
            font-family: DINPro;
            font-weight: bold;
            color: #182334;
            &-0
            {
                color: #A533F4;
            }
            &-1
            {
                color: #FF9832;
            }
            &-2
            {
                color: #FF4D3F;
            }
        }
        .statistics-name
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #838D9C;
            padding-top: 15px;
        }
    }
}
.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
        text-align: center;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        text-align: center;
    }
}
</style>