<template>
    <div class="main pt30">
        <div class="content" v-for="item in stage" :key="item.id">
            <div class="time">{{item.createTime}}</div>
            <div class="time-line">
                <p></p>
                <p :style="{ height: item === 2 ? '134px' : '278px' }"></p>
            </div>
            <div class="text-content">
                <div class="text">
                    <section  v-if="item.type === 1">
                        <div>
                            <h6 class="f16">归还</h6>
                        </div>
                        <div>
                            <span>归还人：</span>
                            <span>{{item.returnPersonName || "-"}}({{item.mobilePhone}}) - {{item.deptNameLg}}</span>
                        </div>
                        <div>
                            <span>归还状态：</span>
                            <span>{{item.returnStatus ? "好" : "有损"}}</span>
                        </div>
                        <div>
                            <span>操作人：</span>
                            <span>{{item.createUserName || "-"}} - {{item.deptNameCz}}</span>
                        </div>
                    </section>
                    <section  v-if="item.type === 0">
                        <div>
                            <h6 class="f16">领用</h6>
                        </div>
                        <div>
                            <span>领取人：</span>
                            <span>{{item.returnPersonName || "-"}}({{item.mobilePhone}}) - {{item.deptNameLg}}</span>
                        </div>
                        <div>
                            <span>操作人：</span>
                            <span>{{item.createUserName || "-"}} - {{item.deptNameCz}}</span>
                        </div>
                    </section>
                    <section  v-if="item.type === 2">
                        <div>
                            <h6 class="f16">转移</h6>
                        </div>
                        <div>
                            <span>转移人：</span>
                            <span>{{item.createUserName || "-"}}({{item.mobilePhone}}) - {{item.deptNameZy}}</span>
                        </div>
                        <div>
                            <span>转移状态：</span>
                            <span>{{ !item.transferState ? "好" : "有损" || "-"}}</span>
                        </div>

                        <div>
                            <span>接收人：</span>
                            <span>{{item.receivePersonName || "-"}} - {{item.deptNameCz}}</span>
                        </div>
                        
                        <div>
                            <span>是否确认接收：</span>
                            <span>{{item.confirmReceipt ? "是" : "否" || "-"}}</span>
                        </div>
                        

                    </section>
                    

                    
                </div>

                <div v-if="item.imgUrl" class="img-box-item" v-previewer :style="{background: `url(${imagePath(item.imgUrl)}) no-repeat center center`,backgroundSize: 'cover'}">
                    <img :src="item.imgUrl | imagePath" alt="" srcset="">
                </div>
            </div>
        </div>
        <div class="bottom-div"></div>

        <div v-if="stage && !stage.length" class="tc mt30">暂无数据</div>

    </div>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { ToolsService } from "src/services";

@component
export default class SLStageView extends View
{
    @config({required: true, default: () => ({})})
    protected detail: any;

    @service("ToolsService")
    protected testPaginTableService: ToolsService;
    protected imagePath = imagePath;

    protected stage: any = [];

    @watch("detail",{immediate: true,deep: true})
    protected onChange(val)
    {
        this.getLyghjl();
    }

    protected async getLyghjl()
    {
        let content = await this.testPaginTableService.getLyghjl({toolsInstrumentId: this.detail.id});
        this.stage = content;
    }
}
</script>

<style lang="less" scoped>
.main
{
    padding-right: 30px;
    .header
    {
        width: 300px;
        height: 56px;
        line-height: 56px;
        background: rgba(79, 207, 102, 0.04);
        border: 1px solid #4FCF66;
        border-radius: 4px;
        color: #182334;
        margin-top: 28px;
        margin-bottom: 40px;
        span:nth-child(1)
        {
            margin-left: 25px;
        }
        span:nth-child(2)
        {
            font-weight: bold;
            color: rgb(255, 77, 63);
        }
    }
    .content
    {
        display: flex;
        .time
        {
            width: 150px;
            flex-basis: 150px;
            min-width: 150px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5D6673;
        }
        div
        {
            display: inline-block;
        }
        .time-line
        {
            margin-left: 10px;
            margin-right: 25px;
            display: flex;
            flex-direction: column;
            p:nth-child(1)
            {
                width: 10px;
                height: 10px;
                background: #4B7EFE;
                border-radius: 50%;
            }
            p:nth-child(2)
            {
                width: 2px;
                height: 220px;
                background: #E9EBEC;
                transform: translate(4px);
            }
        }
        .text-content
        {
            width: 100%;
            min-height: 94px;
            // background: #FBFCFE;
            // border: 1px solid #F2F5FA;
            border-radius: 4px;
            // padding-left: 24px;
            // padding-top: 23px;
            // margin-bottom: 50px;
            .text
            {
                width: 900px;
                div
                {
                    width: 100%;
                    margin-bottom: 20px;
                    span
                    {
                        font-weight: 400;
                    }
                    span:nth-child(1)
                    {
                        color: #A6ABB5;
                    }
                    span:nth-child(2)
                    {
                        color: #182334;
                    }
                }
            }
            p
            {
                img
                {
                    width: 165px;
                    height: 118px;
                }
                img:nth-child(1)
                {
                    margin-right: 20px;
                }
            }
        }
    }
    .bottom-div
    {
        height: 50px;
    }
    .img-box-item
    {
        flex-wrap: wrap;
        width: 210px;
        height: 120px;
        border-radius: 2px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 10px;
        background-size: cover !important;
        img
        {
            opacity: 0;
            width: 100%;
            height: 100%;
        }
        
    }
}
</style>