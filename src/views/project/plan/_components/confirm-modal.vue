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
                        <i-form-item prop="cause" class="customed-form-item" label="理由" :label-width="140">
                            <i-input v-model="formModel.cause" placeholder="请输入" maxlength="255"/>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { component, View, mixins, config, watch } from "uxmid-vue-web";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class ConfirmModal extends View
{
    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected insert: Function;
   
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
    protected formModel: any = {};

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        // cause: [{required: true,message: "请输入不同意的理由"}]
        cause: [{required: true,message: "请输入反馈内容"}]
    };

    /**
     * 打开方法
     * @public
     */
    public open(data: any,parentId?)
    {
        this.title = "审批";
        this.formModel =
        {
            cause: null,
            type: true,
            parentId: data.id,
            // parentId,
            status: 1
        };
        
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
                    await this.insert({param: this.formModel});
                    
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
</style>