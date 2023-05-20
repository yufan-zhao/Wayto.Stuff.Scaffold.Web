<template>
    <div class="sub-detail">
        <div>上报时间： <i-date-picker type="daterange" v-model="date" placeholder="选择日期" style="width: 200px"></i-date-picker></div>

        <section class="d-f mt15">
            <!-- <div class="f-1 statistics-left" > -->
                <section class="statistics-info mb20 f-1">
                    <div class="statistics-item"><p class="statistics-num">{{data.dangerCount || 0}}</p><p  class="statistics-name">问题隐患总数</p></div>
                    <div class="statistics-item"><p class="statistics-num">{{data.totalNumberOfInspections || 0}}</p><p  class="statistics-name">诊治总次数</p></div>
                    <div class="statistics-item"><p class="statistics-num">{{data.projectNum || 0}}</p><p  class="statistics-name">诊治项目数</p></div>
                    <div class="statistics-item"><p class="statistics-num">{{data.totalInspectionTime || 0}}</p><p  class="statistics-name">诊治总时长</p></div>
                    <div class="statistics-item"><p class="statistics-num">{{data.diagnosedNum || 0}}</p><p  class="statistics-name">已诊治</p></div>
                    <div class="statistics-item"><p class="statistics-num">{{data.undiagnosedNum || 0}}</p><p  class="statistics-name">未诊治</p></div>
                </section>
            <!-- </div> -->
            <!-- <div class="f-1 statistics-left"> -->
                <section class="statistics-info mb20 f-1 ml20">
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
                </section>
            <!-- </div> -->
        </section>

        <h3 class="mb10">工作记录详情</h3>
        <i-table class="table-normal mb20" :data="dataList" :columns="columuns2"></i-table>
        <!-- <div class="detail-nodata" v-if="!dataHidden.length">
            <u-nodata></u-nodata>
        </div>        -->
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { DiagnosService, OrgService, RoleService, DictService } from "src/services";
import { service } from "src/common/decorator";
@component
export default class InfoView extends View
{
    @service("DiagnosService")
    protected testPaginTableService: DiagnosService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected showTable = false;
    protected dataStat: any = {};
    protected dataHidden: any = [];

    protected dataList: any = [];

    protected showTableId = 0;
    protected date = "";

    protected data: any = {};

    protected columuns2: Array<any> =
    [
        {
            title: "编号",
            render: (h, {row}: any) =>
            {
                return h("div", row.consultNum ||  "-");
            }
        },
        {
            title: "项目名称",
            render: (h, {row}: any) =>
            {
                return h("div", row.projectManager.projectName ||  "-");
            }
        },
        {
            title: "项目类型",
            render: (h, {row}: any) =>
            {
                return h("div", row.projectManager.projectTypeName ||  "-");
            }
        },
        {
            title: "状态",
            render: (h, {row}: any) =>
            {
                return h("div", row.status ? "已完结" :  "施工中");
            }
        },
        {
            title: "巡查开始时间",
            render: (h, {row}: any) =>
            {
                return h("div", row.beginTime ||  "-");
            }
        },
        {
            title: "巡查结束时间",
            render: (h, {row}: any) =>
            {
                return h("div", row.endTime ||  "-");
            }
        },
        {
            title: "问题隐患",
            render: (h, {row}: any) =>
            {
                return h("div", row.hazardCount ||  "-");
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
        // this.getDangerProblemCountVo();
        // this.getDiWorkRecordVo();
        this.getDiWorkRecordVo();
        this.getWorkRecordDetailVo();
        this.getDiagnosisdeptGjlRecordVo();
    }
    
    protected async getWorkRecordDetailVo()
    {
        this.dataList = await this.testPaginTableService.getWorkRecordDetailVo({
            userId: this.detail.userId,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
    }

    protected async getDangerProblemCountVo()
    {
        this.dataHidden = await this.testPaginTableService.getDangerProblemCountVo({
            userId: this.detail.userId,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
    }

    protected async getDiWorkRecordVo()
    {
        this.data = await this.testPaginTableService.getDiWorkRecordVo({
            userId: this.detail.userId,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
    }

    protected async getDiagnosisdeptGjlRecordVo()
    {
        this.dataStat = await this.testPaginTableService.getDiagnosisdeptGjlRecordVo({
            userId: this.detail.userId,
            enDate: this.date && this.date.length && this.date[1] || undefined,
            startDate: this.date && this.date.length && this.date[1] || undefined
        });
        // console.log(this.dataStat);
        
        let dzgsum = 0, dzgbhsum = 0, ybhsum = 0;
        this.dataStat.dzg && this.dataStat.dzg.map(item => dzgsum += item.hazardCount);
        this.dataStat.dzgsum = dzgsum || 0;

        this.dataStat.dzgbh && this.dataStat.dzgbh.map(item => dzgbhsum += item.hazardCount);
        this.dataStat.dzgbhsum = dzgbhsum || 0;

        this.dataStat.ybh && this.dataStat.ybh.map(item => ybhsum += item.hazardCount);
        this.dataStat.ybhsum = ybhsum || 0;
    }
    
    protected toProject(val)
    {
        this.$router.push({path: "/project/manage",query: {id: val}});
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.statistics-num
{
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
.font-400
{
    font-weight: 400;
    font-size: 12px;
}
.statistics-info
{
    display: flex;
    width: 100%;
    background: #FAFBFE;
    border: 1px solid #E9EBEC;
    border-radius: 4px;
    flex-wrap: wrap;
    padding: 15px 20px 5px;
    .statistics-item
    {
        flex-basis: 33.33%;
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
.statistics-left
{
    background: #FAFBFE;
    border: 1px solid #E9EBEC;
    border-radius: 4px;
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