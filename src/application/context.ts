import { ApplicationContextBase, IWorkbench, IEventProvider, EventProviderFactory, Exception } from "uxmid-core";
import Router from "vue-router";
import { IApplicationMenu, IApplicationSettings } from "src/models";
import Workbench from "./workbench";

export default class ApplicationContext extends ApplicationContextBase
{
    private _settings: IApplicationSettings;
    private _menus: Array<IApplicationMenu>;
    private _permissionCodes: Array<string>;
    private _router: Router;

    /**
     * 单例化上下文示例
     * @static
     * @readonly
     * @returns {ApplicationContext} 应用程序上下文实现类
     */
    public static readonly current: ApplicationContext = new ApplicationContext();

    /**
     * 获取当前应用的单例事件服务工厂。
     * @property
     * @returns {IEventProvider} 事件工厂单例实例
     */
    public get eventProvider(): IEventProvider
    {
        return EventProviderFactory.instance.getProvider("default");
    }

    /**
     * 获取当前登录用户的权限编码列表
     */
    public get permissionCodes(): Array<string>
    {
        return this._permissionCodes;
    }

    /**
     * 设置当前登录用户的权限编码列表
     */
    public set permissionCodes(value: Array<string>)
    {
        this._permissionCodes = value;
    }

    /**
     * 获取当前应用的菜单。
     * @public
     */
    public get menus(): Array<IApplicationMenu>
    {
        return this._menus;
    }

    /**
     * 设置当前应用的菜单。
     * @public
     */
    public set menus(value: Array<IApplicationMenu>)
    {
        this._menus = value;
    }

    /**
     * 获取当前应用的路由对象。
     * @public
     * @returns {Router} Vue路由对象
     */
    public get router(): Router
    {
        return this._router;
    }

    /**
     * 设置当前应用的路由对象。
     * @public
     */
    public set router(value: Router)
    {
        this._router = value;
    }

    /**
     * 获取当前应用的全局配置。
     * @public
     * @returns {IApplicationSettings} 当前应用的全局配置
     */
    public get settings(): IApplicationSettings
    {
        if (!this._settings)
        {
            this._settings = this.loadSettings();
        }
        return this._settings;
    }

    /**
     * 创建一个工作台对象。
     * @override
     * @returns IWorkbench
     */
    protected createWorkbench(args: Array<string>): IWorkbench
    {
        return new Workbench(this);
    }

    /**
     * 加载应用配置。
     * @returns {IApplicationSettings} 应用全局配置
     */
    private loadSettings(): IApplicationSettings
    {
        const settings = (<any>window)._applicationSettings;
        if (!settings)
        {
            throw new Exception("无法找到全局_applicationSettings");
        }
        return settings;
    }
}
