<template>
    <div class="layout-haeder" :class="{'hide-tab': hideTab}">
        <div class="tab-menu">
            <div 
                class="tab-menu-item"
                :class="{active: i === activeTab}"
                v-for="(item, i) in tabs" :key="i"
                @click="onTabClick(i, item)"
            >
                {{item.label}}
            </div>
        </div>

        <div class="user-brand" :class="{fixed: hideTab}">
            <div class="user">
                <i-poptip trigger="hover" title="" content="content">
                    <div class="broadcast-container customerNum rows-1">
                        {{weatherData.alarmInfo}}
                    </div>
                    <section slot="content">
                        
                        <div class="weather-content">
                            {{weatherData.alarmDate}}：{{weatherData.alarmInfo}}
                            {{weatherData.alarmSSDate}}：{{weatherData.alarmSSInfo}}
                            <!-- {{weatherData.alarmInfo}} -->
                            <!-- <p v-for="(item,i) in weatherData.subAlarm" :key="i">{{item.date}}：{{item.str}}</p> -->
                        </div>
                        
                    </section>
                </i-poptip>

                <div class="message-container">
                    <!-- <Badge dot>
                        <Icon class="message" type="ios-notifications-outline" />
                    </Badge> -->

                    <u-notice-message></u-notice-message>
                </div>
                <span class="avatar"></span>
                <i-poptip
                    @on-popper-show="onPopperShow"
                    @on-popper-hide="onPopperHide"
                >
                    <span class="label">{{username}}</span>
                    <Icon class="switch-icon" :class="{active: isPopperShow}" type="ios-arrow-down" />

                    <div slot="content">
                        <div class="user-menu-item" @click="onHeaderMenuClick('update-password')">修改密码</div>
                        <div class="user-menu-item" @click="onHeaderMenuClick('logout')">退出登录</div>
                    </div>
                </i-poptip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";
import { Broadcast, BroadcastManager } from "uxmid-core";
import { IApplicationMenu, IApplicationCredential } from "src/models";
import { BroadcastChannels } from "src/broadcasts";
import { ApplicationContext } from "src/application";
import { WeatherService } from "src/services";

@component
export default class Header extends Component
{
    @config({required: false, type: Array, default: () => []})
    protected tabs: Array<IApplicationMenu>;

    @config({required: false, type: Number, default: -1})
    protected activeTab: number;

    @config({required: false, type: Boolean, default: false})
    protected hideTab: boolean;

    protected isPopperShow: boolean = false;

    protected weatherData: any = {};

    protected get username()
    {
        let targetUserProfile = (ApplicationContext.current.credential as IApplicationCredential).user;
        return targetUserProfile.realname || targetUserProfile.mobile;
    }

    protected onTabClick(tabIndex: number, tab: IApplicationMenu)
    {
        this.$emit("on-tab-change", tabIndex, tab);
    }

    /**
     * 用户头像菜单展示事件
     * @protected
     */
    protected onPopperShow()
    {
        this.isPopperShow = true;
    }

    /**
     * 用户头像菜单隐藏事件
     * @protected
     */
    protected onPopperHide()
    {
        this.isPopperShow = false;
    }

    protected onHeaderMenuClick(type: string)
    {
        switch(type)
        {
            case "logout":
            {
                const logoutMsg = new Broadcast(BroadcastChannels.LOGOUT, null);
                BroadcastManager.instance.send(logoutMsg);
                break;
            }
            case "update-password":
            {
                const updatePasswordMsg = new Broadcast(BroadcastChannels.UPDATE_PASSWORD, null);
                BroadcastManager.instance.send(updatePasswordMsg);
                break;
            }
            default:
            {
                break;
            }
        }
    }

    protected created()
    {
        this.getData();
    }

    protected async getData()
    {
        const weatherService = ApplicationContext.current.serviceProvider.resolve<WeatherService>(WeatherService);
        let res = await weatherService.getSzWeatherAlarm();

        this.weatherData = res.content;
    }
}
</script>

<style lang="less" scoped>
.layout-haeder
{
    position: relative;
    height: 100%;
    width: 100%;

    .tab-menu
    {
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;

        .tab-menu-item
        {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 128px;
            height: 38px;
            margin-right: 10px;
            border: 1px solid #DCE0E7;
            border-radius: 2px;
            background-color: #E9ECF0;
            cursor: pointer;
            transition: background-color,color,border-color ease-in-out 0.3s;
        }
        .tab-menu-item.active
        {
            background-color: #fff;
            color: #3375F4;
            border-color: #3375F4;
            font-weight: bold;
        }
        .tab-menu-item:hover
        {
            background-color: #fff;
            color: #3375F4;
            border-color: #3375F4;
            font-weight: bold;
        }
    }

    .user-brand
    {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        height: 58px;
        padding-top: 10px;
        display: flex;
        align-items: center;

        .user
        {
            display: flex;

            .broadcast-container
            {
                display: flex;
                align-items: center;
                width: 400px;
                max-width: 400px;
                height: 20px;
                margin-right: 50px;
            }
            
            .message-container
            {
                display: flex;
                align-items: center;
                margin-right: 45px;
                padding-top: 3px;
            }
            
            .avatar
            {
                height: 28px;
                width: 28px;
                margin-right: 10px;
                border-radius: 50%;
                background-color: #ddd;
            }
            @{deep}.ivu-poptip-rel
            {
                display: flex;
                align-items: center;
                height: 100%;
                cursor: pointer;

                .label
                {
                    color: #192232;
                    margin-right: 5px;
                }
                .switch-icon
                {
                    position:relative;
                    top:1px;
                    color:#080808;
                    transform: rotate(0);
                    transition: transform ease-in-out 0.3s;
                }
                .switch-icon.active
                {
                    transform: rotate(-180deg);
                }
            }
            @{deep}.ivu-poptip-popper
            {
                min-width: 60px;

                .user-menu-item
                {
                    cursor: pointer;
                }
            }
        }
    }
    .user-brand.fixed
    {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px -15px 20px 27px #fff;
    }
}
.weather-content
{
    width: 500px;
    margin-right: 50px;
    white-space: pre-line;
}
</style>