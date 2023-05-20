<template>
    <div class="system-customer-switcher">
        <div class="left">
            <span class="title">{{customerName}}</span>
            <!-- <span class="sub-title">(深圳市万科股份有限公司)</span> -->
        </div>

        <div class="right">
            <span class="btn" @click.stop="onModalDisplayChange">切换客户</span>
        </div>

        <div class="customer-list-modal" :class="{active: isShowModal}">
            <ul class="customer-list">
                <li class="customer-list-item"
                    v-for="(item, i) in customerList"
                    :key="i"
                    :class="{active: customerSelectIndex === i}"
                    @click="onCustomerClick(item, i)"
                >{{item.deptName}}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { CustomerService } from "src/services";

@component
export default class SpecialCustomerSwitcher extends View
{
    @service("CustomerService")
    private customerService: CustomerService;

    /**
     * 客户名称
     * @property
     */
    protected get customerName(): string
    {
        return this.customerSelectIndex >= 0 ? this.customerList[this.customerSelectIndex].deptName : "-";
    }

    /**
     * 客户选择索引
     * @property
     */
    protected customerSelectIndex: number = -1;

    /**
     * 是否展示弹层
     * @property
     */
    protected isShowModal: boolean = false;

    /**
     * 客户列表
     * @property
     */
    protected customerList: Array<any> = [];

    /**
     * 客户列表点击事件
     * @protected
     */
    protected onCustomerClick(item: any, i: number)
    {
        this.customerSelectIndex = i;
        this.$emit("on-customer-change", item.id);
    }

    /**
     * 客户选择框状态切换
     * @protected
     */
    protected onModalDisplayChange()
    {
        this.isShowModal = !this.isShowModal;
    }

    /**
     * 全局鼠标点击事件
     * @protected
     */
    protected globalLayoutClickEventHandler(ev: any)
    {
        if (!Array.isArray(ev.path))
        {
            return;
        }
        let isModalClicked = false;
        for (let i = 0; i < ev.path.length; i++)
        {
            let item = ev.path[i];
            if (item.className)
            {
                let flag = item.className.indexOf("customer-list-modal");
                if (flag >= 0)
                {
                    isModalClicked = true;
                    break;
                }
            }
        }
        if (!isModalClicked && this.isShowModal)
        {
            this.onModalDisplayChange();
        }
    }

    protected created()
    {
        this.initData();
    }

    protected mounted()
    {
        window.addEventListener("click", this.globalLayoutClickEventHandler);
    }

    protected destroy()
    {
        window.removeEventListener("click", this.globalLayoutClickEventHandler);
    }

    private async initData()
    {
        const res = await this.customerService.list();
        this.customerList = res.content;
        if (this.customerList.length > 0)
        {
            this.onCustomerClick(this.customerList[0], 0);
        }
    }
}
</script>

<style lang="less" scoped>
.system-customer-switcher
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    border: 1px solid #C2F7CC;
    background-color: #F5FFF7;
    padding-left: 20px;
    padding-right: 20px;

    .left
    {
        .title
        {
            font-size: 16px;
            font-weight: bold;
            color: #44CB5C;
        }
        .sub-title
        {
            color: #44CB5C;
        }
    }

    .right
    {
        color: #838D9C;
        cursor: pointer;

        .btn
        {
            transition: color 0.3s ease-in-out;
        }
        .btn:hover
        {
            color: lighten(#838D9C, 10%);
        }
    }

    .customer-list-modal
    {
        display: none;
        opacity: 0;
        position: absolute;
        top: 63px;
        right: 60px;
        width: 210px;
        z-index: 10;
        height: calc(100% - 143px);
        background-color: #fff;
        box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.2);
        border-radius: 4px;
    }
    .customer-list-modal.active
    {
        display: block;
        opacity: 1;
        padding: 14px 20px;

        .customer-list
        {
            .customer-list-item
            {
                color: #182334;
                height: 34px;
                cursor: pointer;
            }
            .customer-list-item:hover
            {
                color: darken(#182334, 20%);
                font-weight: bold;
            }
            .customer-list-item.active
            {
                color: #4B7EFE;
                font-weight: bold;
            }
            
        }
    }
}

</style>