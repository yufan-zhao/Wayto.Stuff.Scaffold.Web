<template>
    <div class="manage-view">
        <u-page-content :class="{open: isOpenOperation}" :isOpenOperation="isOpenOperation">
            <i-form slot="search-left" ref="searchBox" @submit.native.prevent>
                <i-form-item label="关键字：">
                    <i-input placeholder="诊治编号" v-model="filters.consultNum" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>
                <i-form-item label="项目名称：">
                    <i-input placeholder="请输入" v-model="filters.projectName" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>
                <i-form-item label="项目类型：">
                    <i-select  v-model="filters.projectType" maxlength="20" @on-change="onSearch" clearable>
                        <i-option v-for="item in selectListObj.projectTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                    </i-select> 
                </i-form-item>
                
                
                <i-form-item>
                    <i-button type="primary" @click="onSearch">查询</i-button>
                    <i-button type="info" @click="onReset">重置</i-button>
                    <i-button type="info" @click="isOpenOperation = !isOpenOperation">{{isOpenOperation ? "收起" : "高级搜索"}}</i-button>
                </i-form-item>
            </i-form>

            <template slot="operation-btn">
                <!-- <i-button type="primary" @click="onOperations('insert')">新增</i-button> -->
                <i-button type="primary" @click="onOperations('exports')" v-permission="permissionCode.REPORT_DC">导出</i-button>
            </template>

            <!-- 高级搜索列 BEGIN-->
            <i-form slot="senior">
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="业主单位：" class="input-item">
                        <i-select  v-model="filters.customerId" maxlength="20" @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
                 <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="诊治组长：" class="input-item">
                        <i-input placeholder="请输入" v-model="filters.captainName" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs mt5" type="flex" justify="start">
                    <i-form-item label="所在区域：" class="input-item">
                    <i-cascader :data="selectListObj.areaList" v-model="filters.areaIds" change-on-select filterable @on-change="userAreaListChange"></i-cascader>
                </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="诊治计划时间：" class="input-item">
                        <i-date-picker type="date" v-model="filters.consultTime" placeholder="请选择" format="yyyy-MM-dd" @on-change="onSearch" clearable></i-date-picker>
                    </i-form-item>
                </i-row>
            </i-form>
            <!-- 高级搜索列 END-->

            <template slot="page-table">
                <ux-switch-table 
                    ref="switchTable" 
                    :row-columuns="rowColumuns" 
                    :col-columuns="colColumuns"
                    :load-func="testPaginTableService.paginReport.bind(testPaginTableService)"
                    @on-row-click="onRowClick"
                    @no-data="detail = {}"
                    :initQueryParams="initQueryParams"
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
            :selectListObj="selectListObj"
            @on-refresh="onSearch"
        >
        </main-insert-update-modal>

        <opinion-modal
            ref="opinionModal"
            @on-refresh="onSearch"
            :update="testPaginTableService.updateEvaluationOpinions.bind(testPaginTableService)"
        ></opinion-modal>

        <notice-modal
            ref="noticeModal"
            @on-refresh="onSearch"
            :update="testPaginTableService.updateEvaluationOpinions.bind(testPaginTableService)"
        ></notice-modal>

        <exports-modal
            ref="exportsModal"
            :totalall="testPaginTableService.listReport.bind(testPaginTableService)"
            :exports="testPaginTableService.exportReportByReportIds.bind(testPaginTableService)"
            :selectListObj="selectListObj"
        ></exports-modal>

        <upload-modal
            ref="uploadModal"
            @on-refresh="onSearch"
            :update="testPaginTableService.saveBatchProjectFile.bind(testPaginTableService)"
        ></upload-modal>
    </div>
    
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import ManageDetail from "./detail.vue";
import { ConsultPlanService, ProjectService, DictService, SpecialTypeService, CustomerService, HiddenService, DiagnosService, ConstructService } from "src/services";
import { service } from "src/common/decorator";
import { ExtendUtils, FileUtils } from "src/common/utils";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import ExportsModal from "./_components/exports-modal.vue";
import NoticeModal from "./_components/notice-modal.vue";
import OpinionModal from "./_components/opinion-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";
import dayjs from "dayjs";
import CommonView from "src/views/common-view";
import { ApplicationContext } from "src/application";
import UploadModal from "./_components/upload-modal.vue";

@component({
    components:
    {
        OpinionModal,
        NoticeModal,
        ExportsModal,
        UploadModal,
        "u-detail": ManageDetail,
        "main-insert-update-modal": InsertUpdateModal
    }
})
export default class ManageView extends CommonView
{
    @service("ConsultPlanService")
    protected testPaginTableService: ConsultPlanService;

    @service("HiddenService")
    protected hiddenService: HiddenService;

    @service("ProjectService")
    protected projectService: ProjectService;

    @service("DictService")
    protected dictService: DictService;

    @service("SpecialTypeService")
    protected specialTypeService: SpecialTypeService;

