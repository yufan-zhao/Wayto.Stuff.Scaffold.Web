<template>
    <div class="system-view suggestion-view">
        <!-- <i-button>意见建议</i-button> -->
        <i-table class="table-normal mb20" :data="data" :columns="columuns2"></i-table>
        <i-page :total="rexta" :current="pagin.current" :page-size="10" class="page-right" @on-change="paginChange"></i-page>

        <confirm-modal
            ref="confirmModal"
            :insert="commentsService.update.bind(commentsService)"
            @on-refresh="getData"
        ></confirm-modal>
    </div>

</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { CommentsService, HiddenService } from "src/services";
import { service } from "src/common/decorator";
import ConfirmModal from "./confirm-modal.vue";
import { PermissionCode } from "src/enums";

@component({
    components:
    {
        ConfirmModal
    }
})
export default class Suggestion extends CommonView
{
    @service("CommentsService")
    protected commentsService: CommentsService;

    protected pagin: any =
    {
        current: 1,
        size: 10
    };

    protected rexta = 100;

    protected data: any = [];

    protected columuns2: Array<any> =
    [
        {
            title: "序号",
            type: "index"
        },
        {
            title: "反馈内容",
            render: (h, {row}: any) =>
            {
                return h("div", row.feedbackContent || "-");
            }
        },
        {
            title: "反馈人",
            render: (h, {row}: any) =>
            {
                return h("div", row.createUserName || "-");
            }
        },
        {
            title: "反馈时间",
            render: (h, {row}: any) =>
            {
                return h("div", row.createTime || "-");
            }
        },
        {
            title: "回复内容",
            render: (h, {row}: any) =>
            {
                return h("div", row.replyContent || "-");
            }
        },
        {
            title: "回复人",
            render: (h, {row}: any) =>
            {
                return h("div", row.replyBy || "-");
            }
        },
        {
            title: "回复时间",
            render: (h, {row}: any) =>
            {
                return h("div", row.replyTime || "-");
            }
        },
        {
            title: "操作",
            render: (h, {row}: any) =>
            {
                const _this = this;
                return h("div",
                {
                    class: "font-main",
                    on:
                    {
                        click: () =>
                        {
                            _this._confirmModal.open(row);
                        }
                    },
                    directives:
                    [
                        {
                            name: "permission",
                            value: PermissionCode.SUGGESTION_HF
                        }
                    ]
                },"回复");
            }
        }
    ];

    protected created()
    {
        this.getData();
    }

    protected async getData()
    {
        let content = await this.commentsService.pagin({params: this.pagin});
      
        this.rexta = content.extras && content.extras.total || 0;
        this.data = content.content && content.content.records || [];
    }
    
    protected paginChange(val)
    {
        this.pagin.current = val;
        this.getData();
    }
    
    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _confirmModal(): ConfirmModal
    {
        return this.$refs["confirmModal"] as ConfirmModal;
    }

}
</script>
<style lang="less" scoped>
@import "~src/styles/business/system";

.suggestion-view
{
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
}

.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        // text-align: center;
    }
}
.page-right
{
    float: right;
}
</style>