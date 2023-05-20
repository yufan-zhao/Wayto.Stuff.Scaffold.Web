<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加' : '修改'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="formRule" :model="formModelRule" :rules="formRules" v-show="isRule">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="分值名称：" prop="name" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModelRule.name"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="包含模块：" prop="infoIds" :label-width="100">
                            <i-select placeholder="请选择" multiple v-model="formModelRule.infoIds">
                                <i-option v-for="(item, i) in moduleList" :key="i" :value="item.id">{{item.name}}</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="权重：" prop="weight" :label-width="100">
                            <i-input placeholder="请输入" type="number" v-model="formModelRule.weight"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>

            <i-form class="customed-form" ref="formColor" :model="formModelColor" :rules="formColorRules" v-show="!isRule">
                <i-row>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="分数设置：" prop="scoreSetting" :label-width="100">
                            <!-- <i-input placeholder="请输入" v-model="formModelColor.scoreMinValue" style="width: 15%;margin-right:5px;"></i-input>
                            <i-input placeholder="请输入" v-model="formModelColor.scoreMinSign" style="width: 15%;"></i-input>
                            <span style="margin-left:10px;margin-right:10px;">总得分</span>
                            <i-input placeholder="请输入" v-model="formModelColor.scoreMaxValue" style="width: 15%;margin-right:5px;"></i-input>
                            <i-input placeholder="请输入" v-model="formModelColor.scoreMaxSign" style="width: 15%"></i-input> -->
                            <i-slider v-model="sliderValue" range @on-change="onSliderChange"></i-slider>
                            <div class="">{{sliderValueDisplay}}</div>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="得分名称：" prop="scoreName" :label-width="100">
                            <i-input placeholder="请输入" v-model="formModelColor.scoreName"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="代表颜色：" prop="color" :label-width="100">
                            <!-- <ux-color-picker v-model="formModelColor.colorStr"></ux-color-picker> -->
                            <i-color-picker v-model="formModelColor.color"></i-color-picker>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { EnumUtils } from "uxmid-core";
import CommonView from "src/views/common-view";
import { SPECIAL_RULE_COLOR } from "src/enums";
import { service } from "src/common/decorator";
import { SpecialRuleService, SpecialColorService } from "src/services";

/**
 * 项目综合得分规则弹层
 */
