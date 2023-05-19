import dayjs from "dayjs";
import { ApplicationContext } from "src/application";
import { IApplicationMenu, IApplicationCredential } from "src/models";
import { resolveService } from "src/common/http";
import { AuthService, PermissionService } from "src/services";

export default
{
    checkTokenValid,
    loadMenus
};

/**
 * 校验当前应用的凭证是否有效
 */
export async function checkTokenValid()
{
    const credential = ApplicationContext.current.credential as IApplicationCredential;

    let result = Boolean(credential);
    try
    {
        if (!credential)
        {
            console.log("应用程序上下文中不存在凭证，请登录");
            return false;
        }
        let nowTime = dayjs().valueOf();
        if (nowTime - credential.tokenTime >= 300000)
        {
            // 超过5分钟，校验一下token是否有效
            console.log("上一次保存的token已经超过5分钟了", credential);
            const authService = resolveService<AuthService>(AuthService);
            result = await authService.checkToken(credential.credentialId);

            if (result)
            {
                const permissionService = resolveService<PermissionService>(PermissionService);
                await permissionService.getMenu();
            }
        }
        else
        {
            // 没超过5分钟，理论上放过
        }
    }
    catch(err)
    {
        // !! token校验的异常开发中一定要处理，这里不能产生任何异常
        console.log(err);
    }
    
    return result;
}

export function loadMenus(menus: Array<IApplicationMenu>, permissionCodes: Array<string>, result: Array<IApplicationMenu> = []): Array<IApplicationMenu>
{
    for (let i = 0; i < menus.length; i++)
    {
        let item = JSON.parse(JSON.stringify(menus[i]));
        
        if (item.code)
        {
            if (Array.isArray(item.code))
            {
                let tempFlag = false;
                item.code.forEach((codeItem: string) =>
                {
                    if (permissionCodes.indexOf(codeItem) >= 0)
                    {
                        tempFlag = true;
                    }
                });

                if (tempFlag)
                {
                    result.push(item);
                }
            }
            else
            {
                if (permissionCodes.indexOf(item.code) >= 0)
                {
                    result.push(item);
                }
            }
        }
        else
        {
            result.push(item);
        }

        if (Array.isArray(item.children))
        {
            let tempResult = loadMenus(item.children, permissionCodes);
            item.children = tempResult;
        }

        if (Array.isArray(item.tabChildren))
        {
            let tempResult = loadMenus(item.tabChildren, permissionCodes);
            item.tabChildren = tempResult;
        }
    }
    return result;
}
