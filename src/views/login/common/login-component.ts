import { component, Component } from "uxmid-vue-web";
import { AuthService } from "src/services";
import { service } from "src/common/decorator";

/**
 * 对登录逻辑的封装混入类
 * @component
 * 
 * 提供属性：
 * 1.usernameInputValue
 * 2.passwordInputValue
 * 3.validateCodeInputValue
 */
@component
export default class LoginComponent extends Component
{
    @service("AuthService")
    protected authService: AuthService;

    /**
     * 是否需要验证码登录
     * @property
     */
    protected isNeedValidateCode: boolean = true;

    /**
     * 用户名输入绑定值
     * @property
     */
    protected usernameInputValue: string = "";

    /**
     * 密码输入绑定值
     * @property
     */
    protected passwordInputValue: string = "";

    /**
     * 验证码输入绑定值
     * @property
     */
    protected validateCodeInputValue: string = "";

    /**
     * 当前验证码图形blob
     * @property
     */
    protected currentValidateCodeImg: string = "";

    /**
     * 当前验证码id
     * @property
     */
    protected currentValidateCodeId: string = "";

    /**
     * 登录失败信息
     * @property
     */
    protected loginFailMsg: string = "";

    /**
     * 提交登录逻辑
     * @protected
     */
    protected async commitLogin(): Promise<any>
    {
        if (!this.usernameInputValue)
        {
            throw new Error("1.用户名和密码不能为空");
        }
        if (!this.passwordInputValue)
        {
            throw new Error("2.用户名和密码不能为空");
        }
        if (this.isNeedValidateCode && !this.validateCodeInputValue)
        {
            throw new Error("3.验证码不能为空");
        }

        // 调用接口进行登录
        try
        {
            await this.authService.login(this.usernameInputValue, this.passwordInputValue, this.isNeedValidateCode, this.currentValidateCodeId, this.validateCodeInputValue);
        }
        catch(err)
        {
            // 直接处理登录的异常
            this.loginFailMsg = err.message;
            this.$Message.error(err.message);
            return err.message;
        }
    }
}
