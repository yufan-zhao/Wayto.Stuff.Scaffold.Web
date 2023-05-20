<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="836"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="头像" :label-width="95">
                            <u-upload-image v-model="localAvatar" :maxLength="1"></u-upload-image>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" prop="constructionName" label="施工单位名称" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.constructionName"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="账号" prop="userName" :label-width="108">
                            <i-input placeholder="建议用手机号作为账号" v-model="formModel.userName" :disabled="!!formModel.id"></i-input>
                            <p class="f12 font-offline">默认密码为：123456</p>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="项目经理" prop="manager" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.manager"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="电话" prop="managerPhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.managerPhone"></i-input>
                        </i-form-item>
                    </i-col>
                    
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="安全总监/经理" prop="charger" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.charger"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="电话" prop="principalPhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.principalPhone"></i-input>
                        </i-form-item>
                    </i-col>

                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="监理单位名称" prop="supervisionDept" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.supervisionDept"></i-input>
                        </i-form-item>
                    </i-col>

                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="项目总监" prop="engineer" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.engineer"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="电话" prop="directorPhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.directorPhone"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="安全专监" prop="" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.safetyName"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="电话" prop="safetyPhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.safetyPhone"></i-input>
                        </i-form-item>
                    </i-col>
                    
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="账号状态" prop="enable" :label-width="108">
                            <i-switch  @on-change="change"  v-model="formModel.enable"/>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import patterns from "src/common/utils/patterns";
import { component, View, mixins, config, watch } from "uxmid-vue-web";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends View
{
    /**
     * 由于头像组件问题 中间转一层
     * @protected
     * @property
     */
    protected localAvatar: Array<any> = [];

    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected insert: Function;
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
    protected formModel: any = {enable: true, imgUrl: undefined,imgId: undefined};

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        constructionName: [{required: true, message: "请输入施工单位名称"}],
        supervisionDept: [{required: true, message: "请输入监理单位名称"}],
        userName: [{required: true, message: "请输入正确的账号", pattern: patterns["character"]}],
        // manager: [{required: true, message: "请输入正确的项目经理名称"}],
        managerPhone: [{required: false, message: "请输入电话号码",pattern: patterns["mobile"]}],
        // engineer: [{required: true, message: "请输入正确的总监理工程师名称"}],
        directorPhone: [{required: false, message: "请输入电话号码",pattern: patterns["mobile"]}],
        safetyPhone: [{required: false, message: "请输入电话号码",pattern: patterns["mobile"]}],
        // charger: [{required: true, message: "请输入正确的负责人名称"}],
        principalPhone: [{required: false, message: "请输入电话号码",pattern: patterns["mobile"]}]

    };

    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        if (data && data.id)
        {
            // 更新
            this.title = "编辑";
            this.formModel = data;
            this.localAvatar = data.imgId && [{id: data.imgId, filePath: data.headFilePath }] || [];
        }
        else
        {
            // 新增
            this.title = "新增";
            this.formModel = {enable: true,imgUrl: undefined,imgId: undefined};
            this.formModel.id = undefined;
            this.localAvatar = [];
        }
        this._curdModal.open();
    }
    
    protected change()
    {
        //
    }

    /**
     * 监听头像 处理参数
     * @public
     */
    @watch("localAvatar",{immediate: true})
    protected changeLocalAvatar(val)
    {
        if(val[0])
        {
            this.formModel.imgId = val[0].id;
            this.formModel.imgUrl = val[0].filePath;
        }
        else
        {
            this.formModel.imgId = undefined;
            this.formModel.imgUrl = undefined;
        }
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
                    let param = JSON.parse(JSON.stringify(this.formModel));
                    let paramExt = {enable: JSON.parse(JSON.stringify(this.formModel)).enable};
                    delete param.enable;

                    if (this.formModel.id)
                    {
                        // 更新
                        await this.update({param,paramExt});
                        this.$message.success("编辑成功");
                    }
                    else
                    {
                        // 新增
                        await this.insert({param,paramExt});
                        this.$message.success("新增成功");
                    }
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
                    this.onClosed();
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