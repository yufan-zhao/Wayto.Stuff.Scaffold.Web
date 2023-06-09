<template>
    <div class="manage-view">
        <u-page-content :class="{open: isOpenOperation}" :isOpenOperation="isOpenOperation">
            <i-form slot="search-left" ref="searchBox" @submit.native.prevent>
                <i-form-item label="关键字：">
                    <i-input placeholder="名称/编号" v-model="filters.keywords" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>
                <i-form-item label="工具类型：">
                    <i-select  v-model="filters.toolType" maxlength="20" @on-change="onSearch" clearable>
                        <i-option v-for="item in selectListObj.toolsTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                    </i-select> 
                </i-form-item>
                <i-form-item label="购入日期：">
                    <i-date-picker type="date" v-model="buyDate" placeholder="请选择" format="yyyy-MM-dd"  @on-change="onSearch" clearable></i-date-picker>
                </i-form-item>

                <i-form-item>
                    <i-button type="primary" @click="onSearch">查询</i-button>
                    <i-button type="info" @click="onReset">重置</i-button>
                    <i-button type="info" @click="isOpenOperation = !isOpenOperation">{{isOpenOperation ? "收起" : "高级搜索"}}</i-button>
                </i-form-item>
            </i-form>

            <template slot="operation-btn">
                <i-poptip trigger="click" title="导入/导出" content="content">
                    <i-button type="info" v-permission="''">导入/导出</i-button>
                    <section slot="content">
                        <i-button type="info" @click="onOperations('import')">导入</i-button>
                        <i-button type="info" @click="onOperations('export')">导出</i-button>
                    </section>
                </i-poptip>
                <i-button type="primary" @click="onOperations('insert')" v-permission="permissionCode.TOOL_XZ">新增</i-button>
            </template>

            <!-- 高级搜索列 BEGIN-->
            <i-form slot="senior">
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="存放地点：" @on-change="onSearch" clearable>
                        <i-select  v-model="filters.storageLocation" maxlength="20">
                            <i-option v-for="item in selectListObj.toolsAreaList" :key="item.id" :value="item.id">{{item.addr}}</i-option>
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
        <in-modal
            ref="inModal"
            :insert="testPaginTableService.addReceive.bind(testPaginTableService)"
            :selectListObj="selectListObj"
            @on-refresh="onSearch"
        >
        </in-modal>
        <out-modal
            ref="outModal"
            :insert="testPaginTableService.addReturn.bind(testPaginTableService)"
            :selectListObj="selectListObj"
            @on-refresh="onSearch"
        >
        </out-modal>

        <import-modal
            ref="improtsModal"
            :imports="testPaginTableService.uploadTools.bind(testPaginTableService)"
            @on-refresh="onSearch"
        >
        </import-modal>
        <export-modal
            ref="exportModal"
            :filters="filters"
            :selectListObj="selectListObj"
            :exports="testPaginTableService.exportExcel.bind(testPaginTableService)"
            :totalall="testPaginTableService.list.bind(testPaginTableService)"
        ></export-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import ManageDetail from "./detail.vue";
import { ToolsService, DictService, CustomerService, OrgService, ConstructService, DiagnosService, HiddenService } from "src/services";
import { service } from "src/common/decorator";
import { ExtendUtils } from "src/common/utils";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import InModal from "./_components/in-modal.vue";
import OutModal from "./_components/out-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";
import dayjs from "dayjs";
import ImportModal from "./_components/imports-modal.vue";
import ExportModal from "./_components/export-modal.vue";
@component({
    components:
    {
        InModal,
        OutModal,
        ImportModal,
        ExportModal,
        "u-detail": ManageDetail,
        "main-insert-update-modal": InsertUpdateModal
    }
})
export default class ManageView extends CommonView
{
    @service("ToolsService")
    protected testPaginTableService: ToolsService;

    @service("DictService")
    protected dictService: DictService;

    @service("OrgService")
    protected orgService: OrgService;

