<template>
    <div class="sub-detail">
        <section class="statistics-info mb20">
            
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{})">
                <p class="statistics-num">
                    {{dangerStats.hazardSum}}
                </p>
                <p  class="statistics-name">问题隐患</p>
            </div>
           
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 0})">
                <p class="statistics-num">{{dangerStats.afterRectificationSum}}</p>
                <div  class="statistics-name">
                    待整改
                    <p>
                        (<template  v-for="(item,i) in dangerStats.afterRectification">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.afterRectification.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 1})">
                <p class="statistics-num">{{dangerStats.afterCloseSum || 0}}</p>
                <div  class="statistics-name">
                    待闭合
                   <p>
                        (<template  v-for="(item,i) in dangerStats.afterClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.afterClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer" @click="getPublicity(detail.id,{mendStatus: 2})">
                <p class="statistics-num">{{dangerStats.alreadyCloseSum || 0}}</p>
                <div  class="statistics-name">
                    已闭合
                     <p>
                        (<template  v-for="(item,i) in dangerStats.alreadyClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.alreadyClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer"  @click="getPublicity(detail.id,{mendStatus: 3})">
                <p class="statistics-num">{{dangerStats.timeoutCloseSum || 0}}</p>
                <div  class="statistics-name">
                    超时闭合
                     <p>
                        (<template  v-for="(item,i) in dangerStats.timeoutClose">
                            <span class="statistics-num-2" :style="{color: item.color}" :key="i">
                                {{item.hazardCount || 0}}
                            </span>
                            <span :key="i+'s'">
                                {{ i >= 0 && dangerStats.timeoutClose.length-1 > i ? "+" : ""}}
                            </span>
                        </template>)
                    </p>
                </div>
            </div>
            <div class="statistics-item cursor-pointer"  v-for="(item,i) in dangerStats.hazardSumList" :key="i+'0'"  @click="getPublicity(detail.id,{hazardLevel: item.hazardLevel})">
                <p class="statistics-num" :style="{color: item.color}">
                    {{item.hazardCount || "0"}}
                </p>
                <p  class="statistics-name">{{item.hazardLevelName}}</p>
            </div>
        </section>

        <section  class="diagnosis-content"  v-if="dataMiddl.length">
            <div class="diagnosis-title" @click="changeTableShow('0000')">
                <div class="title d-f">
                    <div class="mr10 f-1" v-for="(item,i) in dataMiddl" :key="i + 's'"  >
                        <p class="title font-3375F4 fb f14" >{{item.name}} ({{item.count || 0}})</p>
                    </div>
                </div>
                <p class="diagnosis-info" ref="diagnosis-info-1" >
                     <i-icon type="ios-arrow-up" v-if="showTableId.indexOf('0000') !== -1" ></i-icon>
                     <i-icon type="ios-arrow-down" v-if="showTableId.indexOf('0000') === -1" ></i-icon>
                </p>
            </div>
            <div class="diagnosis-content-info d-f" v-if="showTableId.indexOf('0000') !== -1">
                <div class="mr10 f-1" v-for="(item,i) in dataMiddl" :key="i + 's'">
                    <p class="content font-838D9C mt10 f14"  v-for="(val,i) in item.children" :key="i + 'n'">{{val.name}}:
                        <span class="font-normal fb"> {{val.count || 0}}</span></p>
                </div>
                <div style="flex:0.1"></div>
            </div>
        </section>
        
        <section v-if="data.length" >
            <section class="diagnosis-content"  v-for="item in data" :key="item.id" >
                <div class="diagnosis-title" @click="changeTableShow(item.id)">
                    <p class="title"><span class="font-main">{{item.hazardLevelName}}问题:</span> {{item.parentPath}} <span class="problem-status" :style="{background: mendStatusColor[item.mendStatus]}">{{mendStatus[item.mendStatus]}}</span></p>
                    <p class="diagnosis-info" ref="diagnosis-info-1">
                        <!-- <i-icon type="chevron-up" v-if="!showTable && showTableId === 1"></i-icon> -->
                        <!-- <i-icon type="chevron-down" ></i-icon> -->
                        <!-- v-if="!showTable || showTableId !== 1" -->
                        <i-icon type="ios-arrow-up" v-if="showTableId.indexOf(item.id) !== -1"></i-icon>
                        <i-icon type="ios-arrow-down" v-if="showTableId.indexOf(item.id) === -1"></i-icon>
                    </p>
                </div>
                <div class="diagnosis-content-info" v-if="showTableId.indexOf(item.id) !== -1">
                    <div class="regular-info">
                        扣分标准：{{item.check && item.check.standard || "-"}}
                    </div>
                    
                    <section class="d-f mt20 pr pt5">
                        <div class="bt-ECECEC pa bt-remark"></div>
                            <i-form class="u-form f-1"  label-position="left">
                            <i-row> <h5>问题信息</h5></i-row>
                            <i-row type="flex" justify="start">
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="问题描述">{{item.questionDescription}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-row" span="24" v-if="item.commonFileList">
                                    <i-form-item class="u-form-item" label="问题图片">
                                        <!-- <div class="d-f f-w">
                                            <div class="img-box-item ml10 mb10" v-for="val in (item.commonFileList || [])" :key="val.id" :style="{background: `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}">
                                                <img :src="val.filePath | imagePath" alt="" srcset="">
                                            </div>
                                        </div> -->
                                        <div class="d-f f-w">
                                            <!-- <section v-for="val in (item.commonFileList || [])" :key="val.id" >
                                                <div class="img-box-item ml10 mb10" :style="{background: `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-if="inputType.indexOf(val.fileSuffix) !== -1" >
                                                    <img :src="val.filePath | imagePath" alt="" srcset="">
                                                </div>
                                                <video  width="224" v-else height="125"  controls>
                                                    <source :src="imagePath(val.filePath)" type="video/mp4">
                                                    <source :src="imagePath(val.filePath)" type="video/ogg">
                                                    您的浏览器不支持 video 标签。
                                                </video>
                                            </section> -->
                                            <b-table-media
                                                :data="item.commonFileList"
                                                :size="[76, 76]"
                                            ></b-table-media>
                                        </div>
                                    </i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="整改建议">{{item.rectifyDescription || "-"}}</i-form-item>
                                </i-col>
                                 <i-col class-name="u-col" span="24">
                                        <i-form-item class="u-form-item" label="扣减分数">{{item.buckleScore || 0}}</i-form-item>
                                    </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="整改期限">{{item.rectifyDay || "-"}}天</i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="提交人员">{{item.user && item.user.name}}（{{item.user && item.user.allRoleName}}）   {{item.createTime}}</i-form-item>
                                </i-col>
                            </i-row>
                        </i-form>
                        <i-form class="u-form  f-1   bl-ECECEC ml20 pl25" label-position="left" v-if="item.mendInfo">
                            <i-row> <h5>整改信息</h5></i-row>
                            <i-row type="flex" justify="start">
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="整改反馈">{{item.mendInfo && item.mendInfo.mendDescription || "-"}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-row" span="24" v-if="item.mendInfo && item.mendInfo.commonFileList">
                                    <i-form-item class="u-form-item" label="问题图片">
                                        <div class=" d-f f-w">
                        
                                            <!-- <section  v-for="val in (item.mendInfo && item.mendInfo.commonFileList || [])" :key="val.id"  >
                                                <div class="img-box-item ml10 mb10" :style="{background: `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-if="inputType.indexOf(val.fileSuffix) !== -1" >
                                                    <img :src="val.filePath | imagePath" alt="" srcset="">
                                                </div>
                                                <video  width="224" v-else height="125"  controls>
                                                    <source :src="imagePath(val.filePath)" type="video/mp4">
                                                    <source :src="imagePath(val.filePath)" type="video/ogg">
                                                    您的浏览器不支持 video 标签。
                                                </video>
                                            </section> -->
                                            <b-table-media
                                                :data="item.mendInfo && item.mendInfo.commonFileList || []"
                                                :size="[76, 76]"
                                            ></b-table-media>
                                        </div>
                                    </i-form-item>
                                    
                                    </i-col>
                                    <i-col class-name="u-col" span="24">
                                        <i-form-item class="u-form-item" label="超时情况">{{item.mendStatus === 3 && "已超时" || "未超时"}}</i-form-item>
                                    </i-col>
                            
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="提交人员">{{item.mendInfo && item.mendInfo.user && item.mendInfo.user.name}}（{{item.user && item.user.allRoleName}}）    {{item.mendInfo && item.mendInfo.createTime || "-"}}</i-form-item>
                                </i-col>
                            </i-row>
                        </i-form>
                    </section>
                </div>
            </section>
        </section>

        <u-nodata v-else></u-nodata>

    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { HiddenService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";
@component
export default class InfoView extends View
{
    @service("HiddenService")
    protected hiddenService: HiddenService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected imagePath = imagePath;

    protected hazardLevel = ["","一级","二级","三级"];
    protected mendStatus = ["待整改","待闭合","已闭合","超时闭合"];
    protected mendStatusColor = ["#FEB900","#3375F4","#44CB5C","#838D9C"];
    protected showTable = false;
    protected inputType = [".png",".jpg",".jpeg","",""];

    protected showTableId = [];

    protected data: any = [];
    protected dataMiddl: any = [];

    protected dangerStats: any = {};

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
        this.showTableId = [];
        this.getPublicity(value.id,{});
        this.getDangerLevel(value.id, value.specialTypeId);
        this.dangerStats = {};
        this.getDangerStats(value.id);
    }

    protected async getPublicity(consultId,items)
    {
        this.data = [];
        
        this.data = await this.hiddenService.getDangerTree({consultId,...items});
        
    }
    
    protected async getDangerStats(consultId)
    {
        let res = await this.hiddenService.getDangerStats({consultId});
        // console.log(res);
        
        this.dangerStats = res;
        // this.dangerStats.doitemd = res.ha
    }
    protected async getDangerLevel(consultId,specialTypeId)
    {
        this.dataMiddl = [];
        
        let dataMiddl: any = await this.hiddenService.getDangerLevel({consultId,specialTypeId});

        this.dataMiddl = dataMiddl.map(item =>
        {
            let sum = 0;
            item.children.forEach(val =>
            {
                sum += val.count;
            });
            return {
                name: item.name,
                count: sum,
                children: item.children
            };
        });
        
    }

    protected changeTableShow(id)
    {
        if(this.showTableId.indexOf(id) === -1)
        {
            this.showTableId.push(id);
        }
        else
        {
           this.showTableId = this.showTableId.filter(item => item !== id);
        }
    }

}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.statils
{
    background: #FBFCFE;
    border: 1px solid #EFF2F3;
    border-radius: 4px;
    padding: 15px 20px;
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
    .bt-remark
    {
        height: 2px;
        left: -29px;
        right: -29px;
        top: -6px;
    }
    .diagnosis-title
    {
        margin-top: 25px;
        position: relative;
        height: 48px;
        background: #F2F6F9;
        line-height: 48px;
        padding: 0 29px;
        display: flex;
        .problem-status
        {
            padding: 4px 7px;
            background: #44CB5C;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
            text-align: center;
            display: inline-block;
            line-height: normal;
        }
        .title
        {
            font-size: 14px;
            font-weight: 600;
            color: #182334;
            flex: 3;
        }
        .diagnosis-info
        {
            
            text-align: right;
            font-size: 19px;
            font-weight: 400;
            color: #182334;
            flex: 0.1;
        }
        
    }
    &-info
    {
        width: 100%;
        border: 1px solid #ECECEC;
        padding: 20px 29px;
        h5
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #182334;
            line-height: 28px;
        }
        .regular-info
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #182334;
            line-height: 22px;
            // padding: 19px 24px;
        }
        .img-box-item
        {
            width: 76px;
            height: 76px;
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