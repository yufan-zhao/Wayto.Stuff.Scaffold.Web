<template>
    <div class="system-view dictionary">
        <sidebar 
            class="sidebar"
            :data="sidebarData"
            @on-item-click="onSidebarClick"
        ></sidebar>

        <div class="dict-container">
            <div class="table-header">
                <span class="header-label">{{parentNode.name || "-"}}</span>

                <div class="btn-container">
                    <i-button type="primary" @click="addDictRow" v-permission="permissionCode.SYSTEM_CONFIG_XZ">添加</i-button>
                </div>
            </div>

            <div class="" v-if="parentNode.value === SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE">
                <!-- 标准图集 -->
                <DictAtlas
                    ref="dictAtlas"
                    v-model="childNodes"
                    :insert="dictService.insert.bind(dictService)"
                    :update="dictService.update.bind(dictService)"
                    :delete="dictService.delete.bind(dictService)"
                    @on-refresh="onSidebarClick(parentNode)"
                ></DictAtlas>
            </div>
            <dict-editable-table
                v-else
                ref="dictEditableTable"
                class="table"
                v-model="childNodes"
                :readonly="parentNode.value === SYSTEM_CONFIG_TYPE.POSITION_SETTING"
                :editAuthCode="permissionCode.SYSTEM_CONFIG_BJ"
                :deleteAuthCode="permissionCode.SYSTEM_CONFIG_SC"
                :columnFormat="columnFormat"
                :insert="dictService.insert.bind(dictService)"
                :update="dictService.update.bind(dictService)"
                :delete="dictService.delete.bind(dictService)"
                @on-refresh="onSidebarClick(parentNode)"
            >
            </dict-editable-table>

        </div>
    </div>
</template>

<script lang="ts">
import { EnumUtils } from "uxmid-core";
import { component, View } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { service } from "src/common/decorator/service";
import { DictService, OrgService } from "src/services";
import { SYSTEM_CONFIG_TYPE } from "src/enums";
import { IViewCascaderData } from "src/models";

import Sidebar from "./_components/config-sidebar.vue";
import DictEditableTable from "./_components/dict-editable-table.vue";
import DictAtlas from "./_components/dict-atlas.vue";

@component({
    components:
    {
        "sidebar": Sidebar,
        "dict-editable-table": DictEditableTable,
        DictAtlas
    }
})
export default class ConfigView extends CommonView
{
    /**
     * 系统设置隐患类型服务。
     * @private
     * @type {DictService}
     */
    @service("DictService")
    private dictService: DictService;

    @service("OrgService")
    private orgService: OrgService;

    protected SYSTEM_CONFIG_TYPE = SYSTEM_CONFIG_TYPE;

    /**
     * 父节点列表
     * @protected
     * @property
     */
    protected get sidebarData(): Array<any>
    {
        const configableEnums =
        [
            SYSTEM_CONFIG_TYPE.PROJECT_TYPE,
            SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE,
            SYSTEM_CONFIG_TYPE.HAZARD_LEVEL,
            SYSTEM_CONFIG_TYPE.TOOL_TYPE,
            SYSTEM_CONFIG_TYPE.TOOL_CRIB,
            SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE,
            SYSTEM_CONFIG_TYPE.SAFETY_TRAINING,
            SYSTEM_CONFIG_TYPE.GROUP_NAME,
            SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE,
            SYSTEM_CONFIG_TYPE.CONTRACT_TYPE,
            SYSTEM_CONFIG_TYPE.POSITION_SETTING
        ];
        return configableEnums.map(item =>
        {
            const target = EnumUtils.getEntry(item, SYSTEM_CONFIG_TYPE);
            return {
                name: target.alias,
                value: target.value
            };
        });
    }

    /**
     * 组织树
     * @property
     */
    protected orgTree: Array<IViewCascaderData> = [];

    /**
     * 子节点列表表格格式
     * @protected
     * @property
     */
    protected columnFormat: any = null;

    /**
     * 当前选择的父节点
     * @protected
     * @property
     */
    protected parentNode: {name?: string; value?: SYSTEM_CONFIG_TYPE; id?: number} = {};

    /**
     * 当前选择的父节点所有的子节点列表
     * @protected
     * @property
     */
    protected childNodes: Array<any> = [];

