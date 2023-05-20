<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加分值' : '修改分值'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="分值名称：" prop="scoreName" :label-width="140">
                        <i-input placeholder="请输入" v-model="formModel.scoreName"></i-input>
                    </i-form-item>
                    <i-form-item class="customed-form-item" label="类型：" prop="type" :label-width="140">
                        <i-select placeholder="请选择" v-model="formModel.type">
                            <i-option v-for="(item, i) in typeList" :key="i" :value="item.value">
                                {{item.alias}}
                            </i-option>
                        </i-select>
                    </i-form-item>
                </i-col>
                
                <i-col span="24">
                    <div class="group-form-view">
                        <div class="group-form-inputs" v-for="(item, i) in formModel.modules" :key="i">
                            <span class="delete-btn" @click="onGroupFormRemove(item, i)">
                                <Icon type="ios-remove" />
                            </span>

                            <i-row class="content">
                                <i-col span="24">
                                    <i-form-item class="customed-form-item" label="模块：" :label-width="140" :prop="'modules.'+i+'.moduleUuId'" :rules="customRules1">
                                        <i-select placeholder="请选择" v-model="item.moduleUuId" @on-change="onModuleChange(arguments, i)">
                                            <i-option v-for="(moduleItem, j) in moduleList" :key="'module-'+i + '-' + j" :value="moduleItem.uuId">{{moduleItem.name}}</i-option>
                                        </i-select>
                                    </i-form-item>
                                </i-col>
                                <i-col span="24">
                                    <i-form-item class="customed-form-item" label="模块权重：" :label-width="140" :prop="'modules.'+i+'.moduleWeight'" :rules="customRules2">
                                        <i-input placeholder="请输入" type="number" v-model="item.moduleWeight"><span slot="append">%</span></i-input>
                                    </i-form-item>
                                </i-col>
                            </i-row>
                        </div>
                        <div class="inputs-add-btn">
                            <span class="add-btn" @click="onGroupFormAdd">
                                <Icon type="ios-add" />
                            </span>
                        </div>
                    </div>
                </i-col>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { EnumUtils } from "uxmid-core";
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialRuleModule } from "src/models";
import { service } from "src/common/decorator";
import { SpecialRuleService } from "src/services";
import { SPECIAL_RULE_TYPE } from "src/enums";

@component
export default class SpecialRuleScoreModal extends View
{
    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

    @config({required: true, type: Array, default: () => []})
    protected moduleList: Array<any>;

    protected get typeList()
    {
        return EnumUtils.getEntries(SPECIAL_RULE_TYPE);
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
     * 表格值
     * @protected
     * @property
     */
    protected formModel: any =
    {
        id: undefined,
        specialTypeId: undefined,
        scoreName: "",
        type: SPECIAL_RULE_TYPE.OTHER,
        modules: []
    };

    protected deleteIds = [];

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        scoreName:
        [
            {required: true, message: "分值名称不能为空"}
        ]
    };

    protected customRules1: any =
    {
        required: true,
        validator: (rule, value, callback) =>
        {
            if (typeof value === "string")
            {
                callback();
            }
            else
            {
                callback(new Error("请选择一个模块"));
            }
        }
    };

    protected customRules2: any =
    {
        required: true,
        validator: (rule, value, callback) =>
        {
            value = Number(value);
            if (typeof value === "number" && (value > 0 && value <= 100))
            {
                callback();
            }
            else
            {
                callback(new Error("模块权重必须大于0且小于等于100"));
            }
        }
    };

    /**
     * 打开方法
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    public async open(mode: string, data: any, specialTypeId?: number)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];
        // console.log("模块列表", this.moduleList);

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "specialTypeId", specialTypeId);
            this.onGroupFormAdd();
            this._systemNodeItemModal.open();
        }
        else
        {
            // 更新
            this.$set(this.formModel, "specialTypeId", specialTypeId);
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "scoreName", data.scoreName);
            this.$set(this.formModel, "type", data.type);
            this._systemNodeItemModal.open();

            this.formModel.modules.push(...data.modules);
        }
    }

    /**
     * 模块切换事件
     */
    protected onModuleChange(args: any, i: number)
    {
        if (typeof args[0] === "string")
        {
            const t = this.moduleList.find(item => item.uuId === args[0]);
            this.$set(this.formModel.modules[i], "type", t.type);
            this.$set(this.formModel.modules[i], "moduleId", t.id);
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
                    // 校验
                    let totalWeight = 0;
                    data.modules.forEach(item =>
                    {
                        totalWeight += Number(item.moduleWeight);
                    });
                    if (totalWeight !== 100)
                    {
                        return this.$message.error("模块权重之和必须等于100");
                    }
                    
                    if (this.mode === this.modeList[0])
                    {
                        await this.specialRuleService.insertGeneralRule(data);
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        await this.specialRuleService.updateGeneralRule(data, this.deleteIds);
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
        this.deleteIds = [];
        this.$set(this.formModel, "id", undefined);
        this.$set(this.formModel, "scoreName", "");
        this.$set(this.formModel, "specialTypeId", undefined);
        this.$set(this.formModel, "type", SPECIAL_RULE_TYPE.OTHER);
        this.mode = this.modeList[0];
        this.$form.resetFields();
        this.$set(this.formModel, "modules", []);
    }

    protected onGroupFormAdd()
    {
        this.formModel.modules.push({
            moduleId: undefined,
            moduleWeight: undefined,
            type: undefined
        });
    }

    protected onGroupFormRemove(item, i)
    {
        if (this.formModel.modules.length === 1)
        {
            return;
        }
        this.formModel.modules.splice(i, 1);
        if (typeof item.id === "number")
        {
            this.deleteIds.push(item.id);
        }
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