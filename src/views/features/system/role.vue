<template>
    <div class="system-view role">
        <div class="left-side">
            <ul class="role-list">
                <li 
                    class="role-item"
                    v-for="(item, index) in roleList"
                    :key="index" 
                    @click="onRoleSelect(index)"
                >
                    <div class="item-edit-content" v-if="item.isEditing && currentStatus === 'edit-mode'">
                        <i-input type="text" v-model="currentRoleName" :maxlength="8"></i-input>
                        <div class="btns">
                            <i-button @click="onRoleOps('editCancel', index)" :size="'small'" type="info">取消</i-button>
                            <i-button @click="onRoleOps('editSubmit', index)" :size="'small'" type="primary">确定</i-button>
                        </div>
                    </div>
                    <div class="item-content" :class="{active: currentSelectIndex === index}" v-else>
                        <span class="role-label">{{item.name}}</span>
                        <span class="role-ops" v-if="typeof item.editable === 'number' ? Boolean(item.editable) : true" v-permission="[permissionCode.SYSTEM_ROLE_BJ, permissionCode.SYSTEM_ROLE_SC]">
                            <i-poptip class="ops-tip" trigger="click" placement="bottom">
                                <Icon type="md-more" />
                                <div class="tip-content" slot="content">
                                    <span class="btn" @click.stop="onRoleOps('edit', index)" v-permission="permissionCode.SYSTEM_ROLE_BJ">编辑</span>
                                    <span class="btn" @click.stop="onRoleOps('delete', index)" v-permission="permissionCode.SYSTEM_ROLE_SC">删除</span>
                                </div>
                            </i-poptip>
                        </span>
                    </div>
                </li>
            </ul>
            <div class="add-role-btn">
                <div class="add-container" v-if="currentStatus === 'add-mode'">
                    <i-input type="text" v-model="currentRoleName" placeholder="请输入角色名" :maxlength="8"></i-input>
                    <div class="btns">
                        <i-button @click="onAddRoleCancel" type="info">取消</i-button>
                        <i-button @click="onAddRoleSubmit" type="primary">确定</i-button>
                    </div>
                </div>
                <i-button type="primary" @click="onAddRole" v-permission="permissionCode.SYSTEM_ROLE_TJJS">+ 添加角色</i-button>
            </div>
        </div>

        <div class="role-manage" v-if="currentStatus !== 'empty-mode'">
            <i-tabs v-model="currentTabName" :animated="false">
                <TabPane label="菜单权限" name="menuAuth">
                    <div class="save-btn">
                        <i-button type="primary" @click="onRoleSave(1)" v-if="currentRoleEditable" v-permission="permissionCode.SYSTEM_ROLE_BC">保存</i-button>
                        <i-button type="primary" @click="onRoleSave(1)" v-if="extraBtnCtrl" v-permission="permissionCode.SYSTEM_ROLE_BC">保存</i-button>
                    </div>
                    <auth-card
                        class="auth-card-container"
                        :data="currentRolePermission"
                        :permissionTree="globalMenuPermissionTree"
                        @on-permission-change="onCurrentPermissionChange"
                    ></auth-card>
                </TabPane>
                <TabPane label="数据权限" name="dataAuth">
                    <div class="save-btn">
                        <i-button type="primary" @click="onRoleSave(2)" v-if="currentRoleEditable" v-permission="permissionCode.SYSTEM_ROLE_BC">保存</i-button>
                        <i-button type="primary" @click="onRoleSave(2)" v-if="extraBtnCtrl" v-permission="permissionCode.SYSTEM_ROLE_BC">保存</i-button>
                    </div>
                    <auth-card
                        class="auth-card-container"
                        singleChild
                        :data="currentRolePermission"
                        :dataAuth="currentRoleDataPermission"
                        :permissionTree="globalDataPermissionTree"
                        @on-permission-change="onDataPermissionChange"
                    ></auth-card>
                </TabPane>
            </i-tabs>
            
        </div>
        <div class="role-manage" v-else>
            无数据，请先添加角色
        </div>
        <u-warning-modal
            ref="warningModal"
        ></u-warning-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { service } from "src/common/decorator/service";
