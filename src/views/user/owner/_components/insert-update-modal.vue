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
                    <i-col span="11">
                        <i-form-item class="customed-form-item" label="头像" :label-width="95">
                            <u-upload-image v-model="localAvatar" :maxLength="1"></u-upload-image>
                        </i-form-item>
                    </i-col>
                    <i-col span="13">
                        <i-form-item class="customed-form-item" label="app照片水印Logo" :label-width="130">
                            <u-upload-image v-model="logoAvatar" :maxLength="1"></u-upload-image>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" prop="deptName" label="单位名称" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.deptName"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" prop="customerNum" label="单位编码" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.customerNum"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="账号" prop="userName" :label-width="108">
                            <i-input placeholder="建议用手机号作为账号" v-model="formModel.userName" :disabled="!!formModel.id"></i-input>
                            <p class="f12 font-offline">默认密码为：123456</p>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="邮箱" prop="email" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.email"></i-input>
                            <!-- <p class="f12 font-offline">默认密码为：123456</p> -->
                        </i-form-item>
                    </i-col>
                    
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="项目对接人" prop="responsible" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.responsible"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="对接人电话" prop="mobilePhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.mobilePhone" :maxLength="11"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="合同" prop="contract" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.contract"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="合同类型" prop="contractTypeId" :label-width="108">
                            <i-select  v-model="formModel.contractTypeId" maxlength="20">
                                <i-option v-for="item in selectListObj.contractList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                            </i-select> 
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
import dayjs from "dayjs";
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
    protected logoAvatar: Array<any> = [];

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
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Object})
    protected selectListObj: any;

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
    protected formModel: any = {enable: true,imgUrl: undefined,imgId: undefined, sex: 1};

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        deptName: [{required: true, message: "请输入正确的单位名称	"}],
        userName: [{required: true, message: "请输入正确的账号", pattern: patterns["character"]}],
        customerNum: [{required: true, message: "请输入正确的单位编码", pattern: patterns["character"]}],
        contract: [{required: true, message: "请输入正确的合同名称"}],
        // mobilePhone: [{required: true, message: "请输入正确的电话",pattern: patterns["mobile"]}],
        email: [{required: false, message: "请输入正确的邮箱",pattern: patterns["email"]}],
        contractTypeId: [{required: true, message: "请选择合同类型"}]
        // responsible: [{required: true, message: "请输入正确的项目对接人"}]
    };
    
    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        if (data && data.id)
        {
            console.log(data);
            
            // 更新
            this.title = "编辑";
            this.formModel = data;
            this.localAvatar = data.imgId && data.headImgFile && [{id: data.imgId, filePath: data.headImgFile.filePath}] || [];
            this.logoAvatar = data.logoUrl && [{id: 0, filePath: data.logoUrl}] || [];
        }
        else
        {
            // 新增
            this.title = "新增";
            this.formModel = {enable: true,imgUrl: undefined,imgId: undefined, sex: 1};
            this.formModel.id = undefined;
            this.localAvatar = [];
            this.logoAvatar = [];
        }
        this._curdModal.open();
    }

    protected change(bool)
    {
        this.formModel.enable = bool;
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
     * 监听头像 处理参数
     * @public
     */
    @watch("logoAvatar",{immediate: true})
    protected changeLogoAvatar(val)
    {
        if(val[0])
        {
            // this.formModel.logoId = val[0].id;
            this.formModel.logoUrl = val[0].filePath;
        }
        else
        {
            // this.formModel.imgId = undefined;
            this.formModel.logoUrl = undefined;
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
                        
                    let paramExt =
                    {
                        enable: JSON.parse(JSON.stringify(this.formModel)).enable
                    };

                    delete param.enable;

                    param.birthday = dayjs(param.birthday).format("YYYY-MM-DD");

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