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
                <i-form-item label="问题隐患状态：">
                    <i-select  v-model="filters.mendStatus" maxlength="20" @on-change="onSearch" clearable>
                        <i-option :value="1">已闭合</i-option>
                        <i-option :value="0">未闭合</i-option>
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
            </template>

            <!-- 高级搜索列 BEGIN-->
            <i-form slot="senior">
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="诊治组：" class="input-item">
                        <i-select v-model="filters.consultGroup" maxlength="20" @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.groundName" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs mt5" type="flex" justify="start">
                    <i-form-item label="所在区域：" class="input-item">
                    <i-cascader :data="selectListObj.areaList" v-model="filters.areaIds" change-on-select filterable @on-change="userAreaListChange"></i-cascader>
                </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="业主单位：" class="input-item">
                        <i-select  v-model="filters.customerId" maxlength="20" @on-change="onSearch" clearable>
                            <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                        </i-select> 
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item label="诊治时间：" class="input-item">
                        <i-date-picker type="date" v-model="filters.beginTime" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%" @on-change="onSearch" clearable></i-date-picker>
                    </i-form-item>
                </i-row>
            </i-form>
            <!-- 高级搜索列 END-->

            <template slot="page-table">
                <ux-switch-table 
                    ref="switchTable" 
                    class="recity"
                    :row-columuns="rowColumuns" 
                    :col-columuns="colColumuns"
                    :load-func="testPaginTableService.paginRecify.bind(testPaginTableService)"
                    @on-row-click="onRowClick"
                    @no-data="detail = {}"
                    
                >
                <!-- :initQueryParams="{status: 3}" -->
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
        >
        </main-insert-update-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import ManageDetail from "./detail.vue";
import { ConsultPlanService, ProjectService, DictService, SpecialTypeService, CustomerService,  HiddenService } from "src/services";
import { service } from "src/common/decorator";
import { ExtendUtils, FileUtils } from "src/common/utils";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";
import dayjs from "dayjs";
import fileUtils from "src/common/utils/file-utils";

@component({
    components:
    {
        "u-detail": ManageDetail,
        "main-insert-update-modal": InsertUpdateModal
    }
})
export default class ManageView extends CommonView
{
    @service("ConsultPlanService")
    protected testPaginTableService: ConsultPlanService;

    @service("ProjectService")
    protected projectService: ProjectService;

    @service("DictService")
    protected dictService: DictService;

    @service("SpecialTypeService")
    protected specialTypeService: SpecialTypeService;

    @service("CustomerService")
    protected customerService: CustomerService;

    @service("HiddenService")
    protected hiddenService: HiddenService;

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
            title: "问题隐患",
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
                let nameDiv = ExtendUtils.tooltipElement(row.projectManager && row.projectManager.projectName || "-", 14, h, "250px", "strong","f18 vb");
                let tip = ExtendUtils.createTipElement(h, row.mendStatus ? "已经闭合" : "未闭合", row.mendStatus ? "#0DBF47" : "#FEB900", false,"52px","120px");
                let statusTip = ExtendUtils.createStatusElement(h, row.gender, "#FF4D3F", true);
                let tips = ExtendUtils.createTipElement(h, row.notarizeStatus ? "已确认" : "待确认", row.notarizeStatus ? "#44CB5C" : "#FEB900", false,"52px","120px");

                return h("div", {class: "col-container"}, [
                    h("div", {class: "content"},
                    [
                        // 标题部分
                        h("i-row", {class: "title"}, [
                            h("i-col", {attrs: {span: "24", class: "d-f"}}, [nameDiv, tip,tips])
                            // h("span", {class: "status-tips"}, [statusTip])
                        ]),
                        // 说明部分
                        h("i-row", {class: "desc"}, [
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
        this.filters.beginTime = this.filters.beginTime ? dayjs(this.filters.beginTime).format("YYYY-MM-DD") : "";
    
        this._switchTable.search(this.filters);
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
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)));
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
                            this.$message.success("操作失败：" + error);
                        }
                    }
                });
                break;
            }
            case "export":
            {
                let selectValue = [1,2,3,4,5,6,7,8];
                this.$modal.confirm({
                    title: "提示",
                    content: "您确定要导出当前报告吗？",
                    // render: h =>
                    // {
                    //     return h("i-checkbox-group",
                    //     {
                    //         props:
                    //         {
                    //             value: [1,2,3,4,5,6,7,8]
                    //         },
                    //         on:
                    //         {
                    //             "on-change": e =>
                    //             {
                    //                 selectValue = e;
                    //             }
                    //         }
                    //     },[
                    //         // h("i-checkbox", { class: "mt10",  props: { label: 1, value: 1}}, "宣贯会"),
                    //         // h("i-checkbox", { class: "ml15 mt10",  props: { label: 2, value: 2}}, "履职情况"),
                    //         // h("i-checkbox", { class: "ml15 mt10 ", props: { label: 3, value: 3}}, "项目亮点"),
                    //         // h("i-checkbox", { class: "mt10",       props: { label: 4, value: 4}}, "整改通知"),
                    //         // h("i-checkbox", { class: "ml15 mt10",  props: { label: 5, value: 5}}, "评分情况"),
                    //         // h("i-checkbox", { class: "ml15 mt10",props: { label: 6, value: 6}}, "补充报告"),
                    //         // h("i-checkbox", { class: "mt10",props: { label: 7, value: 7}}, "整改意见"),
                    //         // h("i-checkbox", { class: "ml15 mt10",props: { label: 8, value: 8}}, "项目评价")

                    //     ]);
                    // },
                    onOk: async () =>
                    {
                        try
                        {
                            let {content} = await this.testPaginTableService.exportDangerWordByConsultId(data.id, JSON.parse(JSON.stringify(selectValue)));
                            
                            FileUtils.downloadFile(content.filePath, content.fileName);
                            
                            this.$message.success("操作成功");
                        } catch (error) {
                            this.$message.error("操作失败," + error.msg);
                        }
                    }
                });
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
     * 触发列表选中操作
     * @member
     * @protected
     * @returns {void}
     */
    protected async onRowClick(row: any, index?: number): Promise<void>
    {
        this.detail = row || {};
    }

    protected created()
    {
        this.selectList();
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

        // this.selectListObj.specialTypesList = await this.specialTypeService.getSpecialTypeList(0); // 体系类型表 -- 标准

        let diagonal = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE);
        this.selectListObj.diagonalList = diagonal; // 诊治类型

        let groundName = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.GROUP_NAME);
        this.selectListObj.groundName = groundName; // 诊治组名

        let groundUser = await this.customerService.list();
        this.selectListObj.groundUser = groundUser.content; // 诊治组员

        let areaList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.AD_AREA);
        this.selectListObj.areaList = [];
        this.areaTree(null, areaList);// 所在区域
        
        let customerList = await this.customerService.list();
        this.selectListObj.customerList = customerList.content; // 业主方列表
        // console.log(customerList);
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
}
</script>

<style lang="less" scoped>
.manage-view
{
    height: 100%;
}
.recity
{
    /deep/.col-container 
    {
        .content .title .title-tip
        {
            padding: 0;
        }
        
    }
}

</style>