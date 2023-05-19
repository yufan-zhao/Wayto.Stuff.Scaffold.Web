import { ApplicationContext } from "../../../application/index";

/**
 * 未授权处理
 * @param el dom对象
 * @return void
 */
function unauthorized(el: HTMLElement): void {
    el && el.classList.add("unauthorized");
}

/**
 * 授权处理
 * @param el dom对象
 * @return void
 */
function authorized(el: HTMLElement): void {
    el && el.classList.remove("unauthorized");
}

/**
 * 权限控制指令。
 * @param el 绑定的dom对象
 * @param binding 绑定 的值
 * @returns void
 */
const permission = function (el, binding): void
{
    // 当前标签权限码
    const targetPermissionCode: string | Array<string> = binding.value;
    // console.log("当前元素的权限码", targetPermissionCode);
    const permissionCodes: Array<string> = ApplicationContext.current.permissionCodes;

    let flag = true;

    if (Array.isArray(targetPermissionCode) && targetPermissionCode.length > 0)
    {
        let count = 0;
        targetPermissionCode.forEach(item =>
        {
            if (permissionCodes.indexOf(item) > -1)
            {
                count++;
            }
            if (typeof item === "undefined")
            {
                count++;
            }
        });
        flag = count > 0;
    }
    else if (typeof targetPermissionCode === "string" && targetPermissionCode)
    {
        flag = permissionCodes.indexOf(targetPermissionCode) > -1;
    }
    
    if (!flag)
    {
        el.style.display = "none";
    }
};

export default permission;
