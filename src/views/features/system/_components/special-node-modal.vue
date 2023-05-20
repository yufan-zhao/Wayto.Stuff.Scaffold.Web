<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加体系' : '修改体系'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="体系名称：" prop="name" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModel.name"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="应得分：" prop="deservedScore" :label-width="100">
                            <i-input placeholder="请输入" type="number" v-model="formModel.deservedScore"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item class="customed-form-item" label="权重：" prop="weight" :label-width="100">
                            <i-input placeholder="请输入" type="number" v-model="formModel.weight">
                                <span slot="append">%</span>
                            </i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="体系编号：" prop="code" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModel.code"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="备注：" prop="remark" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModel.remark"></i-input>
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
import { SpecialNode } from "src/models";

@component
export default class SpecialNodeModal extends CommonView
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
    protected formModel: SpecialNode =
    {
        id: undefined,
        parentId: undefined,
        deservedScore: undefined,
        name: "",
        code: "",
        weight: undefined,
        level: undefined,
        specialTypeId: undefined,
        remark: ""
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
        deservedScore:
        [
            // {required: true, message: "应得分不能为空"},
            {
                validator: (rule, value, callback) =>
                {
                    let target = value ? Number(value) : undefined;
                    if (typeof target === "number")
                    {
                        if (target <= 0)
                        {
                            callback(new Error("应得分不能小于0"));
                        }
                    }

                    callback();
                },
                trigger: "blur"
            }
        ],
        weight:
        [
            // {required: true, message: "权重不能为空"},
            {
                validator: (rule, value, callback) =>
                {
                    let target = value ? Number(value) : undefined;
                    if (typeof target === "number")
                    {
                        if (target <= 0)
                        {
                            callback(new Error("权重不能小于0"));
                        }
                    }

                    callback();
                },
                trigger: "blur"
            }
        ],
        code:
        [
            {required: true, message: "体系编码不能为空"}
        ]
    };

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param specialTypeId
     * @param level
     * @param parentId
     * @param data 新增时是父节点对象，如果为空表示父节点是根节点；编辑时是当前节点对象，前面几个参数无效
     * @member
     */
    public open(mode: string, specialTypeId: number, level: number, parentId: number, data: SpecialNode)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "parentId", parentId);
            this.$set(this.formModel, "level", level);
            this.$set(this.formModel, "specialTypeId", specialTypeId);
        }
        else
        {
            // 更新
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "name", data.name);
            this.$set(this.formModel, "code", data.code);
            this.$set(this.formModel, "deservedScore", data.deservedScore);
            this.$set(this.formModel, "weight", data.weight);
            this.$set(this.formModel, "parentId", data.parentId);
            this.$set(this.formModel, "level", data.level);
            this.$set(this.formModel, "specialTypeId", data.specialTypeId);
            this.$set(this.formModel, "remark", data.remark);
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
                        const res = await this.insert(data);
                        this.$message.success("新增成功");
                        data.id = res.content.id;
                        this.$emit("on-local-update", "insert", data);
                    }
                    else
                    {
                        await this.update(data);
                        this.$message.success("更新成功");
                        this.$emit("on-local-update", "update", data);
                    }
                    this._systemNodeItemModal.close();
                }
                catch (err)
                {
                    this.$message.error(err.message || err.msg);
                    onValidateFailed();
                }
                
                // this.$emit("on-refresh");
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