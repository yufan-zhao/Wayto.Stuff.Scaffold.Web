<template>
    <div class="ux-login-view">
        <div class="left">
            <img class="ball" src="./ball.png" />

            <div class="content">
                <div class="header">
                    <span class="logo">
                        <img src="src/assets/logo.png" />
                    </span>
                    <span class="label">深圳市前海公共安全科学研究院</span>
                </div>

                <div class="slogan">
                    <div class="text">以技术驱动</div>
                    <div class="text">工程安全生产数字化</div>
                </div>

                <div class="info">
                    建设全新的安全生产综合治理服务平台，打通一线安全生产评估业务流程、规范化标准化安全生产评估作业，实现第三方安全巡查管理数据采集的数字化、移动化，构建“防、诊、治、应“四位一体的安全生产综合治理服务平台。
                </div>

                <div class="statement">
                    <!-- <div class="text">@2017 All Rights reserved 深圳市伟图科技开发有限公司版权所有</div>
                    <div class="text">法律声明粤ICP备15009750号</div> -->
                    <div class="text">深圳市前海公共安全科学研究院版权所有</div>
                    <div class="text">深圳市伟图科技开发有限公司技术支持</div>
                </div>
            </div>
        </div>
        <div class="right">

        </div>

        <div class="login-content">
            <div class="title">风险隐患诊治数字系统</div>

            <div class="login-form">
                <div class="form-item" :class="{active: activeInputIndex === 0, error: usernameInputError}" style="margin-bottom: 25px;">
                    <span class="stick"></span>
                    <span class="icon">
                        <img src="./icon/icon_zh.png" />
                    </span>
                    <input class="ux-input" placeholder="请输入账号" v-model="usernameInputValue" @focus="onInputFocus(0)" @blur="onInputBlur(0)" />
                    <span class="err-msg">用户名不能为空</span>
                </div>

                <div class="form-item" :class="{active: activeInputIndex === 1, error: passwordInputError}" style="margin-bottom: 25px;">
                    <span class="stick"></span>
                    <span class="icon">
                        <img src="./icon/icon_mim.png" />
                    </span>
                    <input class="ux-input" type="password" placeholder="请输入密码" v-model="passwordInputValue" @focus="onInputFocus(1)" @blur="onInputBlur(1)" />
                    <span class="err-msg">密码不能为空</span>
                </div>

                <div class="form-item validate-input" :class="{active: activeInputIndex === 2, error: validateCodeInputError}" style="margin-bottom: 25px;">
                    <span class="stick"></span>
                    <span class="icon">
                        <img src="./icon/icon_gsdh.png" />
                    </span>
                    <input class="ux-input" placeholder="请输入验证码" v-model="validateCodeInputValue" @focus="onInputFocus(2)" @blur="onInputBlur(2)" @keypress.enter="onLoginClick" />
                    <span class="validate-image">
                        <img :src="currentValidateCodeImg" />
                    </span>
                    <span class="refresh" @click="onRefreshValidateCode">
                        <img src="./icon/icon_refresh.png" />
                    </span>
                    <span class="err-msg">验证码不能为空</span>
                </div>

                <i-button type="primary" class="submit-botton" :loading="loginButtonLoading" @click="onLoginClick">登 录</i-button>
                <div class="login-fail-msg" v-if="loginFailMsg">{{loginFailMsg}}</div>

                <div class="other-features">
                    <div class="feature-item" @click="onForgetPwdClick">忘记密码？</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, mixins } from "uxmid-vue-web";
import LoginComponent from "./common/login-component";

@component
export default class UxLoginView extends mixins(LoginComponent)
{
    /**
     * 当前激活的输入框
     * @property
     */
    protected activeInputIndex: number = -1;

    /**
     * 登录按钮状态控制
     * @property
     */
    protected loginButtonLoading: boolean = false;

    /**
     * 用户名输入框错误控制字段
     * @property
     */
    protected usernameInputError: boolean  = false;

    /**
     * 密码输入框错误控制字段
     * @property
     */
    protected passwordInputError: boolean = false;

    /**
     * 验证码输入框错误控制字段
     * @property
     */
    protected validateCodeInputError: boolean = false;

    /**
     * input聚焦事件
     * @protected
     */
    protected onInputFocus(inputIndex: number)
    {
        this.activeInputIndex = inputIndex;
    }

    /**
     * input失去焦点事件
     * @protected
     */
    protected onInputBlur(inputIndex: number)
    {
        if (this.activeInputIndex === inputIndex)
        {
            this.activeInputIndex = -1;
        }
        this.validateFields(inputIndex);
    }

    /**
     * 输入框填写校验
     * @protected
     */
    protected validateFields(inputIndex: number)
    {
        switch(inputIndex)
        {
            case 0:
            {
                this.usernameInputError = Boolean(!this.usernameInputValue);
                break;
            }
            case 1:
            {
                this.passwordInputError = Boolean(!this.passwordInputValue);
                break;
            }
            case 2:
            {
                this.validateCodeInputError = Boolean(this.isNeedValidateCode && !this.validateCodeInputValue);
                break;
            }
            default:
            {
                //
                break;
            }
        }
    }

    /**
     * 忘记密码点击事件
     * @protected
     */
    protected onForgetPwdClick()
    {
        this.$root.$Modal.info({
            title: "请联系管理员重置密码"
        });
    }

    /**
     * 登录按钮点击事件
     * @protected
     */
    protected async onLoginClick()
    {
        try
        {
            this.loginButtonLoading = true;
            const errMsg = await this.commitLogin();
            if (errMsg)
            {
                this.onRefreshValidateCode();
            }
        }
        catch(err)
        {
            this.validateFields(0);
            this.validateFields(1);
            this.validateFields(2);
        }
        finally
        {
            this.loginButtonLoading = false;
        }
    }

