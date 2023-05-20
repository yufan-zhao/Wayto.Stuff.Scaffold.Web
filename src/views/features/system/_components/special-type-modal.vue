<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加体系类型' : '修改体系类型'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="关联项目类型：" prop="specialTypeId" :label-width="140">
                            <i-select placeholder="请输入" v-model="formModel.specialTypeId">
                                <i-option v-for="(item, i) in specialTypeList" :key="i" :value="item.id">{{item.name}}</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="体系类型名称：" prop="name" :label-width="140">
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
import { SpecialType } from "src/models";

@component
export default class SpecialNodeModal extends CommonView
{
    /**
     * 待关联的体系类型列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialTypeList: Array<SpecialType>;

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
        name: "",
        specialTypeId: undefined,
        customerId: undefined
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
            {required: true, message: "体系名称不能为空"}
        ],
        specialTypeId:
        [
            {required: true, message: "关联体系不能为空"}
        ]
    };

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param customerId
     * @member
     */
    public open(mode: string, customerId: number)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            this.$set(this.formModel, "customerId", customerId);
        }
        else
        {
            console.warn("此弹层没有更新方法");
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
                        await this.insert(data.customerId, data.specialTypeId, data.name);
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        console.warn("此弹层没有更新方法");
                        // await this.update(data);
                        // this.$message.success("更新成功");
                    }
                }
                catch (err)
                {
                    this.$message.error(err.message || err.msg);
                }
                finally
                {
                    onValidateFailed();
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
        this.$set(this.formModel, "customerId", undefined);
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