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
            <i-form class="customed-form" ref="form" :model="dataName" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item prop="mendDescription" class="customed-form-item" label="整改反馈" :label-width="120">
                            <i-input type="textarea" v-model="dataName.mendDescription" placeholder="请输入"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-col span="24">
                    <i-form-item prop="fileIdList" class="customed-form-item" label="整改照片" :label-width="120">
                        <u-upload-file-list
                            v-model="dataName.fileIdList"
                            :maxLength="9"
                           
                        >
                        </u-upload-file-list>
                            <!-- <u-upload-image v-model="fileIdList" :maxLength="9"></u-upload-image> -->

                    </i-form-item>
                </i-col>
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
export default class NoticModal extends View
{
    
    /**
     * 修改接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected update: Function;

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
    protected dataName: any =
    {
        fileIdList: []
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        mendDescription: [{required: true, message: "请输入整改反馈，如无意见则填写'无'"}]
    };

    protected options: any =
    {
        disabledDate (date)
        {
            return date && date.valueOf() < Date.now() - 86400000;
        }
    };

    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        if(data.mendInfo && data.mendInfo.id)
        {
            this.title = "编辑整改反馈";
            this.dataName = {
                id: data.mendInfo && data.mendInfo.id,
                checkInfoId: data.id,
                fileIdList: data.mendInfo && data.mendInfo.commonFileList || [],
                mendDescription: data.mendInfo && data.mendInfo.mendDescription || undefined
            };
        }
        else
        {
            this.title = "添加整改反馈";
            this.dataName = {
                id: undefined,
                checkInfoId: data.id,
                fileIdList: [],
                fileIds: [],
                mendDescription: undefined
            };
        }
       
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
                    let param =
                    {
                        id: this.dataName.id,
                        checkInfoId: this.dataName.checkInfoId,
                        fileIds: this.dataName.fileIdList.map(item => item.id),
                        mendDescription: this.dataName.mendDescription
                    };
                    if (this.dataName.id)
                    {
                            await this.update({param});
                            this.$message.success("提交成功");
                    }else
                    {
                            await this.insert({param});
                            this.$message.success("提交成功");
                    }
                    // 更新
                    this.$emit("on-refresh");
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
        // this.formModelData = {};
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