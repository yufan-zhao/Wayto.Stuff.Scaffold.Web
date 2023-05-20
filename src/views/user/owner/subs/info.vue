<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">企业信息</h3>
        <div class="sub-content u-form-content d-f">
            <section class="imgUrl mr20" >
                <div v-if="detail.headImgFile || detail.imgId" class="base-img" :style="{'background': `url(${detail.headImgFile ? imagePath(detail.headImgFile.filePath) : ''}) no-repeat center center`,backgroundSize: '100% 100%'}">
                    <img :src="imagePath(detail.headImgFile ? detail.headImgFile.filePath : '')" v-previewer> 
                </div>
                <div v-else class="base-img-no rows-1" >
                    {{detail.deptName.substring(0,3)}}
                </div>
            </section>
            <i-form class="u-form" label-position="left" style="width: 100%;">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="单位名称">{{detail.deptName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="单位编码">{{detail.customerNum || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="账号">{{detail.userName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="邮箱">{{detail.email || "-"}}</i-form-item>
                    </i-col>
                    
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目对接人">
                            <i-poptip trigger="hover" content="content"  class="w200">
                                <div class="rows-1 dsib w_95">{{detail.responsible || "-"}}（{{detail.mobilePhone || "-"}}）</div>
                                <div slot="content">{{detail.responsible || "-"}}（{{detail.mobilePhone || "-"}}）</div>
                            </i-poptip>
                        </i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="合同">{{detail.contract || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="合同类型">{{detail.htName || "-"}}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="app照片水印Logo">
                            <section class="imgUrl imgUrl-1 mr20" >
                            <div v-if="detail.imgId" class="base-img" :style="{'background': `url(${imagePath(detail.logoUrl)}) no-repeat center center`,backgroundSize: '100% 100%'}">
                                <img :src="imagePath(detail.logoUrl)" v-previewer> 
                            </div>
                
                            </section>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>

        <h3 class="sub-detail-title u-form-content-title">实施项目</h3>

        <section class="diagnosis-content mb15" v-for="item in  data" :key="item.id">
            <div class="diagnosis-title">
                <p class="title">{{item.projectName}}</p>
                <p class="status">{{item.constructionStageName}}</p>
                <p class="tips">安全生产：{{item.safetyDay}}天</p>
                <p class="diagnosis-info" @click="toProject(item.id)" ref="diagnosis-info-1"> 查看详情</p>
                
            </div>
            <div class="diagnosis-content-info">
                <i-form class="u-form" label-position="left" style="width: 100%;">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="项目类型">{{item.projectTypeName}}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="施工面积">{{ item.floorage ||" - " }}K㎡</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="开工日期">{{ item.beginDate ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                            <i-form-item class="u-form-item" label="计划竣工日期">{{ item.completionDate ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="8">
                           
                            <i-form-item class="u-form-item" label="项目地址">
                                <i-poptip trigger="hover" content="content">
                                    <div class="rows-1 dsib w_95">{{ item.projectAddress ||" - " }}</div>
                                    <div slot="content">{{ item.projectAddress ||" - " }}</div>
                                </i-poptip>
                            </i-form-item>
                            
                        </i-col>
                       
                        <!-- <i-col class-name="u-row" span="24">
                            <i-form-item class="u-form-item" :label-width="180" label="项目形象进度照片"></i-form-item>
                            <section class="i-form-details">
                                <div class="img-box-item" style="background: url(https://ts3.cn.mm.bing.net/th?id=OIP-C.S3QOsgnlzrpbpAdOXF4YMAHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2) no-repeat center center;background-size: cover">
                                    <img src="src/assets/application/none-data.png" alt="" srcset="">
                                </div>
                            </section>
                        </i-col> -->
                    </i-row>
                </i-form>
            </div>
        </section>

        <div class="detail-nodata" v-if="!data.length">
            <u-nodata></u-nodata>
        </div>
    </div>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { ProjectService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class InfoView extends View
{
    @service("ProjectService")
    protected projectService: ProjectService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected imagePath = imagePath;

    protected data = [];

    @watch("detail",{immediate: true})
    protected onChange(val)
    {
        this.getProjectList(val.id);
    }

    protected async getProjectList(customerId)
    {
        let res: any = await this.projectService.listDetails({customerId});
        
        this.data = res.content;
    }

    protected toProject(val)
    {
        this.$router.push({path: "/project/manage",query: {id: val}});
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";
.imgUrl
{
    .base-img
    {
        width: 80px;
        height: 80px;
        background-size: cover !important;
    }
    width: 80px;
    height: 80px;
    text-align: center;
    border-radius: 50%;
    min-width: 80px;
    background: #3375F4;
    color: #fff;
    font-size: 14px;
    line-height: 80px;
    overflow: hidden;
    img
    {
        opacity: 0;
        width: 100%;
        height: 100%;
    }

    &-1
    {
        background: none;
    }
}
.diagnosis-content
{
    
    .diagnosis-title
    {
        margin-top: 25px;
        position: relative;
        height: 48px;
        background: #F2F6F9;
        line-height: 48px;
        padding: 0 29px;
        display: flex;
        position: relative;
        .title
        {
            font-size: 14px;
            font-weight: 400;
            color: #182334;
            // flex: 1;
        }
        .diagnosis-info
        {
            text-align: right;
            font-size: 14px;
            font-weight: 400;
            color: #3375F4;
            position: absolute;
            right: 30px;
        }
        .status
        {
            margin-top: 12px;
            // width: 48px;
            padding: 0 7px;
            height: 20px;
            background: #FEB900;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 20px;
            text-align: center;
            margin-left: 8px;
            &-1
            {
                background: #4FCF66;
            }
        }
        .tips
        {
            font-size: 14px;
            font-weight: 400;
            color: #4FCF66;
            margin-left: 8px;
        }
        
    }
    &-info
    {
        width: 100%;
        border: 1px solid #ECECEC;
        padding: 20px 20px;
    }
}

</style>