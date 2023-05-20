<template>
    <div class="system-content-view">
        <div class="header">
            <div class="left">
                <span class="title-label">{{nodeData ? nodeData.name : "-"}}</span>
                <span class="sub-title-label">{{subTitle}}</span>
            </div>

            <div class="right">
                <i-button type="primary" @click="onSpecialDangerOps('add')" v-permission="addAuthCode">添加内容</i-button>
            </div>
        </div>

        <div class="table-container">
            <i-table :columns="columns" :data="dangerDataCopy">
                <template slot-scope="{ row }" slot="content">
                    <span class="content-slot">
                        <span class="tag" v-if="row.tag">重</span>
                        <span>{{row.content}}</span>
                    </span>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <span class="status-slot">
                        <span class="dot" :class="{disable: !row.enable}"></span>
                        <span class="label">{{row.enable ? "启用" : "禁用"}}</span>
                    </span>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <span class="action-slot">
                        <span class="btn" @click="onSpecialDangerOps('edit', row, index)" v-permission="editAuthCode">修改</span>
                        <span class="btn" @click="onSpecialDangerOps('delete', row, index)" v-permission="deleteAuthCode">删除</span>
                        <span class="btn" @click="onSpecialDangerOps('tip-add', row, index)" v-permission="editAuthCode">+问题&整改意见</span>
                    </span>
                </template>
            </i-table>
        </div>

        <u-warning-modal ref="warningModal"></u-warning-modal>
        <SpecialDangerModal
            ref="specialDangerModal"
            :specialNodeId="specialNodeId"
            :insert="specialDangerService.insert.bind(specialDangerService)"
            :update="specialDangerService.update.bind(specialDangerService)"
            @on-refresh="onRefresh"
        ></SpecialDangerModal>
        <SpecialDangerTipsModal
            ref="specialDangerTipsModal"
            :hazardLevelList="hazardLevelList"
            :insert="specialDangerTipService.insert.bind(specialDangerTipService)"
            :update="specialDangerTipService.update.bind(specialDangerTipService)"
            @on-refresh="onRefresh"
        ></SpecialDangerTipsModal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import type { SpecialNode, SpecialDanger } from "src/models";
import SpecialDangerModal from "./special-danger-modal.vue";
import { SpecialDangerService, SpecialDangerTipService, DictService } from "src/services";
import { service } from "src/common/decorator";
import SpecialDangerTips from "./special-danger-tips.vue";
import SpecialDangerTipsModal from "./special-danger-tips-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@component({
    components:
    {
        SpecialDangerModal,
        SpecialDangerTips,
        SpecialDangerTipsModal
    }
})
export default class SpecialDangersView extends View
{
    @service("SpecialDangerService")
    private specialDangerService: SpecialDangerService;

    @service("SpecialDangerTipService")
    private specialDangerTipService: SpecialDangerTipService;

    @service("DictService")
    private dictService: DictService;

    /**
     * 当前体系树选中的节点
     * @config
     */
    @config({required: true})
    protected nodeData: SpecialNode;

    /**
     * 当前体系树节点下的体系隐患列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected dangerData: Array<SpecialDanger>;

    /**
     * 新增按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected addAuthCode: string;

    /**
     * 编辑按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected editAuthCode: string;

    /**
     * 删除按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected deleteAuthCode: string;

    /**
     * 当前体系隐患所属的体系节点id
     * @property
     */
    protected get specialNodeId(): number
    {
        return this.nodeData ? this.nodeData.id : undefined;
    }

    /**
     * 当前体系隐患子标题
     * @property
     */
    protected get subTitle(): string
    {
        let result = "";
        if (this.nodeData)
        {
            if (this.nodeData.deservedScore)
            {
                result += "应得分：" + this.nodeData.deservedScore + "分";
            }
            if (this.nodeData.weight)
            {
                if (result)
                {
                    result += "，权重：" + this.nodeData.weight + "%";
                }
                else
                {
                    result += "权重：" + this.nodeData.weight + "%";
                }
            }
            if (result)
            {
                result = "（" + result + "）";
            }
        }
        return result;
    }

    /**
     * 本地体系隐患列表
     * @property
     */
    protected dangerDataCopy: Array<SpecialDanger> = [];

    protected dynamicComponents: Array<any> = [];

    /**
     * 系统中隐患等级列表
     * @property
     */
    protected hazardLevelList: Array<any> = [];