    @service("CustomerService")
    protected customerService: CustomerService;

    @service("DiagnosService")
    protected diagnosService: DiagnosService;
    
    @service("ConstructService")
    protected constructService: ConstructService;

    /**
     * 是否展开高级搜索
     * @protected
     * @property
     */
    protected isOpenOperation: boolean = false;

    /**
     * 初始化参数
     * @property
     */
    protected initQueryParams: any =
    {

    };

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
    protected filters: any =
    {
        consultNum: undefined,
        consultTime: undefined,
        projectName: undefined,
        captainName: undefined,
        projectType: undefined,
        customerId: undefined
    };

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
            title: "姓名",
            key: "name"
        },
        {
            title: "年龄",
            key: "age"
        },
        {
            title: "性别",
            key: "gender"
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
                let nameDiv = ExtendUtils.tooltipElement(row.projectManager && row.projectManager.projectName + "诊治报告", 14, h, "280px", "strong","f18 vb");
                let tip = ExtendUtils.createTipElement(h, row.notarizeStatus ? "已确认" : "待确认", row.notarizeStatus ? "#44CB5C" : "#FEB900", false);
                // let statusTip = ExtendUtils.createStatusElement(h, row.gender, "#0DBF47", true);

                return h("div", {class: "col-container"}, [
                    h("div", {class: "content"}, [
                        // 标题部分
                        h("i-row", {class: "title"}, [
                            h("i-col", {attrs: {span: "24", class: "d-f"}}, [nameDiv, tip])
                            // h("span", {class: "status-tips"}, [statusTip])
                        ]),
                        // 说明部分
                        h("i-row", {class: "desc"}, [
                            h("i-col", {attrs: {span: "24"}}, `诊治时间：${row.beginTime || "-"}`),

                            h("i-col", {attrs: {span: "24"}}, `诊治组名：${row.consultGroupName }`)
                            
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
        this.filters.consultTime = this.filters.consultTime ? dayjs(this.filters.consultTime).format("YYYY-MM-DD") : "";

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
                this._mainInsertUpdateModal.open();
                break;
            }
            case "update":
            {
                this.openScorePage(data.id);
                break;
            }
            case "opinion":
            {
                this._opinionModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            case "notice":
            {
                this._noticeModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            case "exports":
            {
                this._exportsModal.open();
                break;
            }
            case "export":
            {
                let selectValue = [1,2,3,4,5,6,7,8,9,10];
                this.$modal.confirm({
                    title: "提示",
                    content: "您确定要导出当前报告吗？",
                    render: h =>
                    {
                        return h("i-checkbox-group",
                        {
                            props:
                            {
                                value: [1,2,3,4,5,6,7,8,9,10]
                            },
                            on:
                            {
                                "on-change": e =>
                                {
                                    selectValue = e;
                                }
                            }
                        },[
                            h("i-checkbox", { class: " mt10",  props: { label: 1, value: 1}}, "宣贯会"),
                            h("i-checkbox", { class: "ml15 mt0",  props: { label: 2, value: 2}}, "履职情况"),
                            h("i-checkbox", { class: "ml15 mt10 mr20", props: { label: 3, value: 3}}, "项目亮点"),
                            h("i-checkbox", { class: "mt10",       props: { label: 4, value: 4}}, "整改通知"),
                            h("i-checkbox", { class: "ml15 mt10",  props: { label: 5, value: 5}}, "评分情况"),
                            h("i-checkbox", { class: "ml15 mt10",props: { label: 6, value: 6}}, "补充报告"),
                            h("i-checkbox", { class: "mt10",props: { label: 7, value: 7}}, "整改意见"),
                            h("i-checkbox", { class: "mt10",props: { label: 9, value: 9}}, "安全知识"),
                            h("i-checkbox", { class: "mt10",props: { label: 10, value: 10}}, "安全日历"),
                            h("i-checkbox", { class: "ml15 mt10",props: { label: 8, value: 8}}, "项目评价")
                        ]);
                    },
                    onOk: async () =>
                    {
                        try
                        {
                            let {content} = await this.testPaginTableService.exportReportWordByConsultId(data.id, JSON.parse(JSON.stringify(selectValue)));
                            FileUtils.downloadFile(content.filePath, content.fileName);
                            
                            this.$message.success("操作成功");
                        } catch (error) {
                            this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
                break;
            }
            case "exportppt":
            {
                this.$modal.confirm({
                    title: "提示",
                    content: "您确定要导出当前简报预览吗？",
                    onOk: async () =>
                    {
                        try
                        {
                            let {content} = await this.testPaginTableService.exportReportPPTByReportId(data.id);
                            
                            FileUtils.downloadFile(content.filePath, content.fileName);
                            
                            this.$message.success("操作成功");
                        } catch (error) {
                             this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
                break;
            }
            case "delete":
            {
                this.$modal.confirm({
                    title: "提示",
                    content: "您确定要删除该数据吗？",
                    onOk: async () =>
                    {
                        try
                        {
                            await this.testPaginTableService.virtualRemoveById(data.id);
                            this.$message.success("操作成功");
                            this.onSearch();
                        } catch (error) {
                            this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
                break;
            }
            case "compele":
            {
                this.$modal.confirm({
                    title: "提示",
                    content: "确认报告吗？",
                    onOk: async () =>
                    {
                        try
                        {
                            await this.testPaginTableService.affirmConsultPlan({consultId: data.id});
                            this.$message.success("操作成功");
                            this.onSearch();
                        } catch (error) {
                            this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
                break;
            }case "upconfirm":
            {
                this.$modal.confirm({
                    title: "提示",
                    content: "确认纠错后会撤回发送给施工单位和业主单位的报告内容，确认纠错？",
                    onOk: async () =>
                    {
                        try
                        {
                            await this.testPaginTableService.goBackNotarizeStatus({consultId: data.id});
                            this.$message.success("操作成功");
                            this.onSearch();
                        } catch (error) {
                            this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
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
        if (this.detail.id)
        {
            this.getDangerStats(row.id);
            this.getEvaluationOpinionsById(row.id);
        }
    }

    protected async getDangerStats(consultId)
    {
        let res = await this.hiddenService.getDangerStats({consultId});
        this.detail.dangerStats = res;
        
    }

    protected async getEvaluationOpinionsById(consultId)
    {
        let res: any = await this.testPaginTableService.getEvaluationOpinionsById(consultId);
        this.detail.projectEvaluation = res.projectEvaluation;
        this.detail.rectificationOpinions = res.rectificationOpinions;
    }

    protected created()
    {
        this.filters.id = this.$route.query.id || undefined;
        
        this.selectList();

        let id = this.getTargetQs("id");
        if (id)
        {
            this.$set(this.initQueryParams, "id", id);
        }
    }

    /**
     * 获得选项框的数据
     * @ref
     */
    protected async selectList()
    {

        let projectList = await this.projectService.listDetails();
        this.selectListObj.projectList = projectList.content; // 项目列表

        let projectTypeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.PROJECT_TYPE);
        this.selectListObj.projectTypeList = projectTypeList; // 项目类型

        let constructionStageList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE);
        this.selectListObj.constructionStageList = constructionStageList; // 施工阶段

        this.selectListObj.specialTypesList = await this.specialTypeService.getSpecialTypeList(0); // 体系类型表 -- 标准

        let diagonal = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE);
        this.selectListObj.diagonalList = diagonal; // 诊治类型

        let groundName = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.GROUP_NAME);
        this.selectListObj.groundName = groundName; // 诊治组名

        let getLeaders2 = await this.diagnosService.getLeaders({roleId: 2});
        this.selectListObj.getLeaders2 = getLeaders2.content; // 诊治组员

        let getLeaders3 = await this.diagnosService.getLeaders({roleId: 3});
        this.selectListObj.getLeaders3 = getLeaders3.content; // 诊治组长

        let areaList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.AD_AREA);
        this.selectListObj.areaList = [];
        this.areaTree(null, areaList);// 所在区域
        
        let customerList = await this.customerService.list();
        this.selectListObj.customerList = customerList.content; // 业主方列表

        let constructionListAdd = await this.constructService.list();
        this.selectListObj.constructionListAdd = constructionListAdd.content; // 施工方列表 新增
    }
        
    /**
     * 处理区域架构
     * @ref
     */
    protected areaTree(parentData: any = {}, data: any): any
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
                    item.children = this.areaTree(item, data);
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
                item.children = this.areaTree(item, data);
                this.selectListObj.areaList.push(item);
            });
        }
    }
    
    /**
     * switchTable组件类
     * @ref
     */
    protected get _switchTable(): any
    {
        return this.$refs["switchTable"] as any;
    }

    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _mainInsertUpdateModal(): InsertUpdateModal
    {
        return this.$refs["mainInsertUpdateModal"] as InsertUpdateModal;
    }

    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _uploadModal(): UploadModal
    {
        return this.$refs["uploadModal"] as UploadModal;
    }

    /**
     * 整改意见弹层
     * @ref
     */
    protected get _opinionModal(): OpinionModal
    {
        return this.$refs["opinionModal"] as OpinionModal;
    }
    
    /**
     * 项目评价弹层
     * @ref
     */
    protected get _noticeModal(): NoticeModal
    {
        return this.$refs["noticeModal"] as NoticeModal;
    }
        
    /**
     * 项目导出弹层
     * @ref
     */
    protected get _exportsModal(): ExportsModal
    {
        return this.$refs["exportsModal"] as ExportsModal;
    }
}
</script>

<style lang="less" scoped>
.manage-view
{
    height: 100%;
    /deep/.ivu-rate-star
    {
        margin-right: 1px;
    }
}
</style>