    @service("CustomerService")
    protected customerService: CustomerService;

    @service("ConstructService")
    protected constructService: ConstructService;

    @service("DiagnosService")
    protected diagnosService: DiagnosService;

    @service("HiddenService")
    protected hiddenService: HiddenService;

    /**
     * 是否展开高级搜索
     * @protected
     * @property
     */
    protected isOpenOperation: boolean = false;

    /**
     * 筛选来源数据集合（除去分页）
     * @property
     */
    protected selectListObj: any = {};

    /**
     * 当前项详情
     * @protected
     * @property
     */
    protected detail: any = {};

    // 买入时间
    protected buyDate: any = "";

    /**
     * 筛选条件（除去分页）
     * @property
     */
    protected filters: any =
    {
        storageLocation: null,
        keywords: null,
        buyDate: null,
        toolType : null
    };

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
                let nameDiv = ExtendUtils.tooltipElement(`${row.deviceName}(${row.toolsNumber})`, 14, h, "300px", "strong","f18 vb");
                let tip = ExtendUtils.createTipElement(h, "重大风险", "#FF4D3F", false);
                let statusTip = ExtendUtils.createStatusElement(h, row.gender, "#FF4D3F", true);

                return h("div", {class: "col-container"}, [
                    h("div", {class: "content"}, [
                        // 标题部分
                        h("i-row", {class: "title"}, [
                            h("i-col", {attrs: {span: "24"}}, [nameDiv])
                            // h("span", {class: "status-tips"}, [statusTip])
                        ]),
                        // 说明部分
                        h("i-row", {class: "desc"}, [
                            h("i-col", {attrs: {span: "24"}}, `数量：${row.amount || "-"}`),
                            h("i-col",
                                {attrs: {span: "24"}},
                                `存放地：${row.storageLocationName}`)
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
        if(this.buyDate)
        {
            this.filters.buyDate = dayjs(this.buyDate).format("YYYY-MM-DD");
        }
        else
        {
            this.filters.buyDate = "";
        }
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
                this._mainInsertUpdateModal.open({});
                break;
            }
            case "update":
            {
                this._mainInsertUpdateModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            case "in":
            {
                this._inModal.open(JSON.parse(JSON.stringify(data)));
                break;
            }
            case "out":
            {
                this._outModal.open(JSON.parse(JSON.stringify(data)));
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
        this.getLyghjl();
    }
    
    protected async getLyghjl()
    {
        let content = await this.testPaginTableService.getLyghjl({toolsInstrumentId: this.detail.id});
        console.log(content[0]);
        
        this.selectListObj.stage = [content[0]];
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

    private get _inModal(): InModal
    {
        return this.$refs["inModal"] as InModal;
    }

    private get _outModal(): OutModal
    {
        return this.$refs["outModal"] as OutModal;
    }
    
    protected created()
    {
        this.filters.id = this.$route.query.id || undefined;
        
        this.selectList();
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
     * 获得选项框的数据
     * @ref
     */
    protected async selectList()
    {
        
        let toolsTypeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.TOOL_TYPE);
        this.selectListObj.toolsTypeList = toolsTypeList; // 工具类型

        let toolsAreaList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.TOOL_CRIB);
        this.selectListObj.toolsAreaList = toolsAreaList; // 工具存放地点

        let customerList = await this.customerService.list();
        this.selectListObj.customerList = customerList.content; // 业主方列表

        let constructionList = await this.constructService.list();
        this.selectListObj.constructionList = constructionList.content; // 施工方列表

        let supervisingList = await this.diagnosService.list();
        this.selectListObj.supervisingList = supervisingList.content; // 监理方列表?诊治
        
        let orgRree = await this.orgService.tree();
        this.selectListObj.orgRree = [];
        this.transferTree(null, orgRree.children);// 责任部门
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
}
</script>

<style lang="less" scoped>
.manage-view
{
    height: 100%;
}
</style>