<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="566"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <div class="project-modal">
                <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="24">
                            <i-form-item class="customed-form-item" prop="imgUrl" label="图片" :label-width="95">
                                <u-upload-image v-model="localAvatar" :maxLength="1"></u-upload-image>
                            </i-form-item>
                        </i-col>
                        <i-col span="24">
                            <i-form-item prop="returnPerson" class="customed-form-item" label="归还人" :label-width="120" filterable>
                                <i-select  v-model="formModel.returnPerson" maxlength="20" filterable>
                                    <i-option v-for="item in selectListObj.stage" :key="item.lastUserId" :value="item.lastUserId">{{item.lastUserName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                       
                        <i-col span="24">
                            <i-form-item prop="power" class="customed-form-item" label="归还时间" :label-width="120">
                                {{formModel.returnDate}}
                            </i-form-item>
                        </i-col>

                        <i-col span="24">
                            <i-form-item prop="returnStatus" class="customed-form-item" label="归还状态" :label-width="120">
                                <i-radio-group v-model="formModel.returnStatus">
                                    <i-radio :label="1" :value="1">
                                        <span>完好</span>
                                    </i-radio>
                                    <i-radio :label="0" :value="0">
                                        <span>损坏</span>
                                    </i-radio>
                                </i-radio-group>
                            </i-form-item>
                        </i-col>

                        <!-- <i-col span="24">
                            <i-form-item prop="returnTo" class="customed-form-item" label="归还转借" :label-width="120">
                                <i-radio-group v-model="formModel.returnTo">
                                    <i-radio :label="1" :value="1">
                                        <span>是</span>
                                    </i-radio>
                                    <i-radio :label="0" :value="0">
                                        <span>否</span><span class="f12">(将工器具不经过公司直接转借给其他人员)</span>
                                    </i-radio>
                                </i-radio-group>
                            </i-form-item>
                        </i-col> -->
                      
                    </i-row>
                </i-form>
            </div>
        </template>
       
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { SpecialService, SpecialTypeService, ProjectService } from "src/services";
import { service } from "src/common/decorator";
import dayjs from "dayjs";
import patterns from "src/common/utils/patterns";
// import SelectEstablishUserModal from "./select-establish-user-modal.vue";

/**
 * 新增、编辑弹层
 * @component
 */
@component({
    components:
    {
        // "select-establish-user-modal": SelectEstablishUserModal
    }
})
export default class ProjectInsertUpdateModal extends CommonView
{
    @service("SpecialService")
    protected specialService: SpecialService;

    @service("SpecialTypeService")
    protected specialTypeService: SpecialTypeService;

    @service("ProjectService")
    protected projectService: ProjectService;

    protected dayjs = dayjs;
    /**
     * 由于头像组件问题 中间转一层
     * @protected
     * @property
     */
    protected localAvatar: Array<any> = [];

    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected insert: Function;

    @config({required: true, default: () => ({})})
    protected selectListObj: any;

    /**
     * 客户体系类型列表
     * @protected
     * @config
     */
    protected customerSpecailList: Array<any> = [];

    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "";

    /**
     * 保存按钮锁
     * @protected
     * @property
     */
    protected loading: boolean = false;

    /**
     * 表单对象
     * @protected
     * @property
     */
    protected formModel: any = {};

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        returnPerson: [{required: true, message: "请选择工具归还人"}]
    };

    /**
     * 打开方法
     * @public
     */
    public async open(data?: any)
    {
        this._curdModal.open();
       
        // 更新
        this.title = "工器具归还";
        
        this.onReset(data);
    }

    /**
     * 重置数据
     * @public
     */
    protected onReset(param?)
    {
        this.formModel =
        {
            toolsInstrumentId: param.id || undefined,
            returnDate: dayjs().format("YYYY-MM-DD hh:mm:ss"),
            returnPerson: 0,
            returnStatus: 0,
            returnTo: false,
            imgUrl: null,
            imgId: null
        };

        this.localAvatar = [];
    }

    /**
     * 监听头像 处理参数
     * @public
     */
    @watch("localAvatar",{immediate: true})
    protected changeLocalAvatar(val)
    {
        if(val[0])
        {
            this.formModel.imgId = val[0].id;
            this.formModel.imgUrl = val[0].filePath;
        }
        else
        {
            this.formModel.imgId = undefined;
            this.formModel.imgUrl = undefined;
        }
    }

    /**
     * 弹层操作事件
     * @param type 操作方式
     */
    protected onOps(type: string, onValidateFailed: Function)
    {
        if (type === "submit")
        {
            this._form.validate(async valid =>
            {
                
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                if(!this.formModel.imgId)
                {
                    this.$message.warning("图片也要上传哦");
                    onValidateFailed();
                    return;
                }
               
                try
                {
                    this.loading = true;
                    console.log(this.formModel);
                    
                    // 新增
                    await this.insert(this.formModel);
                    this.$message.success("操作成功");
                        
                    this.$emit("on-refresh", this.formModel);
                    this.onClosed();
                    this._curdModal.close();
                }
                catch(err)
                {
                    this.loading = false;
                    this.$message.error(err.msg || err.message);
                    onValidateFailed();
                }
                
            });
        }
       
        else
        {
            this._curdModal.close();
        }
    }
    
    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.onReset({});

        this.loading = false;
        this._form.resetFields();
    }

    /**
     * 表格ref
     * @private
     */
    protected get _form(): any
    {
       
        return this.$refs["form"] as any;
       
    }

    /**
     * 弹层实例
     * @private
     * @ref
     */
    protected get _curdModal(): any
    {
        return this.$refs["curdModal"] as any;
    }
    
}
</script>