    /**
     * 刷新图形验证码事件
     * @protected
     */
    protected onRefreshValidateCode()
    {
        this.getValidateCodeImg();
    }

    /**
     * vue钩子
     * @created
     */
    protected async created()
    {
        this.getValidateCodeImg();
    }

    /**
     * 获取图形验证码接口
     * @private
     */
    private async getValidateCodeImg(): Promise<void>
    {
        const res = await this.authService.getVerifyImg(98, 37);
        this.currentValidateCodeImg = res.blobUrl;
        this.currentValidateCodeId = res.verifyCodeId;
    }
}
</script>

<style lang="less" scoped>
.ux-login-view
{
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;

    .left
    {
        position: relative;
        top: 10%;
        height: 100%;
        width: 61.8%;
        background-color: #f8fafd;
        background-image: url("./base-texture.png");
        background-position: bottom right;
        background-repeat: no-repeat;
        background-size: contain;

        .ball
        {
            position: absolute;
            left: 0;
            top: -5px;
        }

        .content
        {
            padding-left: 320px;

            .header
            {
                display: flex;
                align-items: center;
                margin-bottom: 40px;

                .logo
                {
                    height: 60px;
                    width: 60px;
                    margin-right: 10px;
                    background-color: #ddd;
                    border-radius: 50%;

                    img
                    {
                        width: 100%;
                        height: 100%;
                    }
                }
                .label
                {
                    color: #0759A6;
                    font-size: 20px;
                    font-weight: bold;
                }
            }

            .slogan
            {
                margin-bottom: 35px;

                .text
                {
                    font-style: italic;
                    font-size: 48px;
                    font-weight: bold;
                    color: #3375F4;
                }
            }

            .info
            {
                width: 462px;
                line-height: 30px;
                letter-spacing: 2px;
                font-weight: 400;
                margin-bottom: 254px;
            }

            .statement
            {
                .text
                {
                    color: #838D9C;
                    font-size: 12px;
                    line-height: 20px;
                    letter-spacing: 1px;
                }
            }
        }
    }
    .right
    {
        height: 100%;
        width: 38.2%;
        background-color: #dfe8f7;
        background-image: url("./brand.png");
        background-position: center right;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .login-content
    {
        position: absolute;
        top: 10%;
        right: 449px;
        width: 540px;
        height: 700px;
        padding-left: 70px;
        padding-right: 70px;
        background-color: #fff;
        box-shadow: 0px 0px 20px 0px rgba(2,8,33,0.0600);

        .title
        {
            display: flex;
            justify-content: center;
            margin-top: 79px;
            margin-bottom: 68px;
            font-size: 32px;
            font-weight: bold;
        }

        .login-form
        {
            .form-item
            {
                position: relative;
                width: 100%;
                height: 60px;
                display: flex;
                align-items: center;
                
                .stick
                {
                    position: absolute;
                    left: 0;
                    height: 100%;
                    width: 4px;
                    background-color: #3375F4;
                    opacity: 0;
                    transition: opacity ease-in-out 0.3s;
                }
                .icon
                {
                    position: absolute;
                    left: 20px;
                    width: 24px;
                    height: 24px;
                    // background-color: #ddd;
                }
                .ux-input
                {
                    background-color: #F2F2F6;
                    width: 100%;
                    height: 100%;
                    padding-left: 60px;
                    padding-right: 30px;
                    border-radius: 2px;
                    border: 1px solid #F2F2F6;
                    outline: none;
                    font-size: 16px;
                }
                .ux-input:active
                {
                    border-radius: 2px;
                    border: 1px solid #F2F2F6;
                    outline: none;
                }
                .err-msg
                {
                    position: absolute;
                    bottom: -20px;
                    font-size: 14px;
                    color: #FF4D3F;
                    opacity: 0;
                    transition: opacity ease-in-out 0.2s;
                }
            }
            .form-item.error
            {
                .stick
                {
                    background-color: #FF4D3F;
                }
                input
                {
                    border-color: #FF4D3F;
                }
                .err-msg
                {
                    opacity: 1;
                }
            }
            .form-item.validate-input
            {
                .ux-input
                {
                    padding-right: 155px;
                }
                .validate-image
                {
                    position: absolute;
                    right: 46px;
                    width: 98px;
                    height: 37px;
                    background-color: #ddd;
                }
                .refresh
                {
                    position: absolute;
                    right: 14px;
                    width: 24px;
                    height: 24px;
                    // background-color: #ddd;
                    cursor: pointer;
                    transform-origin: 11px 12px;
                    transition: transform ease-in-out 0.3s;
                }
                .refresh:hover
                {
                    transform: rotate(180deg);
                }
            }
            .form-item.active
            {
                .stick
                {
                    opacity: 1;
                }
            }
            .form-item:hover
            {
                .stick
                {
                    opacity: 1;
                }
            }

            .submit-botton
            {
                width: 100%;
                height: 52px;
                margin-top: 45px;
                font-size: 18px;
            }
            .login-fail-msg
            {
                color: #FF4D3F;
            }
            .other-features
            {
                text-align: center;
                padding-top: 32px;

                .feature-item
                {
                    font-size: 16px;
                    color: #AAB1BD;
                    transition: color ease-in-out 0.3s;
                    cursor: pointer;
                }
                .feature-item:hover
                {
                    color: darken(#AAB1BD, 10%);
                }
            }
        }
    }
}
</style>