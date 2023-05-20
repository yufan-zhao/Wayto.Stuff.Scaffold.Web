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
                        <i-form-item class="customed-form-item" prop="name" label="姓名 " :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.name"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item prop="sex" class="customed-form-item" label="性别" :label-width="95">
                            <i-radio-group v-model="formModel.sex">
                                <i-radio :label="1" :value="1" :disabled="!!formModel.id">
                                    <span>男</span>
                                </i-radio>
                                <i-radio :label="0" :value="0" :disabled="!!formModel.id">
                                    <span>女</span>
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="电话" prop="mobilePhone" :label-width="108">
                            <i-input placeholder="请输入" v-model="formModel.mobilePhone" :maxLength="11"></i-input>
                            <!-- <p class="f12 font-offline">创建新用户时，第一次输入的手机号作为登录账号</p> -->
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="账号" prop="userName" :label-width="108">
                            <i-input placeholder="建议用手机号作为账号" v-model="formModel.userName" :disabled="!!formModel.id"></i-input>
                            <p class="f12 font-offline">默认密码为：123456</p>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="出生年月" prop="birthday" :label-width="108">
                            <i-date-picker type="date" @on-change="onBirthdayChange" v-model="formModel.birthday" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%"></i-date-picker>
                        </i-form-item>
                    </i-col>
                    
                    
                    
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="部门" prop="userGroupId" :label-width="108">
                            <i-cascader :data="selectListObj.orgRree" v-model="formModel.userGroupIds" change-on-select filterable @on-change="userGroupValueChange"></i-cascader>

                            <!-- <i-select  v-model="formModel.userGroupId" maxlength="20">
                                    <i-option v-for="item in [1,2,3,4]" :key="item" :value="item">{{item}}</i-option>
                                </i-select>  -->
                        </i-form-item>
                    </i-col>
                    
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="角色" prop="roleIds" :label-width="108">
                            <i-select  v-model="formModel.roleIds" maxlength="20">
                                <i-option v-for="item in selectListObj.roleList" :key="item.id" :value="item.id">{{item.name}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="所在组" prop="groupId" :label-width="108">
                            <i-select  v-model="formModel.groupId" maxlength="20">
                                <i-option v-for="item in selectListObj.groundName" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                            </i-select> 
                            <!-- <i-select  v-model="formModel.groupId" maxlength="20" >
                                <i-option v-for="item in [1,2,3,4]" :key="item" :value="item">{{item}}</i-option>
                            </i-select>  -->
                        </i-form-item>
                    </i-col>
                   
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="账号状态" prop="enable" :label-width="108">
                            <i-switch  @on-change="change" v-model="formModel.enable"/>
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

    @config({required: true, default: () => ({})})
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
        name: [{required: true, message: "请输入正确的姓名"}],
        userName: [{required: true, message: "请输入正确的账号", pattern: patterns["character"]}],
        mobilePhone: [{required: true, message: "请输入正确的电话",pattern: patterns["mobile"]}],
        userGroupIds: [{required: true, message: "请选择部门"}],
        roleIds: [{required: true, message: "请选择角色	"}],
        userGroupId: [{required: true, message: "请选择部门	"}],
        groupId: [{required: true, message: "请选择所在组"}]
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
            this.formModel.roleIds = [data.role];
            this.formModel.userGroupIds = [data.userGroupId];
            this.localAvatar = data.imgUrl && [{id: data.imgId, filePath: data.imgUrl}] || [];
            console.log(this.formModel.roleIds);
            
        }
        else
        {
            // 新增
            this.title = "新增";
            this.formModel = {enable: true,imgUrl: undefined,imgId: undefined, sex: 1};
            this.formModel.id = undefined;
            this.localAvatar = [];
        }
        this._curdModal.open();
    }

    protected userGroupValueChange(value: any, selectedData: any): void
    {
        this.formModel.userGroupId = value[value.length - 1];
    }

    protected change(bool)
    {
        this.formModel.enable = bool;
    }

    protected onBirthdayChange(val)
    {
        // console.log(val);
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
                        
                    let paramExt =
                    {
                        enable: JSON.parse(JSON.stringify(this.formModel)).enable,
                        roleIds: [JSON.parse(JSON.stringify(this.formModel)).roleIds],
                        userName: JSON.parse(JSON.stringify(this.formModel)).userName
                    };

                    delete param.enable;
                    delete param.roleIds;
                    delete param.userName;

                    if (param.birthday)
                    {
                        param.birthday = dayjs(param.birthday).format("YYYY-MM-DD");
                    }

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
        this.formModel = {enable: true,imgUrl: undefined,imgId: undefined, sex: 1};
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