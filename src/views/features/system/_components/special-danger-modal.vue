<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加内容' : '修改内容'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-form-item class="customed-form-item" label="扣分标准：" prop="content" :label-width="100">
                    <i-input placeholder="请输入" type="textarea" v-model="formModel.content"></i-input>
                </i-form-item>
                <i-form-item class="customed-form-item" label="问题隐患等级：" prop="dangerLevels" :label-width="100">
                    <i-select placeholder="请选择" multiple v-model="formModel.dangerLevels">
                        <i-option v-for="(item, i) in dangerLevelList" :key="i" :value="item.id">{{item.levelNumber}}（{{item.content}}）</i-option>
                    </i-select>
                </i-form-item>
                <i-form-item class="customed-form-item" label="状态：" prop="enable" :label-width="100">
                    <i-switch v-model="formModel.enable"></i-switch>
                </i-form-item>
                <i-form-item class="customed-form-item" label="标记重点：" prop="tag" :label-width="100">
                    <i-switch v-model="formModel.tag"></i-switch>
                </i-form-item>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialDanger } from "src/models";
import { DictService } from "src/services";
import { service } from "src/common/decorator";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@component
export default class SpecialDangerModal extends CommonView
{
    @service("DictService")
    private dictService: DictService;
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
     * 当前体系隐患列表所属的体系节点id
     * @config
     */
    @config({required: false, type: Number})
    protected specialNodeId: number;

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
     * 隐患等级列表
     * @property
     */
    protected dangerLevelList: Array<any> = [];

    /**
     * 表格值
     * @protected
     * @property
     */
    protected formModel: SpecialDanger =
    {
        id: undefined,
        specialNodeId: undefined,
        content: "",
        dangerLevels: [],
        enable: true,
        tag: false
    };

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        content:
        [
            {required: true, message: "内容不能为空"}
        ],
        dangerLevels:
        [
            {required: true, message: "隐患等级不能为空"}
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
        this.$set(this.formModel, "specialNodeId", undefined);
        this.$set(this.formModel, "content", "");
        this.$set(this.formModel, "enable", true);
        this.$set(this.formModel, "tag", false);
        this.$set(this.formModel, "dangerLevels", []);
        this.mode = this.modeList[0];
        this.$form.resetFields();
    }

    /**
     * 打开方法
     * @protected
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    protected open(mode: string, data: SpecialDanger)
    {
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "enable", true);
            this.$set(this.formModel, "specialNodeId", this.specialNodeId);
        }
        else
        {
            // 更新
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "specialNodeId", data.specialNodeId);
            this.$set(this.formModel, "content", data.content);
            this.$set(this.formModel, "enable", data.enable);
            this.$set(this.formModel, "tag", data.tag);
            this.$set(this.formModel, "dangerLevels", data.dangerLevels);
            // this.formModel.dangerLevels.push(...data.dangerLevels);
        }

        this._systemNodeItemModal.open();
    }

    protected async created()
    {
        this.dangerLevelList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.HAZARD_LEVEL);
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