import { RoleService, PermissionService } from "src/services";

import authCard from "./_components/role-auth-card.vue";

@component({
    components:
    {
        "auth-card": authCard
    }
})
export default class Role extends CommonView
{
    /**
     * 角色服务。
     * @private
     * @type {RoleService}
     */
    @service("RoleService")
    private roleService: RoleService;

    @service("PermissionService")
    private permissionService: PermissionService;

    /**
     * 当前选择的角色是否可修改，默认可以修改
     * null, 0 - 可以编辑
     * 1 - 只读
     * @protected
     * @returns {boolean}
     */
    protected get currentRoleEditable(): boolean
    {
        if (this.roleList.length === 0)
        {
            return false;
        }
        else
        {
            if (this.currentSelectIndex < 0)
            {
                return true;
            }

            if (this.roleList[this.currentSelectIndex])
            {
                return typeof this.roleList[this.currentSelectIndex].editable === "number" ? Boolean(this.roleList[this.currentSelectIndex].editable) : true;
            }
            else
            {
                return false;
            }
        }
    }

    protected currentTabName = "menuAuth";

    /**
     * 组件状态列表
     * @private
     * @returns {Array<string>}
     */
    protected status: Array<string> = ["empty-mode", "add-mode", "query-mode", "edit-mode"];

    /**
     * 额外的保存按钮控制标识
     * @protected
     * @property
     * @returns {boolean}
     */
    protected extraBtnCtrl: boolean = false;

    /**
     * 组件当前状态
     * @protected
     * @returns {string}
     */
    protected currentStatus: string = this.status[0];

    /**
     * 角色列表
     * @protected
     * @returns {Array<any>}
     */
    protected roleList: Array<any> = [];

    /**
     * 角色下的用户列表
     * @protected
     * @returns {Array<any>}
     */
    protected currentUserList: Array<any> = [];

    /**
     * 上一个选择的角色索引
     * @protected
     * @returns {number}
     */
    protected lastSelectIndex: number = 0;

    /**
     * 当前选择的角色索引
     * @protected
     * @returns {number}
     */
    protected currentSelectIndex: number = 0;

    /**
     * 当前角色名称
     * @protected
     * @returns {string}
     */
    protected currentRoleName: string = "";

    /**
     * 当前角色是否可修改，默认可以修改
     * @protected
     * @returns {boolean}
     */
    protected currentRoleReadonly: boolean = false;

    /**
     * web菜单权限数据源
     * @protected
     * @returns {Array<any>}
     */
    protected globalMenuPermissionTree: Array<any> = [];

    /**
     * 数据权限数据源
     * @property
     */
    protected globalDataPermissionTree: Array<any> = [];

    protected currentRolePermission = [];

    protected currentRoleDataPermission = [];

    /**
     * 用于提交的当前角色的权限列表
     * @property
     */
    protected currentPermissionList = [];

    protected currentMenuPermissionList = [];

    protected currentDataPermissionList = [];

    /**
     * 角色列表搜索条件
     * @protected
     * @returns {any}
     */
    protected filters: any =
    {
        roleName: null
    };

    protected onCurrentPermissionChange(permissionList: Array<any>)
    {
        this.currentMenuPermissionList = permissionList;
    }

    protected onDataPermissionChange(permissionList: Array<any>)
    {
        this.currentDataPermissionList = permissionList;
    }

