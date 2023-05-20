<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="title"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" :label="isPositive ? '加分项：' : '减分项：'" prop="details" :label-width="100">
                            <i-input placeholder="请输入" type="textarea" v-model="formModel.details"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="分值：" prop="score" :label-width="100">
                            <i-input placeholder="请输入" type="number" v-model="formModel.score"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="评分标准：" prop="standard" :label-width="100">
                            <i-input placeholder="请输入" type="textarea" v-model="formModel.standard"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="状态：" prop="state" :label-width="100">
                            <i-switch v-model="formModel.state"></i-switch>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialListItemService } from "src/services";
import { service } from "src/common/decorator";

@component
export default class SpecialRulePositiveNegativeItemModal extends CommonView
{
    @service("SpecialListItemService")
    private specialListItemService: SpecialListItemService;

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

    protected title: string = "";

    protected isPositive: boolean = false;

    /**
     * 表格值
     * @protected
     * @property
     */
    protected formModel: any =
    {
        id: undefined,
        details: "",
        listId: undefined,
        score: undefined,
        standard: "",
        state: true
    };

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        details:
        [
            {required: true, message: "分项名称不能为空"}
        ],
        score:
        [
            {required: true, message: "分值不能为空"}
        ],
        standard:
        [
            {required: true, message: "评分标准不能为空"}
        ]
    };

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @member
     */
    public open(mode: string, isPositive: boolean, data?: any, typeId?: number)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];
        this.isPositive = isPositive;

        if (mode === this.modeList[0])
        {
            // 新增
            this.title = isPositive ? "新增正面清单项" : "新增负面清单项";
            this.$set(this.formModel, "listId", typeId);
        }
        else
        {
            // 更新
            this.title = isPositive ? "编辑正面清单项" : "编辑负面清单项";
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "details", data.details);
            this.$set(this.formModel, "listId", data.listId);
            this.$set(this.formModel, "score", data.score);
            this.$set(this.formModel, "standard", data.standard);
            this.$set(this.formModel, "state", data.state);
        }

        this._systemNodeItemModal.open();
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
                        if (this.isPositive)
                        {
                            const res = await this.specialListItemService.insertPositiveItem(data);
                        }
                        else
                        {
                            const res = await this.specialListItemService.insertNegativeItem(data);
                        }
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        if (this.isPositive)
                        {
                            const res = await this.specialListItemService.updatePositiveItem(data);
                        }
                        else
                        {
                            const res = await this.specialListItemService.updateNegativeItem(data);
                        }
                        this.$message.success("更新成功");
                    }
                    this._systemNodeItemModal.close();
                }
                catch (err)
                {
                    this.$message.error(err.message || err.msg);
                    onValidateFailed();
                }
                
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
        this.$set(this.formModel, "name", "");
        this.$set(this.formModel, "code", "");
        this.$set(this.formModel, "deservedScore", undefined);
        this.$set(this.formModel, "weight", undefined);
        this.$set(this.formModel, "parentId", undefined);
        this.$set(this.formModel, "level", undefined);
        this.$set(this.formModel, "specialTypeId", undefined);
        this.$set(this.formModel, "remark", "");
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
.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>