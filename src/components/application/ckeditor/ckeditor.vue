<template>
    <ckeditor
        type="classic" 
        v-model="textValue"
        :config="config"
        @ready="onReady"
    >
    </ckeditor>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-web";
import UploadAdapter from "./upload-adapter";

@component
export default class CkEditorBase extends View
{
    // prop 传入的上传方法
    @config({required: false})
    private service: any;
    // prop 传入的value值用于初始化
    @config({required: true, type: String, default: "" })
    private value: string;
    // prop 传入的只读标识
    @config({required: false, type: Boolean, default: false })
    private readonly: boolean;
    // prop 传入的工具栏
    // "imageUpload", "heading", "bold", "blockQuote", "numberedList", "bulletedList"
    @config({required: false, type: Array, default: () => ["heading", "bold", "blockQuote", "numberedList", "bulletedList"] })
    private toolBar: Array<any>;

    // 初始化后的实例
    private instance: any;
    // 绑定的输入值
    private textValue: string = "";
    // ckeditor配置
    // private config: any =
    // {
    //     toolbar: this.toolBar,
    //     language: "zh-cn"
    // };

    // ckeditor配置
    private get config(): any
    {
        return {
            toolbar: this.toolBar,
            language: "zh-cn"
        };
    }

    // 组件绑定值变换监听，变化时出发input事件
    @watch("textValue", {immediate: true})
    protected textValueWatcher(newVal)
    {
        // console.log("textValue changed", newVal);
        this.$emit("input", newVal);
    }
    // 组件传入porp的value值
    @watch("value", {immediate: true})
    protected inputValueWatcher(newVal)
    {
        // console.log("value", newVal);
        this.textValue = newVal;
    }
    // 组件传入porp的readonly值
    @watch("readonly", {immediate: true})
    protected readonlyWatcher(newVal)
    {
        // console.log("readonly", newVal);
        if (!this.instance) return;
        this.instance.isReadOnly = newVal; // 显式设置
    }

    /**
     * 创建ckeditor实例就绪监听
     */
    protected onReady(instance)
    {
        this.instance = instance;
        this.instance.isReadOnly = this.readonly;
        const fileRepository = this.instance.plugins.get("FileRepository");
        fileRepository.createUploadAdapter = loader => new UploadAdapter(loader, this.service);
    }

}
</script>

<style lang="less">
.ck.ck-content
{
    ul
    {
        margin-left: 20px;
        list-style: disc;
    }
    ol
    {
        margin-left: 20px;
        list-style: decimal;
    }
}
</style>
