<template>
    <div class="sub-detail">
        <h3 class="title">{{details.title}}</h3>
        <div class="d-f" v-if="details.publisher">
            <p class="tips-top f-2">{{details.publisher}} &nbsp; {{details.publisher ? "|" : ""}} &nbsp; {{details.releaseDate || details.releaseTime || details.createTime}}</p>
            <p class="f-1">
                <span class="dsib">
                    <i class="iconfont icon-icon_liulan f20 font-3375F4 mr3"></i>
                    <span class="dsib pt8 f16">{{details.follow && details.follow.lookNumber || 0}} </span>
                </span>
                &nbsp;
                 <!-- @click="changeDianzan" -->
                <span class="dsib">
                    <!-- <i class="iconfont icon-icon_yidianzan f24 font-FF9832 mr3 cursor-pointer" v-if="details.follow && details.follow.isFollow"></i> -->
                    <i class="iconfont icon-icon_dianzan  f24 font-FF9832 mr3 cursor-pointer"></i>
                     <!-- v-if="!details.follow || details.follow.isFollow" -->
                    <span class="dsib pt8 f16">{{details.follow && details.follow.likeNumber || 0}} </span>
                </span>
                &nbsp;
                 <!-- @click="changeShoucang"  -->
                <span class="dsib">
                     <!-- v-if="!details.follow || details.follow.isFollow" -->
                    <!-- <i class="iconfont icon-icon_yishoucang f20 font-FF4D3F mr3 cursor-pointer" v-if="details.follow && details.follow.isFollow"></i> -->
                    <i class="iconfont icon-icon_shoucang f20 font-FF4D3F mr3 cursor-pointer"></i>
                    <span class="dsib pt8 f16">{{details.follow && details.follow.followNumber || 0}} </span>
                </span>
                &nbsp;
            </p>
        </div>
        <i-form class="u-form mb20" label-position="left"   style="width: 100%;"  v-if="detail.imageList && detail.imageList.length">
            <i-row type="flex" justify="start">
                <i-form-item class="u-form-item" :label-width="180" label="图片"></i-form-item>
                <section class="i-form-details" v-previewer>
                    <div class="img-box-item" :style="{background: `url(${imagePath(item.filePath)}) no-repeat center center`,backgroundSize: 'cover'}" v-for="item in detail.imageList" :key="'i' + item.id">
                        <img :src="item.filePath | imagePath" alt="" srcset="">
                    </div>
                </section>
            </i-row>
        </i-form>
                        <!-- <u-nodata v-else></u-nodata> -->
        <section class="font-1a text-content">
            <!-- <section v-html="details.content"></section> -->
            <section v-if="detail.content" v-html="detail.content"></section>
        </section>
        
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { KnowledgeService, DictService } from "src/services";
import { service } from "src/common/decorator";
import { imagePath } from "src/common/utils/extend-utils";

@component
export default class InfoView extends View
{
    protected details: any = {};

    protected imagePath: any = imagePath;

    @config({required: true, default: () => ({})})
    protected detail: any;
    
    @service("KnowledgeService")
    protected testPaginTableService: KnowledgeService;

    @watch("detail",{immediate: true, deep: true})
    protected onchange()
    {
        this.getDatails();
        // this.updateLookNumbr();
    }

    protected async changeDianzan()
    {
        try {
            await this.testPaginTableService.updateLike({knowledgeId: this.detail.id});
            this.getDatails();
        }
        catch (error)
        {
            //
        }
    }

    protected async changeShoucang()
    {
        try {
            await this.testPaginTableService.updateFollow({knowledgeId: this.detail.id,follow: !!(this.details.follow && this.details.follow.isFollow)});
            this.getDatails();
        }
        catch (error)
        {
            // 
        }
    }

    protected async getDatails()
    {
        this.details = await this.testPaginTableService.detail({id: this.detail.id});
    }

    protected async updateLookNumbr()
    {
        await this.testPaginTableService.updateLookNumbr({knowledgeId: this.detail.id});
    }

}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
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
    display: flex;
    &.no-bg
    {
        background: none;
        border: none;
        padding: 0;
    }
    .img-box-item
    {
        flex-wrap: wrap;
        width: 210px;
        height: 120px;
        border-radius: 2px;
        overflow: hidden;
        background-size: cover !important;
        margin-right: 10px;
        margin-bottom: 10px;
        img
        {
            opacity: 0;
            width: 100%;
            height: 100%;
        }
        
    }
}
h3.title
{
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #182334;
    line-height: 28px;
    margin-bottom: 20px;
    margin-right: 20px;
}
p.tips-top
{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #526384;
    line-height: 28px;
    margin-bottom: 20px;
}
.text-content
{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 30px;
    /deep/img
    {
        max-height: 300px !important;
    }
}
</style>