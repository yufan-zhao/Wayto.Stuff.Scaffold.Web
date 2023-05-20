<template>
    <div class="manage-view">
        <u-page-content :class="{open: isOpenOperation}" :isOpenOperation="isOpenOperation">
            <i-form slot="search-left" ref="searchBox" @submit.native.prevent>
                <i-form-item label="关键字：">
                    <i-input placeholder="文章名" v-model="filters.title" @on-clear="onSearch" @keyup.native.enter="onSearch" clearable></i-input>
                </i-form-item>
                
                <i-form-item label="文章类型：">
                   <i-select  v-model="filters.standardAtlasType" maxlength="20" @on-change="onSearch" clearable>
                        <i-option v-for="item in selectListObj.typeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                    </i-select> 
                </i-form-item>

                <i-form-item label="发布日期：">
                    <i-date-picker type="date" v-model="releaseDate" placeholder="请选择" format="yyyy-MM-dd"  @on-change="onSearch" clearable></i-date-picker>
                </i-form-item>

                <i-form-item>
                    <i-button type="primary" @click="onSearch">查询</i-button>
                    <i-button type="info" @click="onReset">重置</i-button>
                    <!-- <i-button type="info" @click="isOpenOperation = !isOpenOperation">{{isOpenOperation ? "收起" : "高级搜索"}}</i-button> -->
                </i-form-item>
            </i-form>

            <template slot="operation-btn">
                <i-button type="primary" @click="onOperations('insert')" v-permission="permissionCode.KNOWLEDGE_ATLAS_XZ">新增</i-button>
            </template>

            <!-- 高级搜索列 BEGIN-->
            <i-form slot="senior">
                <i-row class="row-inputs" type="flex" justify="start">
                    <i-form-item class="input-item" label="客户名称：">
                        <i-input placeholder="项目名称/编号/施工单位/姓名/手机"></i-input>
                    </i-form-item>
                </i-row>
            </i-form>
            <!-- 高级搜索列 END-->

            <template slot="page-table">
                <ux-switch-table 
                    ref="switchTable" 
                    :row-columuns="rowColumuns" 
                    :col-columuns="colColumuns"
                    :load-func="testPaginTableService.paginatlas.bind(testPaginTableService)"
                    @on-row-click="onRowClick"
                    @no-data="detail = {}"
                >
                    <template slot="detail">
                        <u-detail ref="detail" :detail="detail" :editAuthCode="permissionCode.KNOWLEDGE_ATLAS_BJ" :deleteAuthCode="permissionCode.KNOWLEDGE_ATLAS_SC" @operations="onOperations"></u-detail>
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
import { KnowledgeService, DictService } from "src/services";
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
    @service("KnowledgeService")
    protected testPaginTableService: KnowledgeService;

    @service("DictService")
    protected dictService: DictService;

    /**
     * 辅助数据
     * @protected
     * @property
     */
    protected selectListObj: any = {};
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
    protected filters: any = {};

    protected releaseDate = "";

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
                let nameDiv = ExtendUtils.tooltipElement(row.title, 14, h, "300px", "strong","f18 vb");
                let tip = ExtendUtils.createTipElement(h, "草稿", "#FF4D3F", false);

                return h("div", {class: "col-container"}, [
                    h("div", {class: "content"}, [
                        // 标题部分
                        h("i-row", {class: "title"}, [
                            h("i-col", {attrs: {span: "24"}}, [nameDiv, row.release ? "" : tip])
                        ]),
                        // 说明部分
                        h("i-row", {class: "desc"}, [
                            h("i-col", {attrs: {span: "24"}}, `${row.releaseDate || row.createTime || "-"}`)
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
        if(this.releaseDate)
        {
            this.filters.releaseDate = dayjs(this.releaseDate).format("YYYY-MM-DD");
        }
        else
        {
            this.filters.releaseDate = "";
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
        // this.onSearch();
        this.releaseDate = "";
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
                this._mainInsertUpdateModal.open({knowledgeType: 2});
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
                    content: "您确定要删除该文章吗？",
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
        this.getListObj();
    }

    protected async getListObj()
    {
        
        let typeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE);
        this.selectListObj.typeList = typeList; // 标准图集类型 
        // this.selectListObj
    }
}
</script>

<style lang="less" scoped>
.manage-view
{
    height: 100%;
}
</style>