    /**
     * 角色操作按钮组事件
     * @protected
     * @param opsName 操作类型
     * @param index 索引
     * @returns {Promise<void>}
     */
    protected async onRoleOps(opsName: string, index: number): Promise<void>
    {
        if (opsName === "edit")
        {
            this.currentStatus = this.status[3];
            this.roleList.forEach(item =>
            {
                item.isEditing = false;
            });
            this.roleList[index].isEditing = true;
        }
        else if (opsName === "delete")
        {
            this.$warningModal.open({
                title: "确定删除",
                content: "是否确定删除当前角色",
                onOk: async () => {
                    await this.deleteRole(this.roleList[index].id);
                    await this.getRoleList();
                    if (this.roleList.length > 0)
                    {
                        this.onRoleSelect(0);
                        // await this.getRoleUserList();
                        this.setDefaultSelect();
                    }
                }
            });
        }
        else if (opsName === "editCancel")
        {
            this.roleList[index].isEditing = false;
            this.currentStatus = this.status[2];
        }
        else if (opsName === "editSubmit")
        {
            this.roleList[index].isEditing = false;
            let res = await this.updateRole(this.roleList[this.currentSelectIndex].id, this.roleList[this.currentSelectIndex].parentId);
            if (res.code === 200)
            {
                this.roleList[index].name = this.currentRoleName;
                this.currentStatus = this.status[2];
            }
        }
    }

    /**
     * 添加角色监听事件
     * @protected
     * @returns {void}
     */
    protected onAddRole(): void
    {
        this.lastSelectIndex = this.currentSelectIndex;
        this.currentSelectIndex = -1;
        this.currentStatus = this.status[1];
        this.currentRoleName = "";
        this.currentRoleReadonly = false;
    }

    /**
     * 添加角色取消事件
     * @protected
     * @returns {void}
     */
    protected onAddRoleCancel(): void
    {
        this.currentStatus = this.status[2];
        this.onRoleSelect(this.lastSelectIndex);
    }

    /**
     * 添加角色确定事件
     * @protected
     * @returns {Promise<void>}
     */
    protected async onAddRoleSubmit(): Promise<void>
    {
        if (!this.currentRoleName)
        {
            this.$message.error("角色名不能为空");
            return;
        }

        await this.addRole();
        await this.getRoleList();
        this.setDefaultSelect();
        // await this.getRoleUserList();
    }

    /**
     * 角色新增、编辑保存事件
     * @protected
     * @returns {Promise<void>}
     */
    protected async onRoleSave(type: number = 1): Promise<void>
    {
        try
        {
            if (type === 1)
            {
                await this.updateCurrentRolePermission(this.roleList[this.currentSelectIndex].id, this.currentMenuPermissionList, type);
            }
            else
            {
                await this.updateCurrentRolePermission(this.roleList[this.currentSelectIndex].id, this.currentDataPermissionList, type);
            }
            this.$message.success("保存成功");
        }
        catch(err)
        {
            this.$message.error(err.msg || err.message);
        }
        
        // const res = await this.updateRole(this.roleList[this.currentSelectIndex].id, this.roleList[this.currentSelectIndex].parentId);
        // this.$message.success("保存成功");
        // await this.getRoleList();
        // this.setDefaultSelect();
    }

    /**
     * 角色选择事件
     * @protected
     * @param index 索引
     * @returns {Promise<void>}
     */
    protected async onRoleSelect(index: number): Promise<void>
    {
        if (index === this.currentSelectIndex)
        {
            return;
        }
        this.currentStatus = this.status[2];
        this.currentSelectIndex = index;
        this.currentRoleName = this.roleList[this.currentSelectIndex].name;
        this.currentRoleReadonly = typeof this.roleList[this.currentSelectIndex].editable === "number" ? !Boolean(this.roleList[this.currentSelectIndex].editable) : false;

        this.getSelectRolePermission();
    }

    /**
     * 默认选中第一个角色
     * @private
     * @returns {void}
     */
    private setDefaultSelect(): void
    {
        this.currentStatus = this.status[2];
        this.currentSelectIndex = 0;
        this.currentRoleName = this.roleList[this.currentSelectIndex].name;

        // TODO 查询详情
        this.getSelectRolePermission();
    }

