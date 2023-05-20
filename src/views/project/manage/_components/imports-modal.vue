<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="'导入文件'"
        :width="588"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
    <template v-slot:content>
        <i-form ref="form" class="mt30">
            <i-row>
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="选择文件" :label-width="95">
                        <div class="modify-modal-body-top">
                            <i-button type="primary" class="select-input-box">
                                上传文件
                                <input type="file" @change="onGetGFile" ref="importInput" class="select-input"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                            </i-button>
                                
                            <span class="d-i ml10 font-main">{{model.fileName}}</span>
                            <p class="downTemplate cursor-pointer" @click="onFileDownload">下载模板</p>
                        </div>
                    </i-form-item>
                </i-col>
            </i-row>
            <div class="ml100">
                <p class="font-main">温馨提示：标红色的为必填项</p>
            </div>
        </i-form>
    </template>
        
    </u-crud-modal>
</template>
<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { FileUtils } from "src/common/utils";
import { ApplicationContext } from "src/application";

@component({
    components:
    {
    }
})
export default class ImportModal extends View
{
    /**
     * 导入接口
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected imports: Function;

    protected model: any =
    {
        file: null,
        fileName: ""
    };

    /**
     * 保存按钮锁
     * @protected
     * @property
     */
    protected loading: boolean = false;
    
    /**
     * 点击下载。
     * @protected
     * @returns {void}
     */
    public onFileDownload(link: string)
    {
        // FileUtils.downloadFile("./tempaltes.xlsx","人员模板");
        FileUtils.downloadFile(ApplicationContext.current.settings.mainOriginUrl + ApplicationContext.current.settings.mainPrefix + "/project/downloadProjectTemplate","项目导入模板");
        // require("assets/tempaltes.xls");
    }
    
    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        
        this._curdModal.open();
    }
    /**
     * 弹层实例
     * @private
     * @ref
     */
    protected get _curdModal(): any
    {
        return this.$refs["curdModal"] as any;
    }
    /**
     * 弹层实例
     * @private
     * @ref
     */
    protected get $importInput(): any
    {
        return this.$refs["importInput"] as any;
    }

    /**
     * 文件上传
     * @protected
     * @returns ovie
     */
    protected onGetGFile(e)
    {
        this.model.file = e.target.files;
        this.model.fileName = e.target.files[0].name;
    }

    /**
     * 弹层操作事件
     * @param type 操作方式
     */
    protected onOps(type: string, onValidateFailed: Function)
    {
        if (type === "submit")
        {
            this._form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                    // 导入
                    await this.imports(this.model.file);

                    this.$message.success("导入成功");
                    this.$emit("on-refresh");
                    
                    this._curdModal.close();
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                    // onValidateFailed();
                }
            });
        }
        else
        {
            this._curdModal.close();
        }
    }
    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.model.file = null;
        this.model.fileName = null;
        this._form.resetFields();
        this.$importInput.value = null;
    }

    /**
     * 表格ref
     * @private
     */
    protected get _form(): any
    {
        return this.$refs["form"] as any;
    }
}
</script>

<style lang="less">
    .select-input-box
    {
        position: relative;
        .select-input
        {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
</style>