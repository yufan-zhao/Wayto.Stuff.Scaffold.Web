<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加正负面清单类型' : '修改正负面清单类型'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="类型名称：" prop="name" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModel.name"></i-input>
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

/**
 * 正负面设置新增、编辑弹层
 */
@component
export default class SpecialRulePositiveNegativeTypeModal extends CommonView
{
    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected insert: Function;

    /**
     * 修改接口
     * @protected
     * @config
     */
    @config({required: false, type: Function})
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
        level: 1,
        name: "",
        specialTypeId: undefined,
        type: false
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
            {required: true, message: "正负面清单类型名称不能为空"}
        ]
    };

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param specialTypeId
     * @param data 新增时是父节点对象，如果为空表示父节点是根节点；编辑时是当前节点对象，前面几个参数无效
     * @member
     */
    public open(mode: string, specialTypeId: number, data: any, isPositive: boolean = false)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];
        this.$set(this.formModel, "type", !isPositive);

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "specialTypeId", specialTypeId);
            if (data)
            {
                this.$set(this.formModel, "parentId", data.id);
                this.$set(this.formModel, "level", data.level);
            }
            else
            {
                this.$set(this.formModel, "parentId", 0);
            }
        }
        else
        {
            // 更新
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "parentId", data.parentId);
            this.$set(this.formModel, "name", data.name);
            this.$set(this.formModel, "level", data.level);
            this.$set(this.formModel, "specialTypeId", data.specialTypeId);
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
        this.$set(this.formModel, "name", "");
        this.$set(this.formModel, "specialTypeId", undefined);
        this.$set(this.formModel, "level", 1);
        this.$set(this.formModel, "type", false);
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