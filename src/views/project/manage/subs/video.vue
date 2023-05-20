<template>
    <div class="main">
        <div class="header mt20">
            <i-radio-group v-model="flowStatus" type="button"  @on-change="getTime">
                <i-radio class="mr br-r2" label="全部"></i-radio>
                <i-radio class="mr br-r2" label="近一周"></i-radio>
                <i-radio class="mr br-r2" label="近半月"></i-radio>
                <i-radio class="mr br-r2" label="近三月"></i-radio>
                <i-radio class="mr br-r2" label="近半年"></i-radio>
            </i-radio-group>
            <div class="time">
                <span>选择时间：</span>
                <div class="select-width">
                    <i-date-picker v-model="date" type="daterange" split-panels placeholder="请选择" style="width: 200px"  @on-change="getTime"></i-date-picker>
                </div>
            </div>
        </div>
        <div class="content">
            <div v-for="item in fileData" :key="item.id" class="mt30">
                <p class="date-title">{{item.dateStr}} <span class="f14">共上传{{item.file.length}}个文件</span></p>
                <p class="line"></p>
                
                <div class="data-img" v-previewer>
                    
                    <div class="img mb5" v-for="val in item.pictureVideo" :key="val.id">
                        <div class="img-div" :style="{'background': `url(${imagePath(val.filePath)}) no-repeat center center`,backgroundSize: 'cover'}"  v-if="inputType.indexOf(val.fileSuffix) !== -1" >
                            <img :src="imagePath(val.filePath)"/>
                            <div class="iossn fr cursor-pointer" @click="delImg(val.id)"><i-icon type="md-close" size="20"/></div>
                            
                        </div>

                        <div class="video-div" v-else>
                            <video width="320"  height="178" controls>
                                <source :src="imagePath(val.filePath)" type="video/mp4">
                                <source :src="imagePath(val.filePath)" type="video/ogg">
                                <source :src="imagePath(val.filePath)" type="video/mov">
                                您的浏览器不支持 video 标签。
                            </video>
                           <div class="iossn fr cursor-pointer" @click="delImg(val.id)"><i-icon type="md-close" size="20"/></div>

                        </div>

                    </div>

                    <div class="file-div" v-for="val in item.file" :key="val.id + 's'">
                        <section @click="downLaods(val.filePath,val.fileName)">
                             <i-icon type="md-link" size="18"/> {{val.fileName}}{{val.fileSuffix}}
                        </section>
                        <div class="iossn fr cursor-pointer" @click="delImg(val.id)"><i-icon type="md-close" size="16"/></div>
                    </div>

                </div>
            </div>
        </div>
        <div class="bottom-div"></div>

        
        <div v-if="fileData && !fileData.length" class="tc mt30">暂无数据</div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import dayjs from "dayjs";
import { imagePath } from "src/common/utils/extend-utils";
import { ProjectFileService } from "src/services";
import { service } from "src/common/decorator";
import fileUtils from "src/common/utils/file-utils";
import { FileUtils } from "src/common/utils";
@component
export default class InfoView extends View
{
    @service("ProjectFileService")
    protected projectFileService: ProjectFileService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected imagePath = imagePath;
    protected dayjsF = dayjs;

    protected flowStatus = "全部";

    protected els = [".xlsx",".docx",".pdf",".xls",".doc"];

    // 数据录入类型c
    protected inputType = [".png",".jpg",".jpeg","",""];

    protected date = "";
    
    protected fileData = [];

    protected filters =
    {
        endDate: undefined,
        startDate: undefined
    };

    @watch("detail",{immediate: true})
    protected decc()
    {
        this.getVideo();
    }

    protected getTime()
    {
        
        if(this.date && this.date[0])
        {
            this.filters =
            {
                endDate: dayjs(this.date[0]).format("YYYY-MM-DD"),
                startDate: dayjs(this.date[1]).format("YYYY-MM-DD")
            };
            
        }
        else
        {
            let today = dayjs().format("YYYY-MM-DD");
            switch(this.flowStatus)
            {
                case "全部":
                    this.filters =
                    {
                        endDate: undefined,
                        startDate: undefined
                    };
                    break;

                case "近一周":
                    this.filters =
                    {
                        endDate: today,
                        startDate: dayjs().subtract(7,"day").format("YYYY-MM-DD")
                    };
                    break;

                case "近半月":
                    this.filters =
                    {
                        endDate: today,
                        startDate: dayjs().subtract(15,"day").format("YYYY-MM-DD")
                    };
                    break;

                case "近三月":
                    this.filters =
                    {
                        endDate: today,
                        startDate: dayjs().subtract(90,"day").format("YYYY-MM-DD")
                    };
                    break;

                case "近半年":
                    this.filters =
                    {
                        endDate: today,
                        startDate:  dayjs().subtract(180,"day").format("YYYY-MM-DD")
                    };
                    break;
                default:
                break;

            }

        }

        this.getVideo();
    }

