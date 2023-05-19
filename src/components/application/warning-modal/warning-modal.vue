<template>
    <i-modal
        class="warning-modal"
        :width="460"
        :closable="false"
        v-model="isOpen"
        :z-index="1500"
    >
        <div class="warning-container">
            <p class="title">{{config.title}}</p>
            <p class="content">
                <Icon size="20" type="ios-alert" />
                <span class="label">{{config.content}}</span>
            </p>
        </div>
        <div class="footer" slot="footer">
            <i-button type="info" @click="onCancel">取消</i-button>
            <i-button type="primary" @click="onSubmit">确定</i-button>
        </div>
    </i-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";

@component
export default class WarningModal extends View
{
    /**
     * 弹层是否打开
     * @protected
     * @returns {boolean}
     */
    protected isOpen: boolean = false;

    /**
     * 保存按钮是否正在加载
     * @protected
     * @returns {boolean}
     */
    protected isLoading: boolean = false;

    /**
     * 弹层配置
     * @protected
     * @returns {Object}
     */
    protected config: any = {};

    /**
     * 弹层打开方法
     * @protected
     * @param config 弹层配置 title content文字描述 onOk 确定回调函数
     * @returns {void}
     */
    public open(config: any): void
    {
        this.config = config;
        this.isOpen = true;
    }

    /**
     * 取消事件
     * @protected
     * @returns {void}
     */
    protected onCancel(): void
    {
        this.close();
    }

    /**
     * 确定事件
     * @protected
     * @returns {void}
     */
    protected onSubmit(): void
    {
        this.close();
        this.$emit("on-ok");
        if (typeof this.config.onOk === "function")
        {
            this.config.onOk();
        }
    }

    /**
     * 弹层关闭方法
     * @protected
     * @returns {void}
     */
    protected close(): void
    {
        this.isOpen = false;
        this.isLoading = false;
    }
}
</script>

<style lang="less" scoped>
.warning-modal
{
    @{deep}.ivu-modal-body
    {
        padding: 0;

        .warning-container
        {
            padding: 30px;

            .title
            {
                font-size: 18px;
                line-height: 18px;
                font-weight: bold;
                color: #182334;
                margin-bottom: 20px;
            }
            .content
            {
                display: flex;
                font-size: 14px;
                line-height: 14px;
                color: #182334;

                i
                {
                    padding-top: 2px;
                    color: #FAAD14;
                    margin-right: 6px;
                }
                .label
                {
                    line-height: 24px;
                }
            }
        }
    }

    @{deep}.ivu-modal-footer
    {
        border: none;
        padding: 8px 30px 30px 30px;

        button
        {
            margin-left: 20px;
        }
    }
}
</style>
