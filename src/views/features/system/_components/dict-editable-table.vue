<template>
    <div class="editable-table">
        <i-table
            :data="tableData"
            :columns="columns"
        >

            <!-- 启用/禁用 -->
            <template slot-scope="{ row }" slot="enable">
                <i-switch v-if="row.isEditing" v-model="row.enable" @on-change="val => row.enable = val"></i-switch>
                <span v-else class="status-container" :class="row.enable ? 'enable' : 'disable'">
                    <span class="dot"></span>
                    <span>{{row.enable ? "启用" : "禁用"}}</span>
                </span>
            </template>

            <!-- 操作 -->
            <template slot-scope="{ row, index }" slot="action">
                <a class="btn" @click="onOps('edit', row, index)" v-if="!row.isEditing" v-permission="editAuthCode">编辑</a>
                <a class="btn" @click="onOps('delete', row, index)" v-if="!row.isEditing" v-permission="deleteAuthCode">删除</a>

                <i-button class="edit-btn" type="info" v-if="row.isEditing" @click="onOps('save', row, index)" :loading="row.isLoading">
                    <!-- <i class="iconfont iconicon_queren" v-if="!row.isLoading"></i> -->
                    <Icon :size="26" type="ios-checkmark" v-if="!row.isLoading" />
                </i-button>
                <i-button class="edit-btn" type="info" v-if="row.isEditing" @click="onOps('cancel', row, index)">
                    <!-- <i class="iconfont iconicon_quxiao"></i> -->
                    <Icon :size="26" type="ios-close" />
                </i-button>
            </template>
        </i-table>

        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";

@component
export default class DictEditableTable extends CommonView
{
    /**
     * 传入的表格数据
     * @protected
     * @config
     */
    @config({required: true, type: Array, default: []})
    protected value: Array<any>;

    /**
     * 表格格式JSON
     * 如果有值，表示开启extend模式
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected columnFormat: any;

    @config({required: false, default: false})
    protected readonly: boolean;

    /**
     * 增加方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected insert: Function;

    /**
     * 更新方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected update: Function;

    /**
     * 删除方法
     * @protected
     * @config
     */
    @config({required: false, type: Function})
    protected delete: Function;

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
     * 临时存储的行内容
     * @protected
     * @property
     */
    protected tempRowJSON: string;

    /**
     * 上一个编辑列
     */
    protected isEditing: boolean = false;

    /**
     * 表格数据
     * @protected
     * @property
     */
    protected tableData: Array<any> = [];

    /**
     * 表头
     * @protected
     * @property
     */
    protected columns: Array<any> = [];

    /**
     * position类型自定义组件存储空间
     * @protected
     * @property
     */
    protected positionComponentsIsShow: boolean = false;

    /**
     * 传入的表格数据监听
     * @protected
     * @watch
     */
    @watch("value", {immediate: true})
    protected valueWatcher(val: Array<any>)
    {
        this.columns = [];
        this.tableData = [];

        const columns: Array<any> = [];
        const tableData: Array<any> = [];

        // 如果是自定义表格
        if (this.columnFormat)
        {
            // 字段解析
            let primaryKey: string;
            let customedColumnsJSONObject = JSON.parse(this.columnFormat);
            customedColumnsJSONObject.forEach(item =>
            {
                if (!item.slot)
                {
                    // 给自定义列添加render方法
                    item.render = this.resolveRender(item);
                }
                if (item.primary)
                {
                    primaryKey = item.key;
                }
                // iview列数组
                columns.push(item);
            });

            // 处理表单数据
            val.forEach(item =>
            {
                let extendObject: any = item.extend ? JSON.parse(item.extend) : {};
                let temp: any =
                {
                    isEditing: false,
                    isTempRow: false,
                    isLoading: false,
                    ...item,
                    ...extendObject,
                    name: extendObject[primaryKey]
                };
                if (!item.id)
                {
                    temp.isEditing = true;
                    temp.isTempRow = true;
                    this.isEditing = true;
                }
                tableData.push(temp);
            });
        }
        else
        {
            columns.push({
                title: "名称",
                key: "name"
            });

            // 处理表单数据
            val.forEach(item =>
            {
                let temp: any =
                {
                    isEditing: false,
                    isTempRow: false,
                    isLoading: false,
                    ...item
                };
                if (!item.id)
                {
                    temp.isEditing = true;
                    temp.isTempRow = true;
                    this.isEditing = true;
                }
                tableData.push(temp);
            });
        }

        columns.push({
            title: "状态",
            slot: "enable"
        });
        if (!this.readonly)
        {
            columns.push({
                title: "操作",
                slot: "action"
            });
        }

        this.columns = columns;
        this.tableData = tableData;
        this.isEditing = false;
        // console.log("table", this.tableData);
    }

