<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="title"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="现场主要设备：" prop="content" :label-width="140">
                        <i-input placeholder="请输入" type="textarea" v-model="formModel.content"></i-input>
                    </i-form-item>
                </i-col>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";

@component
export default class ReportDeviceDangerModal extends View
{
    @config({required: true})
    protected insert: Function;

    @config({required: true})
    protected update: Function;

    /**
     * 诊治详情
     * @config
     */
    @config({required: false})
    protected consultDetail: any;

    /**
     * 0表示现场设备
     * 1表示现场风险
     */
    protected type: 0 | 1 = 0;

    protected title = "";

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
        consultPlanId: undefined,
        content: ""
    };

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        content:
        [
            {required: true, message: `${this.type === 0 ? "现场设备不能为空" : "现场风险不能为空"}`}
        ]
    };

    /**
     * 打开方法
     * @param mode 弹层模式 insert，update
     * @param type 0:现场设备 1:现场风险
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    public async open(mode: string, type: 0 | 1, data: any, consultPlanId: number)
    {
        this.type = type;
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];
        this.$set(this.formModel, "consultPlanId", consultPlanId);

        if (mode === this.modeList[0])
        {
            // 新增
            this.title = type === 0 ? "添加现场设备" : "添加现场风险";
            this._systemNodeItemModal.open();
        }
        else
        {
            this.title = type === 0 ? "编辑现场设备" : "编辑现场风险";
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "content", data.content);
            this._systemNodeItemModal.open();
        }
    }

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
                        await this.insert(data.consultPlanId, data.content);
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        await this.update(data.id, data.consultPlanId, data.content);
                        this.$message.success("修改成功");
                    }
                }
                catch (err)
                {
                    onValidateFailed();
                    this.$message.error(err.message || err.msg);
                }
                this._systemNodeItemModal.close();
                this.$emit("on-refresh");
            });
        }
        else
        {
            this._systemNodeItemModal.close();
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
        this.$set(this.formModel, "consultPlanId", undefined);
        this.$set(this.formModel, "content", "");
        this.mode = this.modeList[0];
        this.$form.resetFields();
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
    private get _systemNodeItemModal(): any
    {
        return this.$refs["systemNodeItemModal"] as any;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/group-form-inputs";

.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>