    /**
     * 体系隐患列表表头
     * @property
     */
    protected columns =
    [
        {
            type: "expand",
            width: 50,
            render: (h, params) =>
            {
                let dynamicComponent = h(SpecialDangerTips,
                {
                    props:
                    {
                        parentDetail: this.dangerDataCopy[params.index]
                    },
                    on:
                    {
                        "on-ops": this.onSpecialDangerOps
                    }
                });

                this.dynamicComponents[params.index] = dynamicComponent;

                return dynamicComponent;
            }
        },
        {
            title: "内容",
            width: 650,
            slot: "content"
        },
        {
            title: "问题隐患等级",
            key: "dangerLevelAlias"
        },
        {
            title: "状态",
            slot: "status"
        },
        {
            title: "操作",
            slot: "action",
            width: 280
        }
    ];

    /**
     * 体系隐患操作事件
     * @protected
     */
    protected onSpecialDangerOps(opName: "edit" | "delete" | "add" | "tip-add" | "tip-edit" | "tip-delete", item?: any, i?: number)
    {
        if (opName === "delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前体系节点的内容",
                onOk: async () => {
                    try
                    {
                        await this.specialDangerService.delete(item.id);
                        this.$message.success("操作成功");
                        this.onRefresh();
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
        else if (opName === "edit")
        {
            this._specialDangerModal.open("update", item);
        }
        else if (opName === "add")
        {
            this._specialDangerModal.open("insert", {});
        }
        else if (opName === "tip-add")
        {
            this._specialDangerTipsModal.open("insert", {parent: item, child: null}, item.id);
        }
        else if (opName === "tip-edit")
        {
            this._specialDangerTipsModal.open("update", item, item.parent.id);
        }
        else if (opName === "tip-delete")
        {
            this._warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前问题描述",
                onOk: async () => {
                    try
                    {
                        await this.specialDangerTipService.delete(item.child.id);
                        this.$message.success("操作成功");
                        this.onTipRefresh(item.parent.id);
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

    /**
     * 列表刷新事件
     * @protected
     */
    protected onRefresh()
    {
        this.$emit("on-refresh");
        this.dynamicComponents = [];
    }

    protected onTipRefresh(checkId: number)
    {
        this.dangerDataCopy.forEach((item, i) =>
        {
            if (item.id === checkId)
            {
                let target: any = this.dynamicComponents[i];
                // target.data.trigger = Math.random();
                if (target)
                {
                    console.log(target.context);
                    target.context.$set(target.context, "trigger", Math.random());
                    // target.context.trigger = Math.random();
                }
            }
        });
    }

    /**
     * 隐患列表数据监听
     * @watch
     */
    @watch("dangerData", {immediate: true})
    protected dangerDataWatcher(val: Array<SpecialDanger>)
    {
        this.dangerDataCopy.splice(0);
        this.dangerDataCopy.push(...JSON.parse(JSON.stringify(val)));
    }

    protected async created()
    {
        this.hazardLevelList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.HAZARD_LEVEL);
    }

    /**
     * 警告弹层
     * @private
     * @returns {any}
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }

    private get _specialDangerModal(): any
    {
        return this.$refs["specialDangerModal"] as any;
    }

    private get _specialDangerTipsModal(): any
    {
        return this.$refs["specialDangerTipsModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.system-content-view
{
    height: 100%;
    overflow: auto;
    padding-bottom: 30px;

    .header
    {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        .left
        {
            .title-label
            {
                font-size: 18px;
                font-weight: bold;
            }
            .sub-title-label
            {
                font-size: 14px;
            }
        }
    }
}

@{deep}.status-slot
{
    display: flex;
    align-items: center;

    .dot
    {
        border-radius: 50%;
        width: 6px;
        height: 6px;
        margin-right: 4px;
        background-color: #32BA52;
    }
    .dot.disable
    {
        background-color: #FF4D3F;
    }
}

@{deep}.action-slot
{
    .btn
    {
        margin-right: 20px;
        cursor: pointer;
        color: #3375F4;
        transition: color ease-in-out 0.3s;
    }
    .btn:hover
    {
        color: lighten(#3375F4, 10%);
    }
}

@{deep}.content-slot
{
    .tag
    {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 1px solid #FC532E;
        border-radius: 2px;
        font-size: 12px;
        color: #FC532E;
        text-align: center;
    }
}

@{deep}.ivu-table-expanded-cell
{
    padding: 10px;
}
</style>