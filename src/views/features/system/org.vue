<template>
    <div class="system-view organization">
        <div class="option-btns">
            <div class="left-part">
                <span class="label">{{rootName}}</span>
            </div>
            <div class="right-part">
                <i-button type="primary" @click="onAddTopOrg" v-permission="permissionCode.SYSTEM_ORG_XZ">新建组织</i-button>
            </div>
        </div>

        <div class="org-tree-container">
            <org-tree
                :data="orgTreeData"
                :editAuthCode="permissionCode.SYSTEM_ORG_BJ"
                :deleteAuthCode="permissionCode.SYSTEM_ORG_SC"
                :addAuthCode="permissionCode.SYSTEM_ORG_XZ_SUB"
                @on-ops="onOps"
            ></org-tree>
        </div>

        <org-modal
            ref="orgModal"
            :insert="orgService.insert.bind(orgService)"
            :update="orgService.update.bind(orgService)"
            @on-refresh="getOrgTree()"
        ></org-modal>

        <u-warning-modal ref="warningModal"></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { OrgService } from "src/services";
import OrgTree from "./_components/org-tree.vue";
import OrgModal from "./_components/org-modal.vue";
import CommonView from "src/views/common-view";

@component({
    components:
    {
        OrgTree,
        OrgModal
    }
})
export default class OrgView extends CommonView
{
    /**
     * 组织服务。
     * @private
     * @type {OrgService}
     */
    @service("OrgService")
    private orgService: OrgService;

    /**
     * 接口返回的组织树结构数据
     * @property
     */
    protected orgTreeData: Array<any> = [];

    /**
     * 根组织对象
     * @property
     */
    protected rootOrg: any = null;

    /**
     * 根组织名称
     * @property
     */
    protected rootName: string = "-";

    /**
     * 新建组织
     * @protected
     * @member
     */
    protected onAddTopOrg()
    {
        if (!this.orgTreeData)
        {
            this.$message.warning("无组织数据");
            return;
        }

        // 新增组织的父id 写死
        const insertOrg: any =
        {
            id: this.rootOrg.id
        };
        this.$orgModal.open("insert", insertOrg);
    }

    /**
     * 组织架构操作事件
     * @protected
     * @member
     */
    protected onOps(opName: string, data: any)
    {
        if (opName === "add")
        {
            this.$orgModal.open("insert", data);
        }
        else if (opName === "edit")
        {
            this.$orgModal.open("update", data);
        }
        else if (opName === "delete")
        {
            this.$warningModal.open({
                title: "提示",
                content: "是否删除该组织？",
                onOk: async () =>
                {
                    try
                    {
                        if (Array.isArray(data.children) && data.children.length > 0)
                        {
                            this.$message.error("请先删除子组织");
                            return;
                        }
                        await this.orgService.delete(data.id);
                        this.$message.success("删除成功");
                        this.getOrgTree();
                    }
                    catch(err)
                    {
                        this.$message.error(err.msg || err.message);
                    }
                }
            });
        }
    }

    /**
     * 钩子
     * @private
     * @created
     */
    private created()
    {
        this.getOrgTree();
    }

    /**
     * 获取组织树结构
     * @private
     */
    private async getOrgTree()
    {
        try
        {
            const rootOrg = await this.orgService.tree();
            this.orgTreeData = rootOrg.children;
            this.rootOrg = rootOrg;
            this.rootName = rootOrg.name;
        }
        catch (err)
        {
            this.$message.error(err.msg || err.message);
        }
    }

    /**
     * 组织弹层
     * @private
     * @ref
     */
    private get $orgModal(): any
    {
        return this.$refs["orgModal"] as any;
    }

    /**
     * 警告弹层
     * @private
     * @ref
     */
    private get $warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/system";

.organization
{
    padding-top: 30px;
    padding-right: 30px;

    .option-btns
    {
        display: flex;
        justify-content: space-between;
        padding-left: 31px;
    }

    .org-tree-container
    {
        padding-top: 15px;
        padding-left: 31px;
    }
}

.left-part
{
    display: flex;
    align-items: center;

    .label
    {
        font-size: 18px;
        font-weight: bold;
    }
}
</style>