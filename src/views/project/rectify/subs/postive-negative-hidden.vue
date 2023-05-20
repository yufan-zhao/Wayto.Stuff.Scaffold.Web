<template>
    <div class="sub-detail positive-negative-report">
        <section class="statistics-info mb20">
            <div class="statistics-item cursor-pointer">
                <p class="statistics-num">
                    {{data.length}}
                </p>
                <p  class="statistics-name">负面清单数</p>
            </div>
            <div class="statistics-item cursor-pointer">
                <p class="statistics-num">
                    {{statData.notClose}}
                </p>
                <p  class="statistics-name">待整改</p>
            </div>
            <div class="statistics-item cursor-pointer">
                <p class="statistics-num">
                    {{statData.awaitClose}}
                </p>
                <p  class="statistics-name">待闭合</p>
            </div>
            <div class="statistics-item cursor-pointer">
                <p class="statistics-num">
                    {{statData.thenClose}}
                </p>
                <p  class="statistics-name">已闭合</p>
            </div>
            <div class="statistics-item cursor-pointer">
                <p class="statistics-num">
                    {{statData.timeOutClose}}
                </p>
                <p  class="statistics-name">超时闭合</p>
            </div>
        </section>

        <section v-if="data.length > 0">
            <section class="diagnosis-content" v-for="(item, i) in data" :key="i">
                <div class="diagnosis-title" @click="() => showIndex = i">
                    <p class="title">
                        <span class="font-main"></span>{{item.parentPath}}
                        <span class="problem-status" :style="{background: mendStatusColor[item.status]}">{{mendStatus[item.status]}}</span>
                    </p>
                    <p class="diagnosis-info" ref="diagnosis-info-1">
                        <i-icon type="ios-arrow-up" v-if="showIndex !== i"></i-icon>
                        <i-icon type="ios-arrow-down" v-else></i-icon>
                    </p>
                </div>
                <div class="diagnosis-content-info" v-if="showIndex === i">
                    <!-- <div class="regular-info">
                        扣分标准：
                    </div> -->
                    
                    <section class="d-f pr pt5">
                        <!-- <div class="bt-ECECEC pa bt-remark"></div> -->
                        <i-form class="u-form f-1" label-position="left">
                            <i-row> <h5>问题信息</h5></i-row>
                            <i-row type="flex" justify="start">
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="扣分项">{{item.item.details}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="扣分">{{item.score}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-row" span="24" v-if="Array.isArray(item.commonFileList) && item.commonFileList.length > 0">
                                    <i-form-item class="u-form-item" label="问题图片" v-previewer>
                                        <div class="d-f f-w">
                                            <section v-for="val in (item.commonFileList || [])" :key="val.id" >
                                                <div class="img-box-item ml10 mb10" :style="{background: `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-if="inputType.indexOf(val.fileSuffix) !== -1" >
                                                    <img :src="val.filePath | imagePath" alt="" srcset="">
                                                </div>
                                                <video  width="224" v-else height="125"  controls>
                                                    <source :src="imagePath(val.filePath)" type="video/mp4">
                                                    <source :src="imagePath(val.filePath)" type="video/ogg">
                                                    您的浏览器不支持 video 标签。
                                                </video>
                                            </section>
                                            
                                        </div>
                                    </i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="扣分标准">{{item.item.standard}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="扣分单位">{{item.supervisingUnitNames}}</i-form-item>
                                </i-col>
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="整改期限">{{item.rectifyDay}}天</i-form-item>
                                </i-col>
                            </i-row>
                        </i-form>
                        <!-- v-if="item.mendInfo" -->
                        <i-form class="u-form f-1 pl25 bl-ECECEC ml20" label-position="left">
                            <i-row class="d-f">
                                <h5 class="f-1">整改信息</h5>
                            </i-row>
                            <i-row type="flex" justify="start" v-if="item.mend">
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="整改反馈">{{item.mend.feedback}}</i-form-item>
                                </i-col>
                                <!-- <i-col class-name="u-row" span="24">
                                    <i-form-item class="u-form-item" label="问题图片" v-previewer>
                                        <div class=" d-f f-w">
                                            问题图片
                                            <section  v-for="val in (item.mendInfo && item.mendInfo.commonFileList || [])" :key="val.id"  >
                                                <div class="img-box-item ml10 mb10" :style="{background: `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-if="inputType.indexOf(val.fileSuffix) !== -1" >
                                                    <img :src="val.filePath | imagePath" alt="" srcset="">
                                                </div>
                                                <video  width="224" v-else height="125"  controls>
                                                    <source :src="imagePath(val.filePath)" type="video/mp4">
                                                    <source :src="imagePath(val.filePath)" type="video/ogg">
                                                    您的浏览器不支持 video 标签。
                                                </video>
                                            </section>
                                        </div>
                                    </i-form-item>
                                
                                </i-col> -->
                                <i-col class-name="u-col" span="24">
                                    <i-form-item class="u-form-item" label="超时情况">{{item.mend.timeout}}</i-form-item>
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
import CommonView from "src/views/common-view";
import { ScorePositiveNegativeService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class PositveNegativeReportView extends CommonView
{
    @service("ScorePositiveNegativeService")
    private scorePositiveNegativeService: ScorePositiveNegativeService;

    /**
     * row detail
     * @config
     */
    @config({required: true, default: () => ({})})
    protected detail: any;

    @config({required: true, default: () => []})
    protected data: Array<any>;

    /**
     * 诊治id
     * @property
     */
    protected get consultId(): number
    {
        return this.detail ? this.detail.id : -1;
    }

    /**
     * 诊治的体系类型id
     * @property
     */
    protected get specialTypeId(): number
    {
        return this.detail ? this.detail.specialTypeId : -1;
    }

    protected statData: any = {};

    protected mendStatus = ["待整改","待闭合","已闭合","超时闭合"];
    protected mendStatusColor = ["#FEB900","#3375F4","#44CB5C","#838D9C"];
    protected showIndex: number = -1;

    @watch("consultId", {immediate: true})
    protected consultIdWatcher(val: number)
    {
        if (typeof val === "number" && val > 0)
        {
            this.initData();
        }
    }

    protected async initData()
    {
        const res = await this.scorePositiveNegativeService.getItemInfoMendsStats(this.consultId, this.specialTypeId);
        // console.log("WTF", res);
        this.statData = res.content;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";

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
</style>