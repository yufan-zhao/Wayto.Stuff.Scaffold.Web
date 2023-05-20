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
                    <i-col span="24" v-for="(item, i) in formModel.scoreList" :key="i">
                        <i-form-item class="customed-form-item" :label="item.name" :prop="'scoreList.'+i+'.weight'" :label-width="100" :rules="customRules1">
                            <i-input placeholder="请输入" type="number" v-model="item.weight"><span slot="append">%</span></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { SpecialRuleService } from "src/services";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class SpecialRuleGeneralAssignModal extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

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
    protected formModel: any =
    {
        scoreList: []
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {

    };

    protected customRules1: any =
    {
        validator: function(rule, value, callback)
        {
            value = Number(value);
            if (typeof value === "number" && (value >= 0 && value <= 100))
            {
                callback();
            }
            else
            {
                callback(new Error("分值权重必须大于等于0且小于等于100"));
            }
        }
    };

    protected scoreList: Array<any> = [];

    /**
     * 打开方法
     * @public
     */
    public open(data: any)
    {
        this.title = "权重分配";
        this.$set(this.formModel, "scoreList", data);
        this._curdModal.open();
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
                    let data = JSON.parse(JSON.stringify(this.formModel.scoreList));

                    // 校验
                    let totalWeight = 0;
                    data.forEach(item => {
                        totalWeight += Number(item.weight);
                    });
                    if (totalWeight !== 100)
                    {
                        onValidateFailed();
                        return this.$message.error("分值权重之和必须等于100");
                    }

                    // 调用更新权重
                    await this.specialRuleService.updateGeneralRuleWeight(data);
                    this.$message.success("操作成功");
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
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
        this._form.resetFields();

        this.$set(this.formModel, "scoreList", []);
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