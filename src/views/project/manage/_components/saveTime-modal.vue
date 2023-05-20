<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="566"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item prop="beginDate" class="customed-form-item" label="安全工作开始时间" :label-width="140">
                            <i-date-picker type="date" v-model="formModel.beginDate" :options="options" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></i-date-picker>
                        </i-form-item>
                    </i-col>

                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="" :label-width="20">
                           <i-checkbox v-model="formModel.liability">出现重大责任问题</i-checkbox>
                        </i-form-item>
                    </i-col>
                    <i-col span="24"  v-if="formModel.liability">
                        <i-form-item  prop="makeZeroType" class="customed-form-item" label="" :label-width="20">
                            <i-radio-group v-model="formModel.makeZeroType">
                                <i-radio :value="1" :label="1">
                                    <span>归零重新计算</span>
                                </i-radio>
                                <i-radio :value="2" :label="2">
                                    <span>归零不再计算</span>
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { component, View, mixins, config, watch } from "uxmid-vue-web";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class SaveTimeModal extends View
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
    protected formModel: any = {};

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        makeZeroType: [{required: true,message: "请选择是否归零重新计算"}],
        beginDate: [{required: true,message: "请选择时间"}]
    };

    protected options: any =
    {
        disabledDate (date)
        {
            return date && date.valueOf() < Date.now() - 86400000;
        }
    };

    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        this.title = "安全工作计时";
        this.formModel =
        {
            projectId: data.id,
            id: data.saveProjectId || undefined,
            beginDate: data.saveProjectbeginDate || undefined,
            liability: data.saveProjectliability || false,
            makeZeroType: data.saveProjectmakeZeroType || undefined
        };
        console.log(data.beginDate);
        
        this.options =
        {
            disabledDate (date)
            {
                return date && dayjs(date.valueOf()).format("YYYY-MM-DD") < data.beginDate;
            }
        };
        
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
                    this.formModel.beginDate = dayjs(this.formModel.beginDate).format("YYYY-MM-DD");
                    if(this.formModel.id)
                    {
                        // 更新
                        await this.update({param: this.formModel});
                    }else
                    {
                        // 更新
                        await this.insert({param: this.formModel});
                    }
                    this.$message.success("提交成功");
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
        this.formModel = {};
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