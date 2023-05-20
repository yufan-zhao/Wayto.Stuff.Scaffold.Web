<template>
    <div class="system-header-view">
        <div class="system-list">
            <span 
                class="system-item"
                :class="{active: currentActiveIndex === i, 'customer-item': isCustomerSpecialType}"
                v-for="(item, i) in specialTypes"
                :key="i"
                @click="onSystemItemClick(item, i)"
            >
                <span class="item-name">{{item.name}}（{{item.code}}）</span>
                <span class="del-btn" v-if="isCustomerSpecialType" @click.stop="onDeleteItem(item, i)" v-permission="deleteAuthCode"><Icon type="ios-close" /></span>
            </span>

            <span v-if="isCustomerSpecialType" class="system-item-add" @click="onSpecialTypeAdd" v-permission="addAuthCode">
                <Icon type="ios-add" />
                添加
            </span>
        </div>

        <SpecialTypeModal
            ref="specialTypeModal"
            :specialTypeList="standardSpecialTypeList"
            :insert="specialTypeService.saveCustomerSpecialType.bind(specialTypeService)"
            @on-refresh="onCustomerSpecialTypeRefresh"
        >
        </SpecialTypeModal>
        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { SpecialType } from "src/models";
import SpecialTypeModal from "./special-type-modal.vue";
import { service } from "src/common/decorator";
import { SpecialTypeService } from "src/services";

@component({
    components:
    {
        SpecialTypeModal
    }
})
export default class SystemHeader extends View
{
    @service("SpecialTypeService")
    private specialTypeService: SpecialTypeService;

    /**
     * 体系类型列表
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialTypes: Array<SpecialType>;

    /**
     * 客户id
     * @config
     */
    @config({required: false, type: Number, default: -1})
    protected customerId: number;

    /**
     * 新增按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected addAuthCode: string;

    /**
     * 删除按钮权限code
     * @protected
     * @config
     */
    @config({required: false, type: String})
    protected deleteAuthCode: string;

    /**
     * 标准体系中的体系类型列表
     * @property
     */
    protected standardSpecialTypeList: Array<SpecialType> = [];

    /**
     * 是否是客户体系类型
     * @property
     */
    protected get isCustomerSpecialType(): boolean
    {
        return this.customerId !== -1;
    }

    /**
     * 当前选中体系类型的数组索引
     * @property
     */
    protected currentActiveIndex: number = -1;

    /**
     * 当前选中体系类型的id
     * @property
     */
    protected currentActiveId: number = -1;

    /**
     * 体系类型项点击事件
     * @protected
     */
    protected onSystemItemClick(item: SpecialType, i: number)
    {
        this.currentActiveIndex = i;
        this.currentActiveId = item.id;
        this.$emit("on-special-type-change", item);
    }

    /**
     * 新增客户体系类型事件
     * @protected
     */
    protected onSpecialTypeAdd()
    {
        this._specialTypeModal.open("insert", this.customerId);
    }

    /**
     * 体系删除事件
     * @protected
     */
    protected onDeleteItem(item: SpecialType, i: number)
    {
        this._warningModal.open({
            title: "警告",
            content: "是否删除该体系类型，此操作不可逆？",
            onOk: async () =>
            {
                try
                {
                    await this.specialTypeService.virtualRemoveById(item.id);
                    this.$message.success("删除成功");
                    this.onCustomerSpecialTypeRefresh();
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                }
            }
        });
    }

    protected onCustomerSpecialTypeRefresh()
    {
        this.$emit("on-special-type-refresh");
    }

    /**
     * 体系类型数据源监听
     * @watcher
     */
    @watch("specialTypes", {immediate: true, deep: true})
    protected specialTypesWatcher(val: Array<SpecialType>)
    {
        if (this.currentActiveIndex === -1 && val.length > 0)
        {
            this.onSystemItemClick(val[0], 0);
        }
        else if (this.currentActiveIndex > -1 && val.length > 0)
        {
            if (val.filter(item => item.id === this.currentActiveId).length === 0)
            {
                this.onSystemItemClick(val[0], 0);
            }
        }
        else
        {
            this.currentActiveIndex = -1;
            this.currentActiveId = -1;
            this.$emit("on-special-type-change", undefined);
        }
    }

    /**
     * 客户id监听
     */
    @watch("customerId", {immediate: true})
    protected async customerIdWatcher(val: number)
    {
        if (val > 0)
        {
            this.standardSpecialTypeList = await this.specialTypeService.getSpecialTypeList();
        }
    }
    
    private get _specialTypeModal(): SpecialTypeModal
    {
        return this.$refs["specialTypeModal"] as SpecialTypeModal;
    }

    /**
     * 警告弹层
     * @private
     * @ref
     */
    private get _warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.system-header-view
{
    display: flex;
    height: 100%;
    border-bottom: 1px solid #E9EBEC;

    .system-list
    {
        display: flex;

        .system-item
        {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 96px;
            height: 34px;
            border: 1px solid #DCE0E7;
            border-radius: 2px;
            margin-right: 16px;
            cursor: pointer;
            transition: color,border-color ease-in-out 0.3s;
        }
        .system-item:hover
        {
            border-color: #3375F4;
            color: #3375F4;
        }
        .system-item.active
        {
            border-color: #3375F4;
            color: #3375F4;
        }
        .system-item.customer-item
        {
            width: 120px;

            .item-name
            {
                width: 96px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }
            .del-btn
            {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background-color: rgba(153, 153, 153, 0.15);
                margin-right: 4px;

                i
                {
                    font-size: 20px;
                    font-weight: bold;
                    color: #999999;
                    opacity: 1;
                }
            }
            .del-btn:hover
            {
                background-color: rgba(153, 153, 153, 0.3);

                i
                {
                    font-size: 20px;
                    color: darken(#999999, 10%);
                }
            }
        }

        .system-item-add
        {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 96px;
            height: 34px;
            color: #A6ABB5;
            border: 1px solid #DCE0E7;
            border-radius: 2px;
            cursor: pointer;
            transition: color,border-color ease-in-out 0.3s;

            i
            {
                position: relative;
                top: 1px;
                font-size: 18px;
                font-weight: bold;
            }
        }
        .system-item-add:hover
        {
            color: darken(#A6ABB5, 20%);
            border-color: darken(#A6ABB5, 20%);
        }
    }
}
</style>