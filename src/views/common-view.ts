import { View } from "uxmid-vue-web";
import { Application } from "uxmid-core";
import { ApplicationContext } from "../application";
import { PermissionCode } from "src/enums";

export default class CommonView extends View
{
    /**
     * 获取当前应用的上下文实例。
     * @protected
     * @property
     * @returns ApplicationContext
     */
    protected get applicationContext(): ApplicationContext
    {
        return Application.context as ApplicationContext;
    }

    /**
     * 权限码
     * @protected
     */
    protected get permissionCode(): PermissionCode
    {
        return PermissionCode;
    }

    /**
     * 进入开始诊治页面方法
     * @param consultId 
     */
    protected openScorePage(consultId: number): void
    {
        window.open(`/score?consultId=${consultId}`, "_blank");
    }

    /**
     * 跳转未诊治页面查看详情
     * @param id 诊治计划id
     */
    protected goConsultIncomplete(id: number)
    {
        this.applicationContext.router.push({
            name: "project-plan-incomplete",
            query:
            {
                id: String(id)
            }
        });
    }

    /**
     * 跳转诊治中查看详情
     * @param id 
     */
    protected goConsultReport(id: number)
    {
        this.applicationContext.router.push({
            name: "project-report",
            query:
            {
                id: String(id)
            }
        });
    }

    /**
     * 跳转已诊治页面查看详情
     * @param id 诊治计划id 
     */
    protected goConsultComplete(id: number)
    {
        this.applicationContext.router.push({
            name: "project-plan-complete",
            query:
            {
                id: String(id)
            }
        });
    }

    protected getTargetQs(propertyName: string)
    {
        let obj = this.getUrlParams();
        if (obj)
        {
            return obj.get(propertyName);
        }
        else
        {
            return undefined;
        }
    }

    private getUrlParams(): URLSearchParams
    {
        let urlParamStr = window.location.href.split("?")[1];
        if (urlParamStr)
        {
            return new URLSearchParams(urlParamStr);
        }
        else
        {
            return null;
        }
    }
}