<style lang="less" scoped>
.item-title
{
    font-size: 14px;
    height: 38px;
    padding-left: 12px;
    position: relative;
    &::before
    {
        position: absolute;
        left: 0;
        content: "";
        width: 3px;
        height: 50%;
        margin-top: 3px;
        background: #3375F4;
    }
}

.item-content-1
{
    background: #fbfbfb;
    border: 1px solid #ececec;
    border-radius: 4px;
    position: relative;
    padding: 20px 10px 0 10px;
    .icon
    {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 5px;
        top: -5px;
        font-size: 30px;
        cursor: pointer;
        &:hover
        {
            color: #4B7EFE;
        }
    }
    .ivu-input-disable
    {
        color: #A6ABB5;
    }
}
    .curd-modal
    {
        .project-modal
        {
            margin-top: 20px;

            .steps
            {
                display: flex;
                justify-content: center;
                padding-left: 25px;
                margin-top: 10px;
                .step
                {
                    display: flex;
                    align-items: center;

                    .dot
                    {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        color: #A6ABB5;
                        background-color: #fff;
                        border: 1px solid #A6ABB5;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        margin-right: 10px;
                    }
                    .label
                    {
                        font-weight: bold;
                        color: #A6ABB5;
                        margin-right: 20px;
                    }
                    .line
                    {
                        width: 100px;
                        height: 1px;
                        background-color: #ECECEC;
                        margin-right: 20px;
                    }
                }
                .step:last-child
                {
                    .line
                    {
                        display: none;
                    }
                }
                .step.active
                {
                    .dot
                    {
                        background-color: #4B7EFE;
                        color: #fff;
                        border-color: #4B7EFE;
                    }
                    .label
                    {
                        color: #182334;
                    }
                }
                .step.finished
                {
                    .dot
                    {
                        background-color: #4B7EFE;
                        color: #fff;
                        border-color: #4B7EFE;
                    }
                    .label
                    {
                        color: #182334;
                    }
                    .line
                    {
                        background-color: #4B7EFE;
                    }
                }
            }
        }
        .customed-form
        {
            padding: 30px;
            padding-left: 10px;
            @{deep}.customed-form-item
            {
                input
                {
                    border-color: #ECECEC;
                }
            }
            @{deep}.date-picker 
            {
                .ivu-date-picker
                {
                    width: 135px;
                }
            }
        }
        .userIdList
        {
            border: 1px solid #ECECEC;
            border-radius: 2px;
            height: 34px;

            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
        }
        // width: 836px;
    
    }


</style>