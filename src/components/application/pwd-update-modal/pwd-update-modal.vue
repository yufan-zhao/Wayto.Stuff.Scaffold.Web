<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="536"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="旧密码：" prop="oldPwd" :label-width="108">
                            <i-input placeholder="请输入登录密码" v-model="formModel.oldPwd" type="password"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="新密码：" prop="newPwd" :label-width="108">
                            <i-input placeholder="请输入新密码" v-model="formModel.newPwd" type="password"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="重复新密码：" prop="validatePwd" :label-width="108">
                            <i-input placeholder="请重复输入新密码" v-model="formModel.validatePwd" type="password"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { Broadcast, BroadcastManager, Application, Map } from "uxmid-core";
import CommonView from "src/views/common-view";
import { BroadcastChannels } from "src/broadcasts";
import { UserService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class PwdUpdateModal extends CommonView
{
    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "修改密码";

    /**
     * 表单
     * @property
     */
    protected formModel: any =
    {
        oldPwd: "",
        newPwd: "",
        validatePwd: ""
    };

    /**
     * 校验规则
     * @property
     */
    protected rules: any =
    {
        oldPwd: [{required: true, message: "请输入登录密码"}],
        newPwd: [{required: true, message: "请输入新密码"}],
        validatePwd: [
            {required: true, message: "请再次输入新密码"},
            {
                required: true,
                validator: (rule, value, callback) =>
                {
                    if (value === this.formModel.newPwd)
                    {
                        callback();
                    }
                    else
                    {
                        callback(new Error("新密码不一致"));
                    }
                }
            }
        ]
    };

    /**
     * 打开方法
     * @public
     */
    public open()
    {
        this.$curdModal.open();
    }

    protected onOps(type: string, onValidateFailed: Function)
    {
        if (type === "submit")
        {
            // 提交
            this._form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                    const userSerivce = this.applicationContext.serviceProvider.resolve<UserService>(UserService);
                    await userSerivce.editCurrentUserPassword(this.formModel.newPwd, this.formModel.oldPwd);
                    this.$message.success("修改成功");
                    setTimeout(() =>
                    {
                        // 登出
                        const broadcastMsg = new Broadcast(BroadcastChannels.LOGOUT);
                        BroadcastManager.instance.send(broadcastMsg);
                    }, 500);
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
            this.$curdModal.close();
        }
    }

    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.formModel.oldPwd = "";
        this.formModel.newPwd = "";
        this.formModel.validatePwd = "";

        this._form.resetFields();
    }

    /**
     * 表格ref
     * @private
     */
    private get _form(): any
    {
        return this.$refs["form"] as any;
    }

    /**
     * 弹层实例
     * @private
     * @ref
     */
    private get $curdModal(): any
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
