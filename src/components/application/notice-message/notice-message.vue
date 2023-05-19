<template>
    <div class="notice-message">
        <i-poptip transfer transfer-class-name="notice-message-poptip" trigger="click" placement="bottom">
            <Badge dot :count="readFlag">
                <Icon class="message" type="ios-notifications-outline" />
            </Badge>

            <div class="notice-message-poptip-content" slot="content">
                <div class="ops-container">
                    <i-button class="btn" type="info" @click="onClear">清空</i-button>
                    <i-button class="btn" type="info" @click="onAllReadClick">全部标为已读</i-button>
                </div>

                <div class="split"></div>

                <div class="message-list-container" v-if="messages.length > 0">
                    <div class="message-item" v-for="(item, i) in messages" :key="i" @click="onItemClick(item, i)">
                        <div class="left">
                            <Badge dot :offset="[5, 5]" :count="item.isRead ? 0 : 1">
                                {{item.content}}
                            </Badge>
                        </div>

                        <div class="right">
                            {{item.date}}
                        </div>
                    </div>
                </div>

                <div class="message-list-container" v-else>
                    <u-nodata></u-nodata>
                </div>
            </div>
        </i-poptip>
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";

@component
export default class NoticeMessage extends View
{
    protected get readFlag()
    {
        return this.messages.filter(item => !item.isRead).length;
    }

    protected messages: Array<any> =
    [
        {
            content: "发布了项目报告，请注意查看发布了项目报告，请注意查看发布了项目报告，请注意查看发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        },
        {
            content: "发布了项目报告，请注意查看",
            date: "2023/5/18 18:17",
            isRead: false
        }
    ];

    protected onAllReadClick()
    {
        this.messages.forEach(item =>
        {
            item.isRead = true;
        });
    }

    protected onClear()
    {
        this.messages.splice(0);
    }

    protected onItemClick(item: any, i: number)
    {
        this.$set(this.messages[i], "isRead", true);
        this.$Modal.info({
            content: item.content
        });
    }
}
</script>

<style lang="less">
.notice-message
{
    .ivu-badge-dot
    {
        top: -2px;
        right: -4px;
    }
    .message
    {
        font-size: 22px;
        font-weight: bold;
    }
}

.notice-message-poptip.ivu-poptip-popper
{
    z-index: 1000 !important;
    .ivu-poptip-content
    {
        .ivu-poptip-inner
        {
            .ivu-poptip-body
            {
                .ivu-poptip-body-content
                {
                    
                }
            }
        }
    }

    .notice-message-poptip-content
    {
        overflow: hidden;

        .ops-container
        {
            padding: 8px 14px 12px 14px;
            display: flex;
            justify-content: right;

            .btn
            {
                margin-left: 10px;
                height: 30px;
                min-width: 70px;
                width: auto;
                color: #182334;
            }
        }
        .split
        {
            height: 1px;
            width: 100%;
            background-color: #E9EBEC;
        }
        .message-list-container
        {
            width: 367px;
            max-height: 270px;
            padding: 0 14px;
            overflow-y: auto;

            .message-item
            {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 36px;
                cursor: pointer;

                .left
                {
                    width: calc(100% - 130px);

                    .ivu-badge
                    {
                        padding-right: 5px;
                        align-items: center;
                        display: inline-block;
                        max-width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        vertical-align: bottom;
                    }
                }
                .right
                {
                    text-align: right;
                    width: 130px;
                }
            }
        }
    }
}
</style>