    /**
     * 操作
     * @protected
     * @member
     */
    protected async onOps(opName: string, row: any, i: number)
    {
        if (opName === "edit")
        {
            if (this.isEditing)
            {
                this.$message.warning("请先完成编辑");
                return;
            }
            this.isEditing = true;

            this.tempRowJSON = JSON.stringify(row);
            this.$set(row, "isEditing", true);
            // console.log(row);
        }
        else if (opName === "delete")
        {
            this.$warningModal.open({
                title: "提示",
                content: "是否删除该项？",
                onOk: async () =>
                {
                    try
                    {
                        await this.delete(row.id);
                        this.$message.success("删除成功");
                        this.$emit("on-refresh");
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
        else if (opName === "cancel")
        {
            this.$emit("on-refresh");
        }
        else if (opName === "save")
        {
            this.$set(row, "isLoading", true);
            if (row.isTempRow)
            {
                try
                {
                    // 字段校验在插入方法中做
                    const dict = this.restoreDict(row);
                    await this.insert(dict);
                    this.$message.success("新增成功");
                    this.$emit("on-refresh");
                }
                catch (err)
                {
                    this.$message.error(err.msg || err.message);
                    this.$set(row, "isLoading", false);
                }
            }
            else
            {
                try
                {
                    // 字段校验在个更新方法中做
                    const dict = this.restoreDict(row);
                    await this.update(dict);
                    this.$message.success("编辑成功");
                    this.$emit("on-refresh");
                }
                catch (err)
                {
                    this.$message.error(err.msg || err.message);
                    this.$set(row, "isLoading", false);
                }
            }
        }
    }

    /**
     * 恢复一个数据字典类型
     * @private
     * @param row 行信息
     */
    private restoreDict(row: any): any
    {
        const dict: any = {};

        if (this.columnFormat)
        {
            // 自定义表头
            let extend: any = {};
            let errList = [];
            this.columns.forEach(item =>
            {
                if (item.primary)
                {
                    dict.name = row[item.key];
                }
                extend[item.key] = row[item.key];
                if (item.required && !row[item.key])
                {
                    errList.push(`${item.title}不能为空`);
                }
                if (item.required && row[item.key])
                {
                    if (!String(row[item.key]).trim())
                    {
                        errList.push(`${item.title}不能为空`);
                    }
                }
            });
            if (errList[0])
            {
                throw new Error(errList[0]);
            }
            dict.extend = JSON.stringify(extend);
        }
        else
        {
            // 普通字典
            dict.name = row.name;
        }

        dict.id = row.id;
        dict.parentId = row.parentId;
        dict.enable = row.enable;
        dict.enumValue = row.enumValue;

        return dict;
    }

    /**
     * 为自定义表头增加render函数
     * @private
     * @param type 自定义组件类型 目前支持text
     * @param key 自定义表头的字段名
     */
    private resolveRender(item: {type: "text" | "switch" | "select" | "number" | "org-select"; key: string; source?: Array<{name: string; value: number | string; enable: boolean}>})
    {
        let type = item.type;
        let key = item.key;
        let source = item.source;
        return function(h, params)
        {
            if (params.row.isEditing)
            {
                if (type === "text")
                {
                    return h("i-input", {
                        props: { value: params.row[key] },
                        on: { "on-change": e => params.row[key] = e.target.value }
                    });
                }
                else if (type === "number")
                {
                    return h("i-input", {
                        props: { value: params.row[key], type: "number" },
                        on: { "on-change": e => params.row[key] = e.target.value }
                    });
                }
                else if (type === "switch")
                {
                    return h("i-switch", {
                        props: { value: params.row[key] },
                        on: { "on-change": v => params.row[key] = v }
                    });
                }
                else if (type === "select")
                {
                    let options = source.filter(item => item.enable).map(item =>
                    {
                        return h("i-option", {
                            props: { value: item.value }
                        }, item.name);
                    });

                    return h("i-select", {
                        props: { value: params.row[key], transfer: true, disabled: false },
                        on: { "on-change": v => params.row[key] = v }
                    }, [
                        ...options
                    ]);
                }
                else if (type === "org-select")
                {
                    return h("b-org-select", {
                        props: {data: item.source, value: params.row[key]},
                        on: { "on-change": v => params.row[key] = v }
                    });
                }
                else
                {
                    // TODO
                }
            }
            else
            {
                if (type === "text")
                {
                    return h("span", params.row[key]);
                }
                else if (type === "number")
                {
                    return h("span", params.row[key]);
                }
                else if (type === "switch")
                {
                    return h("span", {class: {"status-container": true, enable: params.row[key], disable: !params.row[key]}}, [
                        h("span", {class: "dot"}),
                        h("span", params.row[key] ? "是" : "否")
                    ]);
                }
                else if (type === "select")
                {
                    // 通过id匹配中文
                    const t = source.find(item => item.value === Number(params.row[key]));
                    return h("span", t ? t.name : "-");
                }
                else if (type === "org-select")
                {
                    return h("b-org-select", {
                        props: {data: item.source, disabled: true, value: params.row[key]}
                    });
                }
                else
                {
                    // TODO
                }
            }
        };
    }

    /**
     * 警告弹层
     * @private
     * @returns {any}
     */
    private get $warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }

    private get _cityDictModal(): any
    {
        return this.$refs["cityDictModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.btn
{
    margin-right: 25px;
}
.edit-btn
{
    min-width:28px;
    height:28px;
    width: 28px;
    padding: 0;
    margin-right: 6px;
    line-height: 26px;
    color: #3375f4;
}
@{deep}.ivu-table-header th
{
    height: 44px;
}
</style>