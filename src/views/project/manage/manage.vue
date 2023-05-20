<template>
    <div class="manage-view">
        <u-page-content :class="{open: isOpenOperation}" :isOpenOperation="isOpenOperation">
            <i-form slot="search-left" ref="searchBox" @submit.native.prevent>
                <i-form-item label="关键字：">
                    <i-input placeholder="项目名称/编号" v-model="filters.projectInfo" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>
                <i-form-item label="项目状态：">
                   <i-select  v-model="filters.status" maxlength="20" @on-change="onSearch" clearable>
                        <i-option :value="0">施工中 </i-option>
                        <i-option :value="1">已完结</i-option>
                    </i-select> 
                </i-form-item>

                <i-form-item label="项目类型：">
                   <i-select  v-model="filters.projectTypeId" maxlength="20" @on-change="onSearch" clearable>
                        <i-option v-for="item in selectListObj.projectTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                    </i-select> 
                </i-form-item>

                <!-- <i-form-item label="相关单位：">
                   <i-select  v-model="filters.typeId" maxlength="20">
                        <i-option v-for="item in [1,2,3,4]" :key="item" :value="item">{{item}}</i-option>
                    </i-select> 
                </i-form-item> -->

               

                <i-form-item>
                    <i-button type="primary" @click="onSearch">查询</i-button>
                    <i-button type="info" @click="onReset">重置</i-button>
                    <i-button type="info" @click="isOpenOperation = !isOpenOperation">{{isOpenOperation ? "收起" : "高级搜索"}}</i-button>
                </i-form-item>
            </i-form>

            <template slot="operation-btn">
                <i-poptip trigger="click" title="导入/导出" content="content">
                    <i-button type="info" v-permission="permissionCode.PROJECT_INOUT">导入/导出</i-button>
                    <section slot="content">
                        <i-button type="info" @click="onOperations('import')">导入</i-button>
                        <i-button type="info" @click="onOperations('export')">导出</i-button>
                    </section>
                </i-poptip>
                
                <i-button type="primary" @click="onOperations('insert')" v-permission="permissionCode.PROJECT_XZ">新增</i-button>
            </template>

            <!-- 高级搜索列 BEGIN-->
            <i-form slot="senior">
                <!-- <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="客户名称：">
                        <i-input placeholder="项目名称/编号/施工单位/姓名/手机"></i-input>
                    </i-form-item>
                </i-row> -->
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="所在区域：">
                        <i-cascader :data="selectListObj.areaList" v-model="filters.areaIds" change-on-select filterable @on-change="userAreaListChange"></i-cascader>
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="业主单位：">
                        <i-select  v-model="filters.customerId" maxlength="20" @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="施工单位：">
                        <i-select  v-model="filters.constructionId" maxlength="20"  @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.constructionList" :key="item.id" :value="item.id">{{item.constructionName}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="监理单位：">
                        <i-select  v-model="filters.supervisingId" maxlength="20"  @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.supervisingList" :key="item.id" :value="item.id">{{item.name}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
            </i-form>
            <!-- 高级搜索列 END-->

            <template slot="page-table">
                <ux-switch-table 
                    ref="switchTable" 
                    :row-columuns="rowColumuns" 
                    :col-columuns="colColumuns"
                    :load-func="testPaginTableService.pagin.bind(testPaginTableService)"
                    @on-row-click="onRowClick"
                    @no-data="detail = {}"
                    :initQueryParams="{id: filters.id}"
                >
                    <template slot="detail">
                        <u-detail ref="detail" :detail="detail" @operations="onOperations"></u-detail>
                    </template>
                </ux-switch-table>
            </template>
        </u-page-content>

        <main-insert-update-modal
            ref="mainInsertUpdateModal"
            :insert="testPaginTableService.insert.bind(testPaginTableService)"
            :update="testPaginTableService.update.bind(testPaginTableService)"
            :detail="{}"
            @on-refresh="onSearch"
            :selectListObj="selectListObj"
        >

        
        </main-insert-update-modal>

        <import-modal
            ref="improtsModal"
            :imports="testPaginTableService.uploadProject.bind(testPaginTableService)"
            @on-refresh="onSearch"
        >
        </import-modal>
        <export-modal
            ref="exportModal"
            :filters="filters"
            :selectListObj="selectListObj"
            :exports="testPaginTableService.projectExport.bind(testPaginTableService)"
            :totalall="testPaginTableService.list.bind(testPaginTableService)"
        ></export-modal>

        <upload-modal
            ref="uploadModal"
            @on-refresh="onSearch"
            :update="testPaginTableService.saveBatchProjectFile.bind(testPaginTableService)"
        ></upload-modal>
        <saveTime-modal
            ref="saveTimeModal"
            @on-refresh="onSearch"
            :update="safetyProductionService.update.bind(safetyProductionService)"
            :insert="safetyProductionService.insert.bind(safetyProductionService)"
        ></saveTime-modal>
        <!-- ProjectService.userImport.bind(ProjectService) -->
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import ManageDetail from "./detail.vue";
import { ProjectService, DictService, CustomerService, OrgService, ConstructService, DiagnosService, HiddenService, SafetyProductionService } from "src/services";
import { service } from "src/common/decorator";
import { ExtendUtils } from "src/common/utils";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import ImportModal from "./_components/imports-modal.vue";
import ExportModal from "./_components/export-modal.vue";
import UploadModal from "./_components/upload-modal.vue";
import SaveTimeModal from "./_components/saveTime-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@component({
    components:
    {
        ImportModal,
        ExportModal,
        UploadModal,
        SaveTimeModal,
        "u-detail": ManageDetail,
        "main-insert-update-modal": InsertUpdateModal
    }
})
export default class ManageView extends CommonView
{
    @service("ProjectService")
    protected testPaginTableService: ProjectService;