    private async created()
    {
        const res = await this.permissionService.queryTreeAll();
        this.globalMenuPermissionTree = res.filter(item => item.type === 1);
        this.globalDataPermissionTree = res.filter(item => item.type === 2);
        // console.log(this.globalMenuPermissionTree);

        await this.getRoleList();
        if (this.roleList.length === 0)
        {
            this.currentStatus = this.status[0];
        }
        else
        {
            this.setDefaultSelect();
        }
    }

    private async getSelectRolePermission()
    {
        this.currentRolePermission.splice(0);
        let index = this.currentSelectIndex;

        // 查询数据权限
        let dataAuthRes = await this.permissionService.queryList(this.roleList[index].id, 2);
        this.currentRoleDataPermission = dataAuthRes;

        const res = await this.roleService.getDetailById(this.roleList[index].id);
        if (Array.isArray(res.content.permissionIdList))
        {
            this.currentRolePermission.push(...res.content.permissionIdList);
        }
    }

    /**
     * 获取角色列表
     * @private
     * @returns {Promise<void>}
     */
    private async getRoleList(): Promise<void>
    {
        try
        {
            let req: any = {};
            if (this.filters.roleName)
            {
                req.roleName = this.filters.roleName;
            }
            const res = await this.roleService.list();
            if (!Array.isArray(res))
            {
                throw new Error("查询角色列表返回异常");
            }

            this.roleList = res;
        }
        catch (err)
        {
            console.error("查询全部角色异常", err);
            this.$message.error(err.msg);
        }
    }

    /**
     * 新增角色
     * @private
     * @returns {Promise<void>}
     */
    private async addRole(): Promise<void>
    {
        try
        {
            const res = await this.roleService.insert({
                name: this.currentRoleName
            });
        }
        catch (err)
        {
            console.error("新增角色异常", err);
            this.$message.error(err.msg);
        }
    }

    /**
     * 删除角色
     * @private
     * @param roleId 角色id
     * @returns {Promise<void>}
     */
    private async deleteRole(roleId: number): Promise<void>
    {
        try
        {
            await this.roleService.delete(roleId);
        }
        catch (err)
        {
            console.error("删除角色异常", err);
            this.$message.error(err.msg);
        }
    }

    /**
     * 更新角色
     * @private
     * @param roleId 角色id
     * @returns {Promise<any>}
     */
    private async updateRole(roleId: number, parentId: number): Promise<any>
    {
        try
        {
            const res = await this.roleService.update({
                id: roleId,
                name: this.currentRoleName
            });
            this.$message.success("操作成功");
            return res;
        }
        catch (err)
        {
            console.error("更新角色异常", err);
            this.$message.error(err.msg);
        }
    }

    private async updateCurrentRolePermission(roleId: number, permissionList: Array<any>, type: number)
    {
        const res = await this.roleService.updateRolePermission(roleId, permissionList, type);
        return res;
    }

