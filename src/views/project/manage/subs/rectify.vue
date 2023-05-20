<template>
    <div class="sub-detail">
        <!-- <section class="statistics-info mb20">
            <div class="statistics-item">
                <p class="statistics-num">{{detail.dangerStats && (detail.dangerStats.afterRectificationSum + detail.dangerStats.afterCloseSum + detail.dangerStats.alreadyCloseSum +detail.dangerStats.timeoutCloseSum) || 0}}</p>
                <p  class="statistics-name" >问题隐患</p>
            </div>
           
            <div class="statistics-item">
                <p class="statistics-num">{{detail.dangerStats && detail.dangerStats.afterRectificationSum || 0}}</p>
                <div  class="statistics-name">
                    待整改
                    <p>
                        (<span class="statistics-num-2">{{detail.dangerStats && detail.dangerStats.afterRectification["一级"] || 0}}</span>+
                        <span class="statistics-num-1">{{detail.dangerStats && detail.dangerStats.afterRectification["二级"] || 0}}</span>+
                        <span class="statistics-num-0">{{detail.dangerStats && detail.dangerStats.afterRectification["三级"] || 0}}</span>)
                    </p>
                </div>
            </div>
            <div class="statistics-item">
                <p class="statistics-num">{{detail.dangerStats && detail.dangerStats.afterCloseSum || 0}}</p>
                <div  class="statistics-name">
                    待闭合
                    <p>
                        (<span class="statistics-num-2">{{detail.dangerStats && detail.dangerStats.afterClose["一级"] || 0}}</span>+
                        <span class="statistics-num-1">{{detail.dangerStats && detail.dangerStats.afterClose["二级"] || 0}}</span>+
                        <span class="statistics-num-0">{{detail.dangerStats && detail.dangerStats.afterClose["三级"] || 0}}</span>)
                    </p>
                </div>
            </div>
            <div class="statistics-item">
                <p class="statistics-num">{{detail.dangerStats && detail.dangerStats.alreadyCloseSum || 0}}</p>
                <div  class="statistics-name">
                    已闭合
                    <p>
                        (<span class="statistics-num-2">{{detail.dangerStats && detail.dangerStats.alreadyClose["一级"] || 0}}</span>+
                        <span class="statistics-num-1">{{detail.dangerStats && detail.dangerStats.alreadyClose["二级"] || 0}}</span>+
                        <span class="statistics-num-0">{{detail.dangerStats && detail.dangerStats.alreadyClose["三级"] || 0}}</span>)
                    </p>
                </div>
            </div>
            <div class="statistics-item">
                <p class="statistics-num">{{detail.dangerStats && detail.dangerStats.timeoutCloseSum || 0}}</p>
                <div  class="statistics-name">
                    超时闭合
                    <p>
                        (<span class="statistics-num-2">{{detail.dangerStats && detail.dangerStats.timeoutClose["一级"] || 0}}</span>+
                        <span class="statistics-num-1">{{detail.dangerStats && detail.dangerStats.timeoutClose["二级"] || 0}}</span>+
                        <span class="statistics-num-0">{{detail.dangerStats && detail.dangerStats.timeoutClose["三级"] || 0}}</span>)
                    </p>
                </div>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-2">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["一级"] + detail.dangerStats.alreadyClose["一级"]+ detail.dangerStats.afterRectification["一级"]) || 0}}
                </p>
                <p  class="statistics-name">一级</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-1">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["较大安全隐患"] + detail.dangerStats.alreadyClose["较大安全隐患"] + detail.dangerStats.alreadyClose["较大安全隐患"] + detail.dangerStats.afterRectification["较大安全隐患"]) || 0}}
                </p>
                <p  class="statistics-name">二级</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-0">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["三级"] + detail.dangerStats.alreadyClose["三级"] + detail.dangerStats.afterRectification["三级"]) || 0}}
                    
                </p>
                <p  class="statistics-name">三级</p>
            </div>
            <div class="statistics-item">
                <p class="statistics-num statistics-num-3">
                    {{detail.dangerStats && (detail.dangerStats.timeoutClose["四级"] + detail.dangerStats.alreadyClose["四级"] + detail.dangerStats.afterRectification["四级"]) || 0}}
                </p>
                <p  class="statistics-name">四级</p>
            </div>
        </section> -->

        <section class="diagnosis-content d-f f-w">
            <section class="diagnosis-content-item" v-for="item in data" :key="item.id">
                <h2 class="title d-f">
                    <i-poptip trigger="hover" content="content" style="100%">
                        <p class="rows-1 w_95">{{detail.projectName || "-"}}诊治报告</p>
                        <div slot="content">{{detail.projectName || "-"}}诊治报告</div>
                    </i-poptip>
                    <span class="font-main f14 cursor-pointer" @click="toDetail(item.id)">查看详情</span>
                </h2>
                
                <p class="code">{{item.consultNum}}</p>
                <i-form class="u-form" label-position="left">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="诊治时间">{{item.consultTime || "-"}}</i-form-item>
                        </i-col>
                        <!-- <i-col class-name="u-row" span="24">
                            <i-form-item class="u-form-item" :label-width="90" label="问题图片">
                                <div class="img-box-item ml10 mb10" style="background: url(https://ts3.cn.mm.bing.net/th?id=OIP-C.S3QOsgnlzrpbpAdOXF4YMAHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2) no-repeat center center;background-size: cover">
                                    <img src="src/assets/application/none-data.png" alt="" srcset="">
                                </div>
                            </i-form-item>
                        
                        </i-col> -->
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item"  label="施工阶段">{{item.constructionStageName || "-"}}</i-form-item>
                        </i-col>

                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item"  label="项目评价">{{item.projectEvaluation || "-"}}</i-form-item>
                        </i-col>

                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="主要风险">{{item.rectificationOpinions || "-"}}</i-form-item>
                        </i-col>
                    </i-row>
                </i-form>
                <div class="d-f statistics">
                    <div class="item-start  br">
                        <h3>诊治成绩</h3>
                        <div class="d-f">
                            <div class="f-1 lse" v-for="(val,i) in item.score" :key="i+'s'">
                                <p class="num statistics-num statistics-num-2">{{val.actualScore || 0}}</p>
                                <p class="name">{{val.name}}</p>
                            </div>
                            
                        </div>
                    </div>
                    <div class="item-start ml20">
                        <h3>总问题（{{item.hazardSum}}）</h3>
                        <div class="d-f item-start-num">
                            <div class="f-1" v-for="(val,i) in item.hazardSumList" :key="i+'i'">
                                <p class="num statistics-num" :class="`${ val.hazardLevelName === '一级' ? 'statistics-num-2' : (val.hazardLevelName ===  '二级' ? 'statistics-num-1' : 'statistics-num-0')}`"
                                     :style="{color: val.color}">
                                    {{val.hazardCount}}</p>
                                <p class="name">{{val.hazardLevelName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>

        <div class="detail-nodata" v-if="!data.length">
            <u-nodata></u-nodata>
        </div>

    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { ProjectService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("ProjectService")
    protected projectService: ProjectService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected hazardLevel = ["","一级","二级","三级"];
    protected mendStatus = ["待整改","待闭合","已闭合","超时闭合"];
    protected mendStatusColor = ["#FEB900","#3375F4","#44CB5C","#838D9C"];
    protected showTable = false;

    protected showTableId = 0;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "分项",
            key: "name"
        },
        {
            title: "权重",
            render: (h, {row}: any) =>
            {
                return h("div", row.perent + "%");
            }
        },
        {
            title: "权重得分",
            key: "sum"
        }
    ];

    @watch("detail",{immediate: true})
    protected onChange(value)
    {
        this.getPublicity(value.id);
    }

    protected async getPublicity(projectId)
    {
        this.data = await this.projectService.getProjectPlanList(projectId);
        
    }

    protected toDetail(val)
    {
        this.$router.push({path: "/project/report",query: {id: val}});
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
    &-3
    {
        color: #838D9C;
    }
}
.statistics-info
{
    display: flex;
    width: 100%;
    .statistics-item
    {
        flex: 1;
        text-align: center;
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
.diagnosis-content
{
    // background: #A533F4;
    &-item
    {
        flex-basis: 48.15%;
        background: rgba(255,255,255,0.98);
        border: 2px solid #E9EBEC;
        border-radius: 8px;
    }
    &-item:not(odd)
    {
        margin-right: 20px;
    }

    h2.title
    {
        padding: 0 34px;
        margin-top: 20px;
        font-size: 18px;
        font-weight: 400;
        color: #182334;
        width: 350px;
        p
        {
            // width: 95%;
            flex-basis: 70%;
            width: 350px;
        };
        .font-main
        {
            font-size: 16px;
            text-align: right;
            flex-basis: 30%;
            min-width: 90px;
        }
    }
    .code
    {
        font-size: 14px;
        font-weight: 400;
        color: #A6ABB5;
        padding: 0 34px;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .u-form
    {
        padding: 0 34px;
    }
    .statistics
    {
        padding: 15px 34px;
        border-top: 1px solid #E9EBEC;
        h3
        {
            font-size: 18px;
            font-weight: 400;
            color: #182334;
        }
        .item-start
        {
            flex: 1;
            .f-1:not(:last-child)
            {
                margin-right: 5px;
            }
            &.br
            {
                border-right: 1px solid #E9EBEC;
            }
            h3
            {
                font-size: 18px;
                font-weight: 400;
                color: #182334;
                margin-bottom: 15px;
            }
            .num
            {
                font-size: 20px;
                margin-bottom: 5px;
            }
            .name
            {
                font-size: 14px;
                font-weight: 400;
                color: #8091AB;
            }
            .item-start-num
            {
                // text-align: center;
                // .f-1:not(:last-child)
                // {
                //     margin-right: 5px;
                // }
            }
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
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
    }
}
</style>