    @service("DictService")
    protected dictService: DictService;

    @service("CustomerService")
    protected customerService: CustomerService;

    @service("OrgService")
    protected orgService: OrgService;

    @service("ConstructService")
    protected constructService: ConstructService;

    @service("DiagnosService")
    protected diagnosService: DiagnosService;

    @service("HiddenService")
    protected hiddenService: HiddenService;

    @service("SafetyProductionService")
    protected safetyProductionService: SafetyProductionService;

    /**
     * 是否展开高级搜索
     * @protected
     * @property
     */
    protected isOpenOperation: boolean = false;

    /**
     * 当前项详情
     * @protected
     * @property
     */
    protected detail: any = {};

    /**
     * 筛选条件（除去分页）
     * @property
     */
    protected filters: any = {id: undefined};

    /**
     * 筛选来源数据集合（除去分页）
     * @property
     */
    protected selectListObj: any = {};

    /**
     * 表格列表模式行渲染
     * @member
     * @protected
     * @returns {Array<any>}
     */
    protected rowColumuns: Array<any> =
    [
        {
            title: "项目名称",
            key: "projectName"
        },
        {
            title: "单位编号",
            key: "customerNum"
        },
        {
            title: "项目类型",
            key: "projectTypeName"
        },
        {
            title: "项目地址",
            key: "projectCode"
        },
        {
            title: "街道/社区",
            key: "streetCommunity"
        },
        {
            title: "开工日期",
            key: "beginDate"
        },
        {
            title: "计划竣工日期",
            key: "completionDate"
        },
        {
            title: "合同期限(年)",
            key: "contractPeriod"
        },
        {
            title: "项目合同金额(万元)",
            key: "contractSum"
        },
        {
            title: "建筑面积（K㎡）",
            key: "floorage"
        },
        {
            title: "项目对接人",
            key: "responsible"
        },
        {
            title: "负责科室",
            key: "responsibleDepName"
        }
    ];