    protected async getVideo()
    {
        let { content } = await this.projectFileService.getProjectFileListById({projectId: this.detail.id, ...this.filters});
        
        this.fileData = content;
    }

    protected downLaods(url,name)
    {
        
        FileUtils.downloadFile(imagePath(url),name);
    
    }

    protected delImg(id)
    {
        this.$modal.confirm({
            title: "提示",
            content: "您确定要删除该数据吗？",
            onOk: async () =>
            {
                try
                {
                    await this.projectFileService.virtualRemoveById(id);
                    this.$message.success("操作成功");
                    this.getVideo();
                } catch (error) {
                    this.$message.success("操作失败：" + error);
                }
            }
        });
    }
}
</script>

<style lang="less" scoped>
.main
{
    padding-right: 30px;
    
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
    }
    .content
    {
        .date-title
        {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #182334;
        }
        .line
        {
            margin-top: 13px;
            margin-bottom: 22px;
            height: 1px;
            background: #F1F2F2;
        }
        .data-title
        {
            margin-bottom: 17px;
            span:nth-child(1), span:nth-child(2), span:nth-child(3)
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #182334;
                display: inline-block;
                margin-right: 19px;
            }
            span:nth-child(4)
            {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #A6ABB5;
            }
        }
        .file-div
        {
            flex-basis: 100%;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            &:hover
            {
                color: @main-color;
            }
            .iossn
            {
                color: #A6ABB5;
            }
            .iossn:hover
            {
                color: @main-color;
            }
        }
        .video-div
        {
            width: 320px;
            height: 178px;
            position: relative;
            &:hover
            {
                .iossn
                {
                    background: rgba(0,0,0,0.2);
                    display: block;
                }
                
                .ivu-icon
                {
                    color: @main-color;
                        
                }
            }
            .iossn
            {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 999999;
                width: 25px;
                height: 25px;
                background: rgba(0,0,0,0.3);
                border-radius: 2px;
                display: none;
                .ivu-icon
                {
                    position: absolute;
                    color: #fff;
                    margin-left: 2px;
                    margin-top: 1px;
                }
                &:hover
                {
                    background: rgba(0,0,0,0.2);
                    .ivu-icon
                    {
                        background: rgba(0,0,0,0.2);
                        color: @main-color;
                    }
                }
            }
        }
        .img-div
        {
            flex-basis: 48%;
            position: relative;
            &:hover
            {
                .iossn
                {
                    background: rgba(0,0,0,0.2);
                    display: block;
                }
                
                .ivu-icon
                {
                    color: @main-color;
                        
                }
            }
            .iossn
            {
                position: absolute;
                display: none;
                top: 0;
                right: 0;
                z-index: 999999;
                width: 25px;
                height: 25px;
                background: rgba(0,0,0,0.3);
                border-radius: 2px;
                .ivu-icon
                {
                    position: absolute;
                    color: #fff;
                    margin-left: 2px;
                    margin-top: 1px;
                    
                }
                &:hover
                {
                    background: rgba(0,0,0,0.2);
                    .ivu-icon
                    {
                        color: @main-color;
                    }
                }
            }
        }
        .data-img
        {
            display: flex;
            flex-wrap: wrap;
            
            .img
            {
                // background: rgb(0, 169, 255);
                display: inline-block;
                width: 328px;
                height: 178px;
                border-radius: 2px;
                margin-right: 14px;
                overflow: hidden;
                line-height: 178px;
                
                &-div
                {
                    width: 328px;
                    height: 178px;
                    border-radius: 2px;
                    margin-right: 14px;

                    img
                    {
                        width:  108%;
                        height: 100%;
                        opacity: 0;
                    }
                }
            }
            
            // video
            // {
            //     width: 328px;
            //     height: 108px;
            // }
        }
    }
    .bottom-div
    {
        height: 50px;
    }
}
</style>