    /**
     * 侧栏点击事件
     * @protected
     * @member
     */
    protected async onSidebarClick(item: {name: string; value: SYSTEM_CONFIG_TYPE; id?: number})
    {
        // 提前准备好数据解析
        let columnFormat: any = null;
        let extra: any = null;
        switch(item.value)
        {
            case SYSTEM_CONFIG_TYPE.PROJECT_TYPE:
            {
                columnFormat =
                [
                    {key: "typeNumber", type: "text", title: "类型编号", required: true},
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE:
            {
                const projectTypeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.PROJECT_TYPE);
                const sourceList = projectTypeList.map(item =>
                {
                    return {name: item.typeName, value: item.id, enable: item.enable};
                });
                columnFormat =
                [
                    {key: "projectTypeId", type: "select", title: "项目类型", source: sourceList, required: true},
                    {key: "phaseName", type: "text", title: "阶段名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_TYPE:
            {
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_LEVEL:
            {
                columnFormat =
                [
                    // {key: "levelNumber", type: "text", title: "等级序列"},
                    {key: "levelNumber", type: "text", title: "等级编号", required: true},
                    {key: "sequence", type: "number", title: "排序编号", required: true},
                    {key: "color", type: "text", title: "颜色"},
                    {key: "content", type: "text", title: "定义内容", required: true},
                    {key: "description", type: "text", title: "说明"},
                    {key: "required", type: "switch", title: "是否必查项"}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_TYPE:
            {
                columnFormat =
                [
                    {key: "typeNumber", type: "text", title: "类型编号", required: true},
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_CRIB:
            {
                columnFormat =
                [
                    {key: "addr", type: "text", title: "存放地名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE:
            {
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.SAFETY_TRAINING:
            {
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.GROUP_NAME:
            {
                extra = this.orgTree;
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "队伍名称", required: true},
                    {key: "deptId", type: "org-select", title: "所属部门", required: true, source: this.orgTree}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE:
            {
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONTRACT_TYPE:
            {
                columnFormat =
                [
                    {key: "typeName", type: "text", title: "类型名称", required: true}
                ];
                break;
            }
            case SYSTEM_CONFIG_TYPE.POSITION_SETTING:
            {
                columnFormat =
                [
                    {key: "positionName", type: "text", title: "职位名称", required: true}
                ];
                break;
            }
            default:
            {
                console.warn("未匹配的枚举类型，请检查代码", item);
                break;
            }
        }
        this.columnFormat = columnFormat ? JSON.stringify(columnFormat) : null;

        // 调用接口获取右侧的数据
        this.parentNode = item;
        const res = await this.dictService.getTargetContentList(item.value, false, extra);
        // console.log(res);
        this.childNodes = res;
    }

    /**
     * 添加数据字典事件
     * @protected
     * @member
     */
    protected addDictRow()
    {
        if (this.parentNode.value === SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE)
        {
            (this.$refs["dictAtlas"] as any).addRow();
        }
        else
        {
            if (this.childNodes.length === 0 || (this.childNodes[0] && this.childNodes[0].id))
            {
                let newRow: any = {};
                newRow.parentId = this.parentNode.id;
                newRow.enumValue = this.parentNode.value;
                newRow.enable = true;
                this.childNodes.unshift(newRow);
            }
            else
            {
                this.$message.warning("一次只能添加一行");
            }
        }
    }

    /**
     * @private
     * @created
     */
    private async created()
    {
        const orgTreeRes = await this.orgService.getTreeCascader();
        this.orgTree = orgTreeRes;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/system";

.dictionary
{
    display: flex;
    padding-top: 30px;
    padding-right: 30px;

    .sidebar
    {
        flex: 0 0 170px;
        width: 170px;
        border-right: 1px solid #E9EBEC;
    }

    .dict-container
    {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        margin-left: 40px;
        margin-bottom: 118px;
        width: calc(100% - 210px);

        .table-header
        {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            height: 35px;

            .header-label
            {
                font-size: 18px;
                color: #182334;
                font-weight: bold;
            }
        }

        .table
        {
            @{deep}.status-container
            {
                position: relative;

                .dot
                {
                    position: relative;
                    bottom: 2px;
                    display: inline-block;
                    height: 6px;
                    width: 6px;
                    border-radius: 50%;
                    background-color: #32BA52;
                    margin-right: 6px;
                }
            }
            @{deep}.status-container.disable
            {
                .dot
                {
                    background-color: #C3C9CF;
                }
            }
        }
    }
}
</style>