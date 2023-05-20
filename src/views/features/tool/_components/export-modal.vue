<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="836"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form ml20" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="12">
                        <i-form-item label="工器具类型：" class="customed-form-item " :label-width="110">
                           <i-select  v-model="filters.toolType" maxlength="20"  @on-change="getList" clearable>
                                <i-option v-for="item in selectListObj.toolsTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                       <i-form-item label="购入日期：" class="customed-form-item" :label-width="90">
                            <i-date-picker type="date" v-model="buyDate" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%" @on-change="getList" clearable></i-date-picker>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                       <i-form-item class="customed-form-item" label="存放地点：" :label-width="110">
                            <i-select  v-model="filters.storageLocation" maxlength="20"  @on-change="getList" clearable>
                                <i-option v-for="item in selectListObj.toolsAreaList" :key="item.id" :value="item.id">{{item.addr}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-table class="table-normal mb20" ref="tables" :data="data" :columns="columuns2"></i-table>
            </i-form>
        </template>
        <template v-slot:footer>
            <i-button type="info" @click="onClosed">取消</i-button>

            <i-button type="primary" @click="onOps('submit')">导出</i-button>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { ApplicationContext } from "src/application";
import { ExtendUtils, FileUtils } from "src/common/utils";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class ExportsModal extends CommonView
{
    
    /**
     * 导出接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected exports: Function;

    // 买入时间
    protected buyDate: any = "";
    
    /**
     * 列表数据接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected totalall: Function;

    /**
     * 列表数据接口
     * @protected
     * @config
     */
    @config({required: true, type: Object})
    protected selectListObj: any;

    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "";
    protected reportTime: string = "";

    protected filters: any = {};

    protected options: any = [];

    /**
     * 表单对象
     * @protected
     * @property
     */
    protected formModel: any =
    {
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
    };

    protected data: any = [];

    protected get columuns2(): Array<any>
    {
        return [
            {
                type: "index",
                width: 90,
                title: "序号",
                align: "center"
            },
            {
                title: "名称",
                key: "deviceName"
            },
            {
                title: "规格型号",
                key: "specifications"
            },
            {
                title: "操作",
                render: (h, {row,index}: any) =>
                {
                    let _this = this;
                    return h("div", {
                        class: "font-main cursor-pointer",
                        on:
                        {
                            click: () =>
                            {
                                _this.data.splice(index,1);
                                (_this.$refs["tables"] as any).clearCurrentRow();
                            }
                        }
                    },"移除");
                }
            }
        ];
    }
    
    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
       
        this.title = "导出";
        // this.formModel = {
        //     id: data.id,
        //     projectEvaluation: data.projectEvaluation || undefined
        // };
       
        this._curdModal.open();
    }

    protected async getList()
    {
        if(this.buyDate)
        {
            this.filters.buyDate = dayjs(this.buyDate).format("YYYY-MM-DD");
        }
        else
        {
            this.filters.buyDate = null;
        }
        this.data = await this.totalall(this.filters);
    }

    /**
     * 弹层操作事件
     * @param type 操作方式
     */
    protected onOps(type: string, onValidateFailed: Function)
    {
        if (type === "submit")
        {
            this._form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                try
                {
                    let projectIds = this.data.map(item => item.id);

                    // 导出
                    // let { content } = await this.exports(projectIds.join(","));
                    this.$message.success("提交成功");
                    
                    FileUtils.downloadFile(ApplicationContext.current.settings.mainOriginUrl + ApplicationContext.current.settings.mainPrefix + `/tools/instruments/exportExcel?ids=${projectIds.join(",")}`, dayjs().format("YYYY-MM-DD") + "工器具");
                    
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                    onValidateFailed();
                }
            });
        }
        else
        {
            this._curdModal.close();
        }
    }

    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.formModel = {};
        this._form.resetFields();
    }

    /**
     * 表格ref
     * @private
     */
    protected get _form(): any
    {
        return this.$refs["form"] as any;
    }
    /**
     * 弹层实例
     * @private
     * @ref
     */
    protected get _curdModal(): any
    {
        return this.$refs["curdModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.customed-form
{
    padding: 30px 30px 0 5px;
}
.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
        text-align: center;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        text-align: center;
    }
}
</style>