    /**
     * 警告弹层
     * @private
     * @returns {any}
     */
    private get $warningModal(): any
    {
        return this.$refs["warningModal"] as any;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/system";
.role
{
    display: flex;
    height: 100%;

    .left-side
    {
        display: flex;
        flex: 0 0 auto;
        flex-direction: column;
        width: 210px;
        margin-top: 30px;
        padding-bottom: 50px;
        height: 100%;
        border-right: 1px solid #E9EBEC;

        .search-input
        {
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 9px;
            width: 170px;
        }
        .role-list
        {
            margin-left: 20px;
            padding-right: 20px;
            overflow: auto;

            .item-content
            {
                display: flex;
                justify-content: space-between;
                padding-top: 17px;
                padding-bottom: 17px;
                padding-left: 12px;
                line-height: 14px;

                .role-label
                {
                    font-size: 14px;
                    font-weight: 400;
                    color: #182334;
                    cursor: pointer;
                    width: 138px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: inline-block;
                    white-space: nowrap;
                }
                .role-ops
                {
                    @{deep}.ops-tip
                    {
                        i
                        {
                            cursor: pointer;
                        }
                        .ivu-poptip-popper
                        {
                            width: 92px;
                            min-width: 92px;
                            z-index: 300;

                            .ivu-poptip-body
                            {
                                padding: 0;

                                .tip-content
                                {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    padding: 19px 0;
                                    font-size: 14px;
                                    line-height: 14px;
                                    color: #182334;

                                    .btn
                                    {
                                        cursor: pointer;
                                    }
                                    .btn:first-child
                                    {
                                        margin-bottom: 14px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .item-content.active
            {
                .role-label
                {
                    color: #2E53F2;
                    font-weight: bold;
                }
            }

            .item-edit-content
            {
                .btns
                {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 5px;

                    @{deep}.ivu-btn
                    {
                        min-width: 80px;
                    }
                    @{deep}.ivu-btn:nth-child(1)
                    {
                        margin-right: 10px;
                        min-width: 80px;
                    }
                }
            }
        }
        .add-role-btn
        {
            margin-top: 21px;
            margin-left: 20px;

            @{deep}.ivu-btn-primary
            {
                width: 170px;
                height: 40px;
            }

            .add-container
            {
                padding-right: 20px;

                .btns
                {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 5px;
                    padding-bottom: 10px;

                    .ivu-btn
                    {
                        min-width: 80px;
                        width: 70px;
                        height: 34px;
                        line-height: 34px;
                    }
                }
            }
        }
    }

    .role-manage
    {
        position: relative;
        width: 100%;
        margin-top: 30px;
        overflow: auto;
        padding: 0 30px;

        .sub-title
        {
            margin-left: 30px;
            padding-top: 16px;
            color: #182334;
            font-size: 16px;
            line-height: 16px;
            font-weight: bold;
        }

        .save-btn
        {
            position: relative;
            right: 0px;
            top: 0;
            text-align: right;
        }

        .user-list-container
        {
            display: flex;
            height: 125px;
            margin-left: 30px;
            margin-right: 30px;
            margin-top: 19px;
            border: 1px solid rgba(245,245,250,1);
            border-radius: 4px;
            background-color: #fbfcfe;

            .user-item
            {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin: 18px 22.5px;

                .circle
                {
                    height: 64px;
                    width: 64px;
                    border-radius: 64px;
                }
                .add
                {
                    background-color: #e6e9ec;
                    color: #fff;
                    text-align: center;
                    font-size: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: baseline;
                    cursor: pointer;
                }
                .label
                {
                    text-align: center;
                    color: #182334;
                    font-weight: 400;
                    line-height: 14px;
                }
            }

            .user-list
            {
                overflow-y: hidden;
                white-space: nowrap;
                max-width: 1440px;

                .user
                {
                    display: inline-block;
                    flex-direction: column;
                    justify-content: space-between;
                    margin: 18px 22.5px; 

                    .avatar
                    {
                        display: block;
                        width: 64px;
                        height: 64px;
                        border-radius: 64px;
                        background-image: url("../../../assets/default-user.jpg");

                        .photo
                        {
                            width: 64px;
                            height: 64px;
                            border-radius: 64px;
                            position: relative;
                        }
                        .delete-mask
                        {
                            position: relative;
                            z-index: 20;
                            display: none;
                            justify-content: center;
                            align-items: center;
                            width: 64px;
                            height: 64px;
                            border-radius: 64px;
                            background-color: rgba(0, 0, 0, 0.4);
                            color: #fff;
                            cursor: pointer;
                        }
                    }
                    .avatar:hover
                    {
                        .delete-mask
                        {
                            display: flex;
                            cursor: pointer;
                        }
                    }
                    .label
                    {
                        display: block;
                        margin-top: 8px;
                        text-align: center;
                        color: #182334;
                        font-weight: 400;
                        width: 64px;
                        // line-height: 14px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }

        .auth-card-container
        {
            margin: 14px 0px 0 0px;
        }
        .auth-card-container:last-child
        {
            margin-bottom: 41px;
        }
    }
}
</style>