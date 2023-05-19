<template>
    <div class="uxmid-dashboard-layout">
        <!-- 侧栏菜单 -->
        <div class="sidebar-container">
            <Sidebar
                :menus="menusList"
                :activeMenu="currentMenuKey"
                @on-menu-change="onMenuChange"
            ></Sidebar>
        </div>
        <!-- 右侧窗口部分 -->
        <div class="window-container" :class="{'hide-tab': hideTab}">
            <div class="header">
                <Header
                    :tabs="currentTabs"
                    :activeTab="activeTab"
                    :hideTab="hideTab"
                    @on-tab-change="onTabChange"
                ></Header>
            </div>

            <div class="content">
                <slot></slot>
                <Spin size="large" fix v-if="contentMask" class="content-mask"></Spin>
            </div>
            <Spin size="large" fix v-if="windowMask"></Spin>
        </div>

        <u-pwd-update-modal ref="pwdUpdateModal"></u-pwd-update-modal>
    </div>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";
import { ApplicationContext } from "src/application";
import { IApplicationMenu, Events } from "src/models";
import Sidebar from "./sidebar.vue";
import Header from "./header.vue";

@component({
    components:
    {
        Sidebar,
        Header
    }
})
export default class UxmidDashboardLayout extends Component
{
    /**
     * 上下文中的左侧菜单列表
     * @property
     */
    protected get menusList(): Array<IApplicationMenu>
    {
        return ApplicationContext.current.menus;
    }

    /**
     * 路由切换加载遮罩控制
     * @property
     */
    protected windowMask: boolean = false;

    /**
     * tab页切换
     * @property
     */
    protected contentMask: boolean = false;

    /**
     * 当前菜单的tab菜单
     * @property
     */
    protected currentTabs: Array<IApplicationMenu> = [];

    /**
     * 当前菜单中文名称
     * ! 前提是所有菜单的中文名称唯一
     */
    protected currentMenuKey: string = "";

    /**
     * 当前激活的tab菜单
     * @property
     */
    protected activeTab: number = -1;

    /**
     * 是否隐藏tab栏
     * @property
     */
    protected hideTab: boolean = false;

    /**
     * 左侧菜单切换事件
     * @protected
     */
    protected onMenuChange(routenName: string, menu: IApplicationMenu)
    {
        if (Array.isArray(menu.tabChildren) && menu.tabChildren.length > 0)
        {
            this.currentTabs = menu.tabChildren;
            this.onRouteChange(menu.tabChildren[0].routeName, false);
            this.hideTab = typeof menu.tabChildren[0].hideTab === "boolean" ? menu.tabChildren[0].hideTab : false;
        }
        else
        {
            this.currentTabs = [];
            this.onRouteChange(menu.routeName, false);
            this.hideTab = typeof menu.hideTab === "boolean" ? menu.hideTab : false;
        }

        // 左侧菜单切换，默认选中第一个菜单，并且跳转这个路由
        this.activeTab = 0;
        
    }

    /**
     * tab切换事件
     * @protected
     */
    protected onTabChange(tabIndex: number, tab: IApplicationMenu)
    {
        this.activeTab = tabIndex;
        this.hideTab = typeof tab.hideTab === "boolean" ? tab.hideTab : false;
        this.onRouteChange(tab.routeName, true);
    }

    /**
     * 路由切换
     * @protected
     */
    protected onRouteChange(routeName: string, isTabRoute: boolean)
    {
        if (!routeName)
        {
            console.error("指定的菜单没有配置关联路由，请检查配置！");
            return;
        }

        const currentRouteName = ApplicationContext.current.router.currentRoute.name;
        if (currentRouteName === routeName)
        {
            console.warn("不可以重复跳转路由");
            return;
        }
        ApplicationContext.current.router.push({name: routeName});

        if (isTabRoute)
        {
            this.contentMask = true;
        }
        else
        {
            this.windowMask = true;
        }
    }

    /**
     * 判断当前路由，高亮指定的菜单
     * @protected
     */
    protected highlightMenu()
    {
        const currentRouteName = ApplicationContext.current.router.currentRoute.name;
        let currentMenuLabel = "";
        ApplicationContext.current.menus.forEach((item, i) =>
        {
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                item.children.forEach((jtem, j) =>
                {
                    jtem.tabChildren.forEach((ktem, k) =>
                    {
                        if (currentRouteName === ktem.routeName)
                        {
                            currentMenuLabel = jtem.label;
                            this.currentTabs = jtem.tabChildren;
                            this.activeTab = k;

                            this.hideTab = typeof ktem.hideTab === "boolean" ? ktem.hideTab : false;
                        }
                    });
                });
            }
            else
            {
                if (currentRouteName === item.routeName)
                {
                    currentMenuLabel = item.label;
                    this.hideTab = typeof item.hideTab === "boolean" ? item.hideTab : false;
                }
            }
        });
        this.currentMenuKey = currentMenuLabel;
    }

    protected created()
    {
        ApplicationContext.current.eventProvider.addListener(Events.ON_MENU_ROUTE_CHANGE, this.onMenuRouteChange);
        ApplicationContext.current.eventProvider.addListener(Events.ON_UPDATE_PASSWORD, this.onUpdatePassword);
        this.highlightMenu();
    }

    protected destroy()
    {
        ApplicationContext.current.eventProvider.removeListener(Events.ON_MENU_ROUTE_CHANGE, this.onMenuRouteChange);
        ApplicationContext.current.eventProvider.removeListener(Events.ON_UPDATE_PASSWORD, this.onUpdatePassword);
    }

    private onMenuRouteChange(info: {data: any; source: any; type: string})
    {
        setTimeout(() =>
        {
            this.windowMask = false;
            this.contentMask = false;
        }, 600);
        this.highlightMenu();
    }

    private onUpdatePassword(info: {data: any; source: any; type: string})
    {
        // TODO 弹出修改密码弹层
        this._pwdUpdateModal.open();
    }

    private get _pwdUpdateModal()
    {
        return this.$refs["pwdUpdateModal"] as any;
    }
}
</script>

<style lang="less" scoped>
.uxmid-dashboard-layout
{
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    background-color: #f3f5f9;

    .sidebar-container
    {
        flex: 0 0 auto;
        width: 192px;
        height: 100%;
    }
    .window-container
    {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;

        .header
        {
            flex: 0 0 auto;
            height: 110px;
            width: 100%;
            padding-left: 30px;
            padding-right: 30px;
        }

        .content
        {
            position: relative;
            padding-left: 30px;
            padding-right: 30px;
            height: calc(100% - 110px);
        }
    }
    .window-container.hide-tab
    {
        .header
        {
            position: absolute;
            height: 0;
        }

        .content
        {
            padding-left: 0;
            padding-right: 0;
            height: 100%;
        }
    }
    
}

@{deep}.ivu-spin-fix
{
    z-index: 11;
}
@{deep}.content-mask
{
    left: 30px;
    width: calc(100% - 60px) !important;
}
</style>