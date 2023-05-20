<template>
    <div class="main pt30">
        <div class="content" v-for="item in stage" :key="item.id">
            <div class="time">{{item.createTime}}</div>
            <div class="time-line">
                <p></p>
                <p :style="{ height: item === 2 ? '134px' : '278px' }"></p>
            </div>
            <div class="text-content">
                <div class="text" v-if="!item.status">
                    <div>
                        <span>申请人：</span>
                        <span>{{item.operator || "-"}}</span>
                    </div>
                    <div>
                        <span>诊治计划日期：</span>
                        <span>{{item.consultTimeOld || "-"}} {{ !item.timeMarkOld ? "上午" : "下午"}}</span>
                    </div>
                    <div>
                        <span>诊治调整日期：</span>
                        <span>{{item.consultTimeUpdate || "-"}} {{ !item.timeMarkUpdate ? "上午" : "下午"}}</span>
                    </div>
                    <div>
                        <span>调整原因：</span>
                        <span>{{item.cause || "-"}}</span>
                    </div>

                    <div class="btn">
                        <i-button type="info" @click="confirmBtn(item,false)">不同意</i-button>
                        <i-button type="primary" @click="confirmBtn(item,true)" class="ml10">同意</i-button>
                    </div>
                </div>
                    
                <div class="text" v-if="item.status">
                    <div>
                        <span>申请人：</span>
                        <span>{{item.operator || "-"}}</span>
                    </div>
                    <div>
                        <span>诊治计划日期：</span>
                        <span>{{item.consultTimeOld || "-"}}{{!item.timeMarkOld ? "上午" : "下午"}}</span>
                    </div>
                    <div>
                        <span>调整原因：</span>
                        <span>{{item.cause || "-"}}</span>
                    </div>
                    <div>
                        <span>诊治调整日期：</span>
                        <span>{{item.consultTimeUpdate || "-"}}{{ item.timeMarkUpdate ? "下午" : "上午"}}</span>
                    </div>
                    <div v-if="item.operatingData">
                        <span>操作人：</span>
                        <span>{{item.operatingData && item.operatingData.operator || "-"}}</span>
                    </div>
                    <div v-if="item.status">
                        <span>操作：</span>
                        <span>{{item.status === 1?  "不同意" : "同意"}}</span>
                    </div>
                    <div v-if="item.operatingData">
                        <span>操作日期：</span>
                        <span>{{item.operatingData && item.operatingData.createTime || "-"}}</span>
                    </div>
                    
                </div>
                <!-- <p v-if="item.commonFileList && item.commonFileList.length" v-previewer>
                    <template  v-for="val in item.commonFileList">
                        <img  v-if="inputType.indexOf(val.fileSuffix) !== -1" :src="imagePath(val.filePath)" :key="val.id + 's'"/>

                        <video class="mr20" width="165"  v-else height="118" controls :key="val.id + 'v'">
                            <source :src="imagePath(val.filePath)" type="video/mp4">
                            <source :src="imagePath(val.filePath)" type="video/ogg">
                            您的浏览器不支持 video 标签。
                        </video>

                    </template>
                </p> -->
            </div>
        </div>
        <div class="bottom-div"></div>

        <div v-if="stage && !stage.length" class="tc mt30">暂无数据</div>

        <confirm-modal
            ref="confirmModal"
            :insert="postponeService.insert.bind(postponeService)"
            @on-refresh="getList(detail.id)"
        >
        </confirm-modal>

    </div>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, watch, config } from "uxmid-vue-web";
import { PostponeService } from "src/services";
import { service } from "src/common/decorator";
import ConfirmModal from "../_components/confirm-modal.vue";
@component({
    components:
    {
        ConfirmModal
    }
})
export default class InfoView extends View
{
    @service("PostponeService")
    protected postponeService: PostponeService;

    @config({required: true, default: () => ({})})
    protected detail: any;

    protected imagePath = imagePath;

    protected stage: any = [];

    @watch("detail",{immediate: true,deep: true})
    protected onChange(val)
    {

        this.stage = [];

        this.getList(val.id);

    }

    protected async getList(parentId)
    {
        // ,type: false
        this.stage = await this.postponeService.list({parentId,type: false});
        // this.stage = [{}];
    }

    protected async confirmBtn(item,type)
    {
        if(type)
        {
            try {
                let param: any =
                    {
                        cause: null,
                        type: true,
                        parentId: item.id,
                        // id: item.id,
                        status: 2
                    };
                await this.postponeService.insert({param});

                this.$Message.success("提交成功");
            } catch (error) {
                this.$Message.error("提交失败");
            }

            this.getList(this.detail.id);
        }
        else
        {
            this._confirmModal.open(item,this.detail.id);
        }
    }
    
    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _confirmModal(): ConfirmModal
    {
        return this.$refs["confirmModal"] as ConfirmModal;
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
            width: 120px;
            flex-basis: 120px;
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
            margin-left: 35px;
            margin-right: 42px;
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
                height: 278px;
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
            padding-left: 24px;
            padding-top: 23px;
            margin-bottom: 50px;
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
}
</style>