@component
export default class SpecialRuleGeneralModal extends CommonView
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    @service("SpecialColorService")
    private specialColorService: SpecialColorService;

    @config({required: true, type: Array, default: () => []})
    protected moduleList: Array<any>;

    protected get colorList()
    {
        return EnumUtils.getEntries(SPECIAL_RULE_COLOR);
    }

    protected sliderValue = [0, 0];

    protected get sliderValueDisplay()
    {
        let min = this.sliderValue[0];
        let max = this.sliderValue[1];
        let minSign = "≤";
        let maxSign = "<";

        if (max === 100)
        {
            maxSign = "≤";
        }

        return `${min} ${minSign} 总得分 ${maxSign} ${max}`;
    }

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
     * 是否是规则弹层
     * @property
     */
    protected isRule: boolean = false;

    /**
     * 规则表格值
     * @protected
     * @property
     */
    protected formModelRule: any =
    {
        id: undefined,
        name: "",
        weight: undefined,
        specialTypeId: undefined,
        infoIds: []
    };

    /**
     * 规则表格值
     * @protected
     * @property
     */
    protected formModelColor: any =
    {
        id: undefined,
        color: "",
        scoreName: "",
        scoreSetting: "",
        scoreMaxSign: "",
        scoreMaxValue: undefined,
        scoreMinSign: "",
        scoreMinValue: undefined
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
            {required: true, message: "分值名称不能为空"}
        ],
        weight:
        [
            {required: true, message: "权重不能为空"}
        ],
        infoIds:
        [
            {required: true, message: "模块不能为空"}
        ]
    };

    protected formColorRules: any =
    {

    };

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param isRule 是否是规则弹层还是颜色设置弹层
     * @member
     */
    public open(mode: string, isRule: boolean, specialTypeId: number, data: any)
    {
        this.isRule = isRule;
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            if (isRule)
            {
                this.$set(this.formModelRule, "specialTypeId", specialTypeId);
            }
        }
        else
        {
            // 更新
            if (isRule)
            {
                this.$set(this.formModelRule, "id", data.id);
                this.$set(this.formModelRule, "name", data.name);
                this.$set(this.formModelRule, "weight", data.weight);
                this.$set(this.formModelRule, "specialTypeId", data.specialTypeId);
                this.$set(this.formModelRule, "infoIds", data.infoIds.split(",").map(item => Number(item)));
            }
            else
            {
                this.$set(this.formModelColor, "id", data.id);
                this.$set(this.formModelColor, "color", data.color);
                this.$set(this.formModelColor, "scoreName", data.scoreName);
                this.$set(this.formModelColor, "scoreSetting", data.scoreSetting);
                this.$set(this.formModelColor, "scoreMaxSign", data.scoreMaxSign);
                this.$set(this.formModelColor, "scoreMaxValue", data.scoreMaxValue);
                this.$set(this.formModelColor, "scoreMinSign", data.scoreMinSign);
                this.$set(this.formModelColor, "scoreMinValue", data.scoreMinValue);
                // this.$set(this.sliderValue, 0, data.scoreMinValue);
                // this.$set(this.sliderValue, 1, data.scoreMaxValue);
                if (typeof data.scoreMinValue === "number" && typeof data.scoreMaxValue === "number")
                {
                    this.sliderValue = [data.scoreMinValue, data.scoreMaxValue];
                }
            }
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
            let $form = this.isRule ? this.$formRule : this.$formColor;
            $form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                    let data = JSON.parse(JSON.stringify(this.isRule ? this.formModelRule : this.formModelColor));
                    if (this.mode === this.modeList[0])
                    {
                        if (this.isRule)
                        {
                            // await this.specialRuleService.insertGeneralRule(data.specialTypeId, data.name, Number(data.weight), data.infoIds);
                        }
                        else
                        {
                            await this.specialColorService.insert({param: data});
                        }
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        if (this.isRule)
                        {
                            // await this.specialRuleService.updateGeneralRule(data.id, data.specialTypeId, data.name, Number(data.weight), data.infoIds);
                        }
                        else
                        {
                            await this.specialColorService.update({param: data});
                        }
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
        if (this.isRule)
        {
            this.$set(this.formModelRule, "id", undefined);
            this.$set(this.formModelRule, "name", "");
            this.$set(this.formModelRule, "weight", undefined);
            this.$set(this.formModelRule, "specialTypeId", undefined);
            this.$set(this.formModelRule, "infoIds", []);
            this.$formRule.resetFields();
        }
        else
        {
            this.$set(this.formModelColor, "id", undefined);
            this.$set(this.formModelColor, "color", "");
            this.$set(this.formModelColor, "scoreName", "");
            this.$set(this.formModelColor, "scoreSetting", "");
            this.$set(this.formModelColor, "scoreMaxSign", "");
            this.$set(this.formModelColor, "scoreMaxValue", undefined);
            this.$set(this.formModelColor, "scoreMinSign", "");
            this.$set(this.formModelColor, "scoreMinValue", undefined);
            this.sliderValue = [0, 0];
            this.$formColor.resetFields();
        }
        this.mode = this.modeList[0];
    }

    protected onSliderChange(value: any)
    {
        this.$set(this.formModelColor, "scoreMinValue", value[0]);
        this.$set(this.formModelColor, "scoreMaxValue", value[1]);
        this.$set(this.formModelColor, "scoreMinSign", "≤");
        this.$set(this.formModelColor, "scoreMaxSign", value[1] === 100 ? "≤" : "<");
    }

    /**
     * 表格ref
     * @private
     */
    private get $formRule(): any
    {
        return this.$refs["formRule"] as any;
    }

    private get $formColor(): any
    {
        return this.$refs["formColor"] as any;
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