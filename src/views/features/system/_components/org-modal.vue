<template>
    <u-crud-modal
        ref="orgModal"
        :title="mode === 'insert' ? '新建组织' : '编辑组织'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-form-item class="customed-form-item" label="组织名称：" prop="name" :label-width="100">
                    <i-input placeholder="请输入" v-model="formModel.name" :maxlength="20"></i-input>
                </i-form-item>
                <i-form-item class="customed-form-item" label="状态：" prop="enable" :label-width="100">
                    <i-switch v-model="formModel.enable"></i-switch>
                </i-form-item>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class OrgModal extends CommonView
{
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
     * 弹层模式列表
     * @property
     */
    protected modeList: Array<string> = ["insert", "update"];

    /**
     * 弹层模式
     * @property
     */
    protected mode: string = this.modeList[0];

    /**
     * 表格值
     * @protected
     * @property
     */
    protected formModel: any =
    {
        id: undefined,
        parentId: undefined,
        name: "",
        code: "",
        enable: true,
        children: undefined
    };

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        name:
        [
            {required: true, message: "组织名称不能为空"}
        ],
        status:
        [
            {required: false}
        ]
    };

    /**
     * 按钮操作
     * @protected
     * @member
     * @param opName submit - 提交  cancel - 取消
     */
    protected onOps(opName: string, onValidateFailed: Function)
    {
        if (opName === "submit")
        {
            this.$form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                    let data = JSON.parse(JSON.stringify(this.formModel));
                    if (this.mode === this.modeList[0])
                    {
                        await this.insert(data);
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        await this.update(data);
                        this.$message.success("更新成功");
                    }
                }
                catch (err)
                {
                    onValidateFailed();
                    this.$message.error(err.message || err.msg);
                }
                this.$orgModal.close();
                this.$emit("on-refresh");
            });
        }
        else
        {
            this.$orgModal.close();
        }
    }

    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.$set(this.formModel, "id", undefined);
        this.$set(this.formModel, "parentId", undefined);
        this.$set(this.formModel, "name", "");
        this.$set(this.formModel, "code", "");
        this.$set(this.formModel, "enable", true);
        this.$set(this.formModel, "children", undefined);
        this.mode = this.modeList[0];

        this.$form.resetFields();
    }

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    protected open(mode: string, data: any)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "parentId", data.id);
            this.$set(this.formModel, "enable", true);
        }
        else
        {
            // 更新
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "parentId", data.parentId);
            this.$set(this.formModel, "name", data.name);
            this.$set(this.formModel, "enable", data.enable);
            this.$set(this.formModel, "code", data.code);
        }

        this.$orgModal.open();
    }

    /**
     * 表格ref
     * @private
     */
    private get $form(): any
    {
        return this.$refs["form"] as any;
    }

    /**
     * 弹层ref
     * @private
     */
    private get $orgModal(): any
    {
        return this.$refs["orgModal"] as any;
    }

}
</script>

<style lang="less" scoped>
.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>