    /**
     * 表格详情模式行渲染
     * @member
     * @protected
     * @returns {Array<any>}
     */
    protected colColumuns: Array<any> =
    [
        {
            render: (h, {row}: any) =>
            {
                let nameDiv = ExtendUtils.tooltipElement(row.projectName, 14, h, "100%", "strong","f18 vb");
                // let tip = ExtendUtils.createTipElement(h, "优先级："+row.priorityLevel, "#FF4D3F", false);
                // let statusTip = ExtendUtils.createStatusElement(h, row.gender, "#FF4D3F", true);

                return h("div", {class: "col-container"}, [
                    h("div", {class: "content"}, [
                        // 标题部分
                        h("i-row", {class: "title"}, [
                            h("i-col", {attrs: {span: "24"}}, [nameDiv]) // , tip
                            // h("span", {class: "status-tips"}, [statusTip])
                        ]),
                        // 说明部分
                        h("i-row", {class: "desc d-f"}, [
                            h("i-col", {attrs: {span: "24"}}, `施工单位：${row.construction && row.construction[0].constructionName || "-"}`)
                            
                        ]),
                        h("i-row", {class: "desc d-f"},
                        [
                            h("i-col",
                            { attrs: {span: "24"}},
                                `单位编号：${row.customerNum || "" }`)
                        ]),
                        h("i-row", {class: "desc mt10"}, [
                            h("i-col", {attrs: {span: "6"}}, [
                                h("i", {class: "iconfont icon-icon_zongwenti1 f14 font-FF4D3F mr5"}),
                                h("span",`总问题：${row.hazard && row.hazard.total || "0"}`)
                            ]),
                            h("i-col", {attrs: {span: "6"}}, [
                                h("i", {class: "iconfont icon-icon_daizhenggai1 f14 font-FF9832 mr5"}),
                                h("span",`待整改：${row.hazard && row.hazard.toBeRectified || "0"}`)
                            ]),
                            h("i-col", {attrs: {span: "6"}}, [
                                h("i", {class: "iconfont icon-icon_daibihe1 f14 font-4D85F1 mr5"}),
                                h("span",`待闭合：${row.hazard && row.hazard.toBeClosed || "0"}`)
                            ]),
                            h("i-col", {attrs: {span: "6"}}, [
                                h("i", {class: "iconfont icon-icon_yibihe21 f14 font-online mr5"}),
                                h("span",`已闭合：${row.hazard && row.hazard.closed || "0"}`)
                            ])
                        ])
                    ])
                ]);
            }
        }
    ];

    /**
     * 触发查询列表
     * @member
     * @protected
     * @returns {void}
     */
    protected onSearch(): void
    {
        console.log(this.filters);
        
        this._switchTable.search(this.filters);
    }
    
    /**
     * 区域选择触发
     * @member
     * @protected
     * @returns {void}
     */
    protected userAreaListChange(value: any, selectedData: any): void
    {
        this.filters.communityId = value[value.length - 1];
        this.filters.agencyId = selectedData.agencyId || undefined;
        this.onSearch();
    }
    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _improtsModal(): ImportModal
    {
        return this.$refs["improtsModal"] as ImportModal;
    }

    protected get _exportModal(): ExportModal
    {
        return this.$refs["exportModal"] as ExportModal;
    }

    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _uploadModal(): UploadModal
    {
        return this.$refs["uploadModal"] as UploadModal;
    }

    protected get _saveTimeModal(): ExportModal
    {
        return this.$refs["saveTimeModal"] as ExportModal;
    }

    /**
     * 触发重置查询方法
     * @member
     * @protected
     * @returns {void}
     */
    protected onReset(): void
    {
        this.filters = {};
        this._switchTable.reset();
    }

