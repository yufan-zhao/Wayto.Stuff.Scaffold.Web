<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="566"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item prop="commonFileId" class="customed-form-item" label="" :label-width="35">
                            <u-upload-file-list
                                v-model="formModel.fileIdList"
                                :maxLength="1"
                                class="common-File-Id"
                            >
                            </u-upload-file-list>
                        </i-form-item>
                    </i-col>
                    
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends View
{
    
    /**
     * 修改接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected update: Function;

    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "";

    /**
     * 表单对象
     * @protected
     * @property
     */
    protected formModel: any =
    {
        fileIdList: [],
        id: undefined
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {

    };

    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        
        // 更新
        this.title = "上传文件";
        this.formModel.id = data.id;
       
        this._curdModal.open();
    }

    /**
     * 弹层操作事件
     * @param type 操作方式
     */
    protected onOps(type: string, onValidateFailed: Function)
    {
        if (type === "submit")
        {
            if(!this.formModel.fileIdList.length)
            {
                this.$message.warning("请选择文件");
                return;
            }
            this._form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                   
                    // 更新
                    let data =
                    {
                        param:
                        {
                            consultId: this.formModel.id
                        },
                        paramExt:
                        {
                            fileIds: this.formModel.fileIdList.map(item => item.id)
                        }
                    };
                    await this.update(data);
                    this.$message.success("提交成功");
                    
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                    onValidateFailed();
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
        this.formModel = {};
        this._form.resetFields();
    }

    /**
     * 表格ref
     * @private
     */
    protected get _form(): any
    {
        return this.$refs["form"] as any;
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
}
</script>

<style lang="less" scoped>
.customed-form
{
    padding: 30px 30px 0 5px;
}
.common-File-Id
{
    /deep/.upload-action 
    {
        .button
        {
            font-size: 14px !important;
            height: 34px !important;
            padding: 0 15px !important;
            line-height: 34px !important;
        }
        
    }
}
</style>