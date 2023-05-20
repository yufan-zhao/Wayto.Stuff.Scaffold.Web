<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加问题描述' : '修改问题描述'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-form-item class="customed-form-item" label="问题描述：" prop="questionDescription" :label-width="140">
                    <i-input placeholder="请输入" type="textarea" v-model="formModel.questionDescription"></i-input>
                </i-form-item>
                <i-form-item class="customed-form-item" label="问题隐患等级：" prop="hazardLevel" :label-width="140">
                    <i-select placeholder="请选择" v-model="formModel.hazardLevel">
                        <i-option v-for="(item, i) in currentHazardLevel" :key="i" :value="item.id">{{item.levelNumber}}（{{item.content}}）</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item class="customed-form-item" label="扣分：" prop="deduction" :label-width="140">
                    <i-input placeholder="请输入" type="number" v-model="formModel.deduction"></i-input>
                </i-form-item>
                <i-form-item class="customed-form-item" label="整改建议：" prop="rectifyDescription" :label-width="140">
                    <i-input placeholder="请输入" type="textarea" v-model="formModel.rectifyDescription"></i-input>
                </i-form-item>
                <i-form-item class="customed-form-item" label="整改时间：" prop="checkDay" :label-width="140">
                    <i-select placeholder="请输入" v-model="formModel.checkDay">
                        <i-option :value="0">无</i-option>
                        <i-option :value="1">1天</i-option>
                        <i-option :value="3">3天</i-option>
                        <i-option :value="5">5天</i-option>
                        <i-option :value="7">7天</i-option>
                        <i-option :value="15">半个月</i-option>
                        <i-option :value="30">1个月</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item class="customed-form-item" label="状态：" prop="enable" :label-width="140">
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
export default class SpecialDangerModal extends CommonView
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

    @config({required: true, type: Array, default: () => []})
    protected hazardLevelList: Array<any>;

    protected get currentHazardLevel()
    {
        let result = this.hazardLevelList.filter(item =>
        {
            return this.parentHazardLevels.indexOf(item.id) >= 0;
        });
        return result;
    }

    protected parentHazardLevels: Array<number> = [];

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
        questionDescription: "",
        rectifyDescription: "",
        hazardLevel: undefined,
        deduction: undefined,
        enable: true,
        checkDay: undefined
    };

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        questionDescription:
        [
            {required: true, message: "隐患标准描述不能为空"}
        ],
        rectifyDescription:
        [
            {required: true, message: "标准整改建议不能为空"}
        ],
        hazardLevel:
        [
            {required: true, message: "隐患等级不能为空"}
        ],
        deduction:
        [
            {required: true, message: "扣分不能为空"}
        ],
        checkDay:
        [
            {required: true, message: "整改时间不能为空"}
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
                this._systemNodeItemModal.close();
                this.$emit("on-refresh", this.formModel.checkId);
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
        this.$set(this.formModel, "checkId", undefined);
        this.$set(this.formModel, "enable", true);
        this.$set(this.formModel, "questionDescription", "");
        this.$set(this.formModel, "rectifyDescription", "");
        this.$set(this.formModel, "hazardLevel", undefined);
        this.$set(this.formModel, "deduction", undefined);
        this.$set(this.formModel, "checkDay", undefined);
        this.mode = this.modeList[0];
        this.parentHazardLevels = [];
        this.$form.resetFields();
    }

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    protected open(mode: string, data: {parent: any; child: any}, checkId: number)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            this.parentHazardLevels = data.parent.dangerLevels;
            this.$set(this.formModel, "enable", true);
            this.$set(this.formModel, "checkId", checkId);
        }
        else
        {
            // 更新
            this.parentHazardLevels = data.parent.dangerLevels;
            this.$set(this.formModel, "id", data.child.id);
            this.$set(this.formModel, "checkId", checkId);
            this.$set(this.formModel, "enable", data.child.enable);
            this.$set(this.formModel, "questionDescription", data.child.questionDescription);
            this.$set(this.formModel, "rectifyDescription", data.child.rectifyDescription);
            this.$set(this.formModel, "hazardLevel", data.child.hazardLevel);
            this.$set(this.formModel, "deduction", data.child.deduction);
            this.$set(this.formModel, "checkDay", data.child.checkDay);
        }

        this._systemNodeItemModal.open();
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