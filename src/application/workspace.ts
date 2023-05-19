import { IWorkbench, Broadcast, BroadcastManager } from "uxmid-core";
import components, { View } from "uxmid-vue-web";
import Vue, { CreateElement } from "vue";
import Router from "vue-router";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";

import { routes, menus } from "src/routes";
import ApplicationContext from "./context";
import { RouteUtils } from "src/common/utils";
import { BroadcastChannels } from "src/broadcasts";
import { Events, IApplicationMenu } from "src/models";
import globalComponents from "src/components";
import filters from "src/common/filters";

// 指令
import { previewer, permission } from "src/common/directives";

export default class Workspace extends View
{
    private _workbench: IWorkbench;

    /**
     * 获取工作空间所属的工作台实例。
     * @property
     * @returns {IWorkbench} 工作台实例
     */
    public get workbench(): IWorkbench
    {
        return this._workbench;
    }

    /**
     * 初始化工作空间的新实例。
     * @constructor
     * @param  {IWorkbench} workbench 工作台实例。
     * @param  {Router} context 上下文实例。
     */
    public constructor(workbench: IWorkbench, context: ApplicationContext)
    {
        Vue.config.productionTip = false;
        Vue.config.errorHandler = (err, vm, info) =>
        {
            console.error(err, vm, info);
        };
        Vue.config.warnHandler = (msg, vm, trace) =>
        {
            // `trace` 是组件的继承关系追踪
            console.error(msg, vm, trace);
        };

        // 初始化路由
        Workspace.initializeRouter(context);

        // 初始化vue插件
        Workspace.initializePlugin(context);

        // 初始化系统及自定义组件
        Workspace.initializeComponent(context);

        // 初始化Vue过滤器
        Workspace.initializeFilters(context);

        // 初始化所有全局 Vue 自定义指令
        Workspace.initializeDirectives(context);

        let options =
        {
            el: "#workspace",
            router: context.router,
            // store: ApplicationContext.current.store,
            render(h: CreateElement)
            {
                return h("div",{ attrs: { id: "workspace" } }, [ h("router-view") ]);
            }
        };

        super(options);
        this._workbench = workbench;
    }

    /**
     * 初始化vue路由。
     * @param context {ApplicationContext} context 应用程序上下文实例。
     * @returns {void} void
     */
    public static initializeRouter(context: ApplicationContext): void
    {
        // 注册路由组件
        Vue.use(Router);

        // 根据权限筛选菜单
        let filteredMenus = RouteUtils.loadMenus(menus, context.permissionCodes);
        // console.log("筛选后的菜单", filteredMenus);

        // 初始化路由程序
        let router = new Router({mode: "history", routes: routes});
        router.beforeEach((to, from, next) =>
        {
            if (to.name === "login" || to.name === "error-no-auth")
            {
                next();
                return;
            }

            RouteUtils.checkTokenValid().then(res =>
            {
                if (res)
                {
                    // 根据权限拦截路由菜单
                    // console.log("落地路由code", to.meta.code);
                    if (to.meta.code)
                    {
                        if (context.permissionCodes.indexOf(to.meta.code) >= 0)
                        {
                            next();
                        }
                        else
                        {
                            next({name: "error-no-auth"});
                        }
                    }
                    else
                    {
                        next();
                    }
                }
                else
                {
                    const logoutMsg = new Broadcast(BroadcastChannels.LOGOUT, null);
                    BroadcastManager.instance.send(logoutMsg);
                }
                return;
            });
        });
        router.afterEach((to, from) =>
        {
            context.eventProvider.dispatchEvent(Events.ON_MENU_ROUTE_CHANGE, [to, from]);
        });

        context.menus = filteredMenus;
        context.router = router;
    }

    /**
     * 初始化全局插件。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns {void} void
     */
    public static initializePlugin(context: ApplicationContext): void
    {
        // // 初始化高德地图配置
        // AMap.init
        // ({
        //     key: context.settings.amapSettings.key,
        //     version: "1.4.14",
        //     uiVersion: "1.0",
        //     plugins:
        //     [
        //         "Autocomplete",
        //         "PlaceSearch",
        //         "Scale",
        //         "OverView",
        //         "ToolBar",
        //         "MapType",
        //         "CircleEditor",
        //         "Geocoder",
        //         "PositionPicker",
        //         "AMap.MouseTool",
        //         "AMap.PolyEditor",
        //         "AMap.MarkerClusterer",
        //         "Map3D",
        //         "AMap.Object3DLayer",
        //         "AMap.DistrictSearch"
        //     ]
        // });

        // // 注册高德地图组件
        // Vue.use(AMap);

        // // 注册vue日历
        // Vue.use(VCalendar, {
        //     componentPrefix: "vc"  // Use <vc-calendar /> instead of <v-calendar />
        // });
    }

    /**
     * 初始化全局组件。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns {void} void
     */
    public static initializeComponent(context: ApplicationContext): void
    {
        Vue.use(components);
        Vue.use(globalComponents);

        dayjs.locale("zh-cn");
        dayjs.extend(relativeTime);

         // 注冊富文本编辑器
        // Vue.use(VueCkeditor.plugin, {
        //     editors:
        //     {
        //         classic: ClassicEditor
        //     },
        //     name: "ckeditor"
        // });
    }

    /**
     * 初始化所有全局 Vue 过滤器。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns {void} void
     */
    public static initializeFilters(context: ApplicationContext): void
    {
        (Object.keys(filters) as Array<keyof typeof filters>).forEach(key =>
        {
            Vue.filter(key, filters[key]);
        });
    }

    /**
     * 初始化所有全局 Vue 自定义指令。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private static initializeDirectives(context: ApplicationContext): void
    {
        // 图片放大预览
        Vue.directive("previewer", previewer);

        // 权限控制
        Vue.directive("permission", permission);
    }
}