    /**
     * 列表操作
     * @protected
     * @member
     */
    protected async onOperations(type: string, data?: any)
    {
        switch(type)
        {
            case "insert":
            {
                this._mainInsertUpdateModal.open({},0);
                break;
            }
            
            case "update":
            {
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)),0);
                break;
            }
            case "refuse":
            {
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)), 3);
                break;
            }
            case "import":
            {
                this._improtsModal.open(data);
                break;
            }
            case "export":
            {
                this._exportModal.open();
                break;
            }
            case "delete":
            {
                this.$modal.confirm({
                    title: "提示",
                    content: "您确定要删除该项目吗？",
                    onOk: async () =>
                    {
                        try
                        {
                            await this.testPaginTableService.virtualRemoveById(data.id);
                            this.$message.success("操作成功");
                            this.onSearch();
                        } catch (error) {
                            this.$message.error("操作失败：" + error.msg || error.message);
                        }
                    }
                });
                break;
            }
            case "saveTime":
            {
                this._saveTimeModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            case "upload":
            {
                this._uploadModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            default:
            {
                // do nothing
                break;
            }
        }
    }

    /**
     * 触发列表选中操作
     * @member
     * @protected
     * @returns {void}
     */
    protected async onRowClick(row: any, index?: number): Promise<void>
    {
        this.detail = row || {};
        this.getDangerStats(row.id);
        this.getProdByProjtId(row.id);
    }

    protected async getDangerStats(projectId)
    {
        this.detail.dangerStats = {};
        let res = await this.hiddenService.getDangerStatsBy({projectId});
        this.detail.dangerStats = res;
    }

    protected async getProdByProjtId(projectId)
    {
        let data: any = await this.safetyProductionService.getProdByProjtId({projectId});

        this.detail.saveProjectId = data.id;
        this.detail.saveProjectbeginDate = data.beginDate;
        this.detail.saveProjectliability = data.liability;
        this.detail.saveProjectmakeZeroType = data.makeZeroType;
    }

    /**
     * switchTable组件类
     * @ref
     */
    private get _switchTable(): any
    {
        return this.$refs["switchTable"] as any;
    }

    /**
     * 主新增编辑弹层
     * @ref
     */
    private get _mainInsertUpdateModal(): InsertUpdateModal
    {
        return this.$refs["mainInsertUpdateModal"] as InsertUpdateModal;
    }

    protected created()
    {
        this.filters.id = this.$route.query.id || undefined;
        
        this.selectList();
    }

    /**
     * 获得选项框的数据
     * @ref
     */
    protected async selectList()
    {
        let projectTypeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.PROJECT_TYPE);
        this.selectListObj.projectTypeList = projectTypeList; // 项目类型

        let constructionStageList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE);
        this.selectListObj.constructionStageList = constructionStageList; // 施工阶段

        let orgRree = await this.orgService.tree();
        this.selectListObj.orgRree = [];
        this.transferTree(null, orgRree.children);// 责任部门

        let customerList = await this.customerService.list();
        this.selectListObj.customerList = customerList.content; // 业主方列表

        let constructionList = await this.testPaginTableService.getConstructionDeptList();
        this.selectListObj.constructionList = constructionList; // 施工方列表

        let constructionListAdd = await this.constructService.list();
        this.selectListObj.constructionListAdd = constructionListAdd.content; // 施工方列表 新增

        let supervisingList = await this.testPaginTableService.getSupervisingUnitList();
        this.selectListObj.supervisingList = supervisingList; // 监理方列表
        
        let areaList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.AD_AREA);
        this.selectListObj.areaList = [];
        this.areaTree(null, areaList);// 所在区域
        
    }

    /**
     * 处理组织架构
     * @ref
     */
    protected transferTree(parentData: any = {}, data: any): any
    {
        if (parentData)
        {
            const children = data.filter(item => item.parentId === parentData.id);
            if (children.length)
            {
                children.forEach(item =>
                {
                    item.label = item.name;
                    item.value = item.id;
                    item.children = this.transferTree(item, data);
                });
                return children;
            } else {
                return [];
            }
        } else {
            data.filter(item => data.filter(e => e.id === item.parentId).length === 0).forEach(item =>
            {
                item.label = item.name;
                item.value = item.id;
                item.children = this.transferTree(item, data);
                this.selectListObj.orgRree.push(item);
            });
        }
    }

    /**
     * 处理区域架构
     * @ref
     */
    protected areaTree(parentData: any, data: any = []): any
    {
        data.forEach(item =>
        {
            let items: any = {};
            items.label = item.name;
            items.value = item.id;
            items.children = item.children.map(itm =>
            {
                let itms: any = {};
                itms.label = itm.name;
                itms.value = itm.id;
                itms.children = itm.children.map(ele =>
                {
                    let eles: any = {};
                    eles.label = ele.name;
                    eles.value = ele.id;
                    return eles;
                });
                return itms;
            });
            
            this.selectListObj.areaList.push(items);
        });
    }
}
</script>

<style lang="less" scoped>
.manage-view
{
    height: 100%;
}
</style>