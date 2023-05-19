import { RouteConfig } from "vue-router";

/**
 * 表示系统的一个一级或菜单。
 * @interface
 */
export default interface IApplicationMenu
{
    /**
     * 菜单名称
     * @member
     */
    label: string;

    /**
     * 菜单图标
     * @member
     */
    icon?: string;

    /**
     * 菜单图标颜色
     * @member
     */
    iconColor?: string;

    /**
     * 路由名称
     * @member
     */
    routeName?: string;

    /**
     * 权限编码
     * @member
     */
    code?: string | Array<string>;

    /**
     * 路由信息
     * @member
     * @deprecated
     */
    route?: RouteConfig;

    /**
     * 是否隐藏tab菜单
     * @member
     */
    hideTab?: boolean;

    /**
     * 子菜单
     * @member
     */
    children?: Array<IApplicationMenu>;

    /**
     * tab子菜单
     * @member
     */
    tabChildren?: Array<IApplicationMenu>;
}
