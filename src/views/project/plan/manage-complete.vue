<template>
    <div class="manage-view">
        <u-page-content :class="{open: isOpenOperation}" :isOpenOperation="isOpenOperation">
            <i-form slot="search-left" ref="searchBox" @submit.native.prevent>
                <i-form-item label="关键字：">
                    <i-input placeholder="诊治编号" v-model="filters.consultNum" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>

                <i-form-item label="项目名称：" class="input-item">
                    <i-input placeholder="请输入" v-model="filters.projectName" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable style="width: 100%"></i-input>
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
                <!-- <i-button type="primary" @click="onOperations('export')" v-permission="permissionCode.PLAN_COMPLETE_DC">导出</i-button> -->
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
                    <!-- <i-form-item class="input-item" label="客户名称：">
                        <i-input placeholder="项目名称/编号/施工单位/姓名/手机"></i-input>
                    </i-form-item> -->
                    <i-form-item label="诊治组长：" class="input-item">
                        <i-input placeholder="请输入" v-model="filters.captainName" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs mt5" type="flex" justify="start">
                    <i-form-item label="所在区域：">
                        <i-cascader :data="selectListObj.areaList" v-model="filters.areaIds" change-on-select filterable @on-change="userAreaListChange"></i-cascader>
                    </i-form-item>
                </i-row>
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="诊治计划时间：" >
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
                    :load-func="testPaginTableService.paginComplement.bind(testPaginTableService)"
                    @on-row-click="onRowClick"
                    @no-data="detail = {}"
                    :initQueryParams="initQueryParams"
                >
                    <template slot="detail">
                        <u-detail ref="detail" :detail="detail" :createPlanAuthCode="permissionCode.PLAN_COMPLETE_CJJH" @operations="onOperations"></u-detail>
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
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import ManageDetail from "./detail.vue";
import { ConsultPlanService, ProjectService, DictService, SpecialTypeService, CustomerService, HiddenService, DiagnosService  } from "src/services";
import { service } from "src/common/decorator";
import { ExtendUtils } from "src/common/utils";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";
import dayjs from "dayjs";

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

    @service("DiagnosService")
    protected diagnosService: DiagnosService;

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
     * 初始化参数
     * @property
     */
    protected initQueryParams: any =
    {
        status: 2
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
                let nameDiv = ExtendUtils.tooltipElement(row.projectManager && row.projectManager.projectName || "-" , 14, h, "300px", "strong","f18 vb");
                let tip = ExtendUtils.createTipElement(h, row.projectManager && row.projectManager.projectTypeName || "", "#0DBF47", false);
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
                            h("i-col", {attrs: {span: "18"}}, `诊治组长：${row.captainCustomer && row.captainCustomer.name || "-"}（${row.captainCustomer && row.captainCustomer.mobile}）`),
                            h("i-col", {attrs: {span: "6"}},
                            [
                                h("i-rate",
                                {
                                    attrs: {
                                        value: row.priority,
                                        count: row.priority,
                                        disabled: true
                                    }
                                })
                            ]),
                            // h("i-col",  {attrs: {span: "24"}}, `诊治日期：${row.consultTime} ${row.timeMark ? "下午" : "上午"}`)
                            h("i-col",  {attrs: {span: "24"}}, `诊治日期：${row.beginTime}`)
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
                this._mainInsertUpdateModal.open({},0);
                break;
            }
            case "update":
            {
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)),0);
                break;
            }
            case "copy":
            {
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)),"copy");
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
                            this.$message.error("操作失败：" + error.msg);
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

        let getLeaders2 = await this.diagnosService.getLeaders({}); // roleId: 2
        this.selectListObj.getLeaders2 = getLeaders2.content; // 诊治组员

        let getLeaders3 = await this.diagnosService.getLeaders({roleId: 3});
        this.selectListObj.getLeaders3 = getLeaders3.content; // 诊治组长

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