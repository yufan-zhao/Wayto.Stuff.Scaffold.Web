<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加模块' : '修改模块'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="模块名称：" prop="moduleName" :label-width="140">
                        <i-input placeholder="请输入" v-model="formModel.moduleName"></i-input>
                    </i-form-item>
                </i-col>
                
                <i-col span="24">
                    <div class="group-form-view">
                        <div class="group-form-inputs" v-for="(item, i) in formModel.specials" :key="i">
                            <span class="delete-btn" @click="onGroupFormRemove(item, i)">
                                <Icon type="ios-remove" />
                            </span>

                            <i-row class="content">
                                <i-col span="24">
                                    <i-form-item class="customed-form-item" label="一级体系项：" :label-width="140" :prop="'specials.'+i+'.primarySpecialNodeId'" :rules="customRules1">
                                        <i-select placeholder="请选择" v-model="item.primarySpecialNodeId" @on-change="onGroupPrimarySpecialNodeIdChange(i, arguments)">
                                            <i-option v-for="(parentSpecial, j) in specialTreeDataCopy" :key="'primary-'+i + '-' + j" :value="parentSpecial.id">{{parentSpecial.name}}</i-option>
                                        </i-select>
                                    </i-form-item>
                                </i-col>
                                <i-col span="24">
                                    <i-form-item class="customed-form-item" label="体系权重：" :label-width="140" :prop="'specials.'+i+'.weight'" :rules="customRules2">
                                        <i-input placeholder="请输入" type="number" v-model="item.weight"><span slot="append">%</span></i-input>
                                    </i-form-item>
                                </i-col>
                                <i-col span="24">
                                    <i-form-item class="customed-form-item" label="二级体系项：" :label-width="140">
                                        <i-select placeholder="请选择" multiple v-model="item.secondSpecialNodeIds" :max-tag-count="4">
                                            <i-option v-for="(secondSpecial, k) in item.secondSpecialNodeList" :key="'second-'+i+'-'+k" :value="secondSpecial.id">{{secondSpecial.name}}</i-option>
                                        </i-select>
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
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialRuleModule, SpecialNode } from "src/models";
import { service } from "src/common/decorator";
import { SpecialService, SpecialRuleService } from "src/services";

@component
export default class SpecialRuleModuleModal extends CommonView
{
    @service("SpecialService")
    private specialService: SpecialService;

    @service("SpecialRuleService")
    private specialRuleService: SpecialRuleService;

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
     * 体系树节点列表数据
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialTreeData: Array<SpecialNode>;

    /**
     * 体系树展示数据
     * @property
     */
    protected specialTreeDataCopy: Array<SpecialNode> = [];

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
    protected formModel: SpecialRuleModule =
    {
        moduleId: undefined,
        moduleName: "",
        specialTypeId: undefined,
        specials: []
    };

    protected deleteIds = [];

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        moduleName:
        [
            {required: true, message: "模块名称不能为空"}
        ]
    };

    protected customRules1: any =
    {
        required: true,
        validator: (rule, value, callback) =>
        {
            if (typeof value === "number")
            {
                callback();
            }
            else
            {
                callback(new Error("请选择一级体系"));
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
                callback(new Error("体系权重必须大于0且小于100"));
            }
        }
    };

    /**
     * 打开方法
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    public async open(mode: string, data: SpecialRuleModule, specialTypeId?: number)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

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
            this.$set(this.formModel, "moduleId", data.moduleId);
            this.$set(this.formModel, "moduleName", data.moduleName);
            this.$set(this.formModel, "specialTypeId", specialTypeId);
            this.formModel.specials.push(...data.specials);
            this._systemNodeItemModal.open();

            data.specials.forEach(async (item, i) =>
            {
                let target = this.specialTreeDataCopy.find(primarySpecial => primarySpecial.id === item.primarySpecialNodeId);
                const res = await this.loadData(target);
                this.$set(this.formModel.specials[i], "secondSpecialNodeList", res);
            });
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
                    let specials = data.specials.map(item => {
                        totalWeight += Number(item.weight);
                        return {
                            id: item.id,
                            modelId: item.modelId,
                            primarySpecialNodeId: item.primarySpecialNodeId,
                            secondSpecialNodeIds: item.secondSpecialNodeIds,
                            weight: Number(item.weight)
                        };
                    });
                    data.specials = specials;
                    if (totalWeight !== 100)
                    {
                        return this.$message.error("体系权重之和必须等于100");
                    }

                    if (this.mode === this.modeList[0])
                    {
                        await this.specialRuleService.insertRuleModule(data);
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        await this.specialRuleService.updateRuleModule(data, this.deleteIds);
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
        this.deleteIds = [];
        this.$set(this.formModel, "moduleId", undefined);
        this.$set(this.formModel, "moduleName", "");
        this.$set(this.formModel, "specialTypeId", undefined);
        this.mode = this.modeList[0];
        this.$form.resetFields();
        this.formModel.specials.splice(0, this.formModel.specials.length);
        // this.$set(this.formModel, "specials", []);
    }

    protected onGroupFormAdd()
    {
        this.formModel.specials.push({
            primarySpecialNodeId: undefined,
            secondSpecialNodeIds: [],
            secondSpecialNodeList: [],
            weight: undefined
        });
    }

    protected onGroupFormRemove(item, i)
    {
        if (this.formModel.specials.length === 1)
        {
            return;
        }
        this.formModel.specials.splice(i, 1);
        if (typeof item.id === "number")
        {
            this.deleteIds.push(item.id);
        }
    }

    protected onGroupPrimarySpecialNodeIdChange(index: number, args: Array<any>)
    {
        let value = args[0];
        let item = this.specialTreeDataCopy.find(item => item.id === value);
        this.loadData(item).then(res =>
        {
            this.$set(this.formModel.specials[index], "secondSpecialNodeList", res);
        });
    }

    protected async loadData(item: SpecialNode)
    {
        if (!item)
        {
            return;
        }
        const res = await this.specialService.getSpecialListByParentId(item.specialTypeId, item.id, item.level + 1);
        // this.secondSpecialNodeList = res;
        return res;
    }

    /**
     * 数据源监听
     * @watcher
     */
    @watch("specialTreeData", {immediate: true, deep: true})
    protected specialTreeDataWatcher(val: Array<SpecialNode>)
    {
        const data = JSON.parse(JSON.stringify(val));
        data.forEach(item =>
        {
            item.label = item.name;
            item.value = item.id;
        });
        this.specialTreeDataCopy.splice(0);
        this.specialTreeDataCopy.push(...data);
    }

    /**
     * 表格ref
     * @private
     */
    private get $form(): any
    {
        return this.$refs["form"] as any;
    }

    private get $dynamicForm(): any
    {
        return this.$refs["dynamicForm"] as any;
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