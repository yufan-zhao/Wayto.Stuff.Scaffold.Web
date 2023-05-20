<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="836"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item prop="knowledgeType" class="customed-form-item" label="知识类型" :label-width="120">
                            <i-radio-group v-model="formModel.knowledgeType" @on-change="specialTypeFlagChage">
                                <i-radio :label="1" :value="1">
                                    <span>标准体系</span>
                                </i-radio>
                                <i-radio :label="2" :value="2" >
                                    <span>客户体系</span>
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                    </i-col>

                    <i-col span="24" v-if="formModel.knowledgeType === 2">
                        <i-form-item class="customed-form-item" label="业主单位" prop="customerId" :label-width="108">
                            <i-select  v-model="formModel.customerId" maxlength="20" @on-change="onchangeCustomer" clearable filterable> 
                                <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>

                    <i-col span="24">
                        <i-form-item prop="specialTypeId" class="customed-form-item" label="体系类型" :label-width="108 ">
                            <!-- 客户体系 列表 -->
                            <i-radio-group v-model="formModel.specialTypeId" v-if="formModel.knowledgeType === 2" @on-change="specialTypeChage">
                                <i-radio :label="item.id" :value="item.id" :disabled="formModel.knowledgeType === 2 && !formModel.customerId" v-for="item in customerSpecailList" :key="item.id">
                                    <span>{{item.name}}({{item.code}})</span>
                                </i-radio>
                            </i-radio-group>

                            <!-- 标准体系 列表 -->
                            <i-radio-group v-model="formModel.specialTypeId" v-if="formModel.knowledgeType === 1" @on-change="specialTypeChage">
                                <i-radio :label="item.id" :value="item.id" :disabled="false" v-for="item in specialTypesLists" :key="item.id">
                                    <span>{{item.name}}({{item.code}})</span>
                                </i-radio>
                            </i-radio-group>
                            
                        </i-form-item>
                    </i-col>

                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="体系" prop="specialIds" :label-width="108">
                            <i-cascader :data="specialIdsList" v-model="formModel.specialIds" :disabled="formModel.knowledgeType === 2 && customerSpecailList.length < 1" change-on-select filterable @on-change="userAreaListChange"></i-cascader>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="图片" :label-width="95">
                            <u-upload-image v-model="localAvatar" :maxLength="9"></u-upload-image>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="文章内容" prop="content"  :label-width="108">
                           <div class="content">

                            <i-input type="textarea" v-model="formModel.content" class="textarea-contnt"></i-input>
                            <!-- <textarea name="" id="" cols="30" rows="100"></textarea> -->
                                <!-- <div id="richText" ref="richText">

                                </div> -->
                            </div>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>

        <div slot="footer">

            <!-- <i-button type="info">预览</i-button> -->
            <!-- <i-button type="info" v-if="!formModel.release" @click="onOps('save',()=>{})">存为草稿</i-button> -->
            <i-button type="info" @click="resertC">取消</i-button>
            <i-button type="primary" @click="onOps('submit',()=>{})" :loading="loadingssss">发布</i-button>
        </div>
    </u-crud-modal>
</template>

<script lang="ts">
import { imagePath } from "src/common/utils/extend-utils";
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import E from "wangeditor";
import CommonView from "src/views/common-view";
import { SpecialService, SpecialTypeService, UploadService } from "src/services";
import { service } from "src/common/decorator";
/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends CommonView
{
    @service("UploadService")
    protected commonFileService: UploadService;

    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected insert: Function;

    @config({required: true, type: Object})
    protected selectListObj: any;

    @service("SpecialService")
    protected specialService: SpecialService;

    @service("SpecialTypeService")
    protected specialTypeService: SpecialTypeService;

    /**
     * 修改接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected update: Function;

    protected loadingssss: boolean = false;

    /**
     * 由于头像组件问题 中间转一层
     * @protected
     * @property
     */
    protected localAvatar: Array<any> = [];

    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "";

    /**
     * 复制备用Id
     * @protected
     * @property
     */
    protected copyId: any = "";
    protected copyTypeId: any = "";
    protected copy: any = false;
    /**
     * 体系列表
     * @protected
     * @config
     */
    protected specialIdsList: Array<any> = [];

    /**
     * 客户体系类型列表
     * @protected
     * @config
     */
    protected customerSpecailList: Array<any> = [];

    /**
     * 标准体系类型列表
     * @protected
     * @config
     */
    protected specialTypesLists: Array<any> = [];

    /**
     * 表单对象
     * @protected
     * @property
     */
    protected formModel: any = {};

    protected detail: any = {};

    protected editor: E;

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        title: [{required: true, message: "请输入标题"}],
        customerId: [{required: true, message: "请选择业主"}],
        specialIds: [{required: true, message: "体系"}],
        securityServicesType: [{required: true, message: "请选择文章类型"}],
        excellentCaseType: [{required: true, message: "请选择文章类型"}],
        safetyTrainingType: [{required: true, message: "请选择文章类型"}],
        publisher: [{required: true, message: "请输入发布者"}]
    };

    /**
     * 打开方法
     * @public
     */
    public open(data?: any)
    {
        this.editor = null;
        // console.log(document.getElementById("richText"));
        // document.getElementById("richText").innerHTML = null;
        // 
        if (data && data.id)
        {
            // 更新
            this.title = "编辑";
            this.formModel = data;
            this.getSpecailList();
            this.copyTypeId = data.specialTypeId;
            this.localAvatar = data.imageList || [];
        }
        else
        {
            // 新增
            this.title = "新增";
            // this.formModel = data;
            this.localAvatar = [];
            this.$set(this.formModel,"specialTypeId", this.specialTypesLists[0] && this.specialTypesLists[0].id);
            this.$set(this.formModel,"knowledgeType", 1);
        }
        
        this.specialTypeFlagChage(1,{}, data.specialTypeId || null);
        
        this.initEdit();
        this._curdModal.open();
        
    }

    protected created()
    {
        this.getData();
    }

    protected async getData()
    {
        // 体系类型表 -- 标准
        let specialTypesLists = await this.specialTypeService.getSpecialTypeList(0);
        this.$set(this,"specialTypesLists",specialTypesLists);

    }

    protected async getSpecailList()
    {
        // 体系类型表 -- 客户
        let content = await this.specialTypeService.specialTypes(this.formModel.customerId);
        this.$set(this,"customerSpecailList",content);
    }

    /**
     * 单选按钮选择事件 -- 标准/客户 -- 体系
     * @protected
     * 
     */
    protected async specialTypeFlagChage(value,label?, specialTypeId?)
    {
        console.log(value,label, specialTypeId);
        
        if(!value)
        {
            this.$set(this.formModel,"specialTypeId", specialTypeId ? specialTypeId : this.customerSpecailList[0].id);
        }
        else
        {
            this.$set(this.formModel,"specialTypeId", specialTypeId ? specialTypeId : this.specialTypesLists[0].id);
        }
        
        this.specialTypeChage(this.formModel.specialTypeId);

    }

    /**
     * 业主方更改 触发
     * @protected
     * 
     */
    protected async onchangeCustomer(value?, specialTypeId?)
    {
        this.getSpecailList();

        if(this.formModel.knowledgeType === 2)
        {
            this.$set(this.formModel,"specialTypeId", value === this.copyTypeId  ? this.copyTypeId : this.customerSpecailList[0].id);
        }
        else
        {
            this.$set(this.formModel,"specialTypeId", value === this.copyTypeId ? this.copyTypeId : this.specialTypesLists[0].id);
        }

        this.getKnowledgeSpecial(this.formModel.specialTypeId);
    }

    /**
     * 单选按钮选择事件 -- 体系类型 -- 获得体系列表
     * @protected
     * 
     */
    // @watch("formModel.specialTypeId",{immediate: true, deep: true})
    protected async specialTypeChage(value,label?)
    {
        
        this.getKnowledgeSpecial(value);
        
        if(this.copyTypeId === value)
        {
            this.$set(this.formModel,"specialIds",this.formModel.specialIds);
           
        }else
        {
            this.$set(this.formModel,"specialIds", []);
           
        }
        
    }

    protected async getKnowledgeSpecial(value)
    {
        this.specialIdsList = [];
        let specialIdsList = await this.specialService.getKnowledgeSpecial(value);

        this.transferTree(null,specialIdsList);
        
    }

    /**
     * 处理组织架构
     * @ref
     */
    protected transferTree(parentData: any = {}, data: any): any
    {
       data.forEach(item =>
        {
            let items: any = {};
            items.label = item.name;
            items.value = item.id;
            items.children = item.children.map(itm =>
            {
                let itms: any = {};
                itms.label = itm.name;
                itms.value = itm.id;
                itms.children = itm.children.map(ele =>
                {
                    let eles: any = {};
                    eles.label = ele.name;
                    eles.value = ele.id;
                    if(eles.children)
                    {
                        eles.children.map(el =>
                        {
                            let els: any = {};
                            els.label = el.name;
                            els.value = el.id;
                            return els;
                        });
                    }else
                    {
                        return eles;
                    }
                    
                });
                return itms;
            });
            
            this.specialIdsList.push(items);
        });
    }
    protected userAreaListChange(val)
    {
        this.$set(this.formModel,"specialId", val[val.length - 1]);
    }

    /**
     * 弹层操作事件
     * @param type 操作方式
     */
    protected async onOps(type: string, onValidateFailed: Function)
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
                this.loadingssss = true;
                try
                {
                    this.formModel.imageIds = this.localAvatar.map(item => item.id).join(",");

                    if (this.formModel.id)
                    {
                        // 更新
                        await this.update({param:
                        {
                            ...this.formModel,
                            release: 1
                        }});
                        this.$message.success("发布成功");
                    }
                    else
                    {
                        // 新增
                        await this.insert({param:
                        {
                            ...this.formModel,
                            release: 1
                        }});
                        this.$message.success("发布成功");
                    }
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
                    
                }
                catch(err)
                {
                    this.$message.error(err.msg || err.message);
                    onValidateFailed();
                    
                }
                finally
                {
                    this.loadingssss = false;
                }
            });
        }
        else if(type === "save")
        {
            if(this.formModel.id)
            {
                await this.update({param:
                {
                    ...this.formModel,
                    release: 0
                }});
            }else
            {
                await this.insert({param:
                {
                    ...this.formModel,
                    release: 0
                }});
            }
            await window.location.reload();
            this.$emit("on-refresh", this.formModel);
            this._curdModal.close();
            this.$message.success("保存成功");
        }
        else
        {
            this._curdModal.close();
            this.editor = null;
        }
    }

    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.formModel = {};
        this._form.resetFields();

        // this._curdModal.close();
    }

    protected resertC()
    {
        // this.onClosed();
        this._curdModal.close();
    }

    /**
     * 上传input DOM
     * @get
     */
    private get _uploadInput()
    {
        return this.$refs["uploadInput"] as any;
    }
    
    /**
     * 文件选择变化事件
     * @protected
     */
    protected async onFileChange(event: Event)
    {
        const target = <HTMLInputElement>event.target;
        const fileList: FileList = target.files;

        try
        {
            const res = await this.commonFileService.upload({
                files: fileList
            });
            res.content && res.content.forEach(item =>
            {
                this.editor.txt.append(`<p><a href="${imagePath(item.filePath, "url")}" download="${item.fileName}">${item.originalName}</a></p>`);
            });
            
        }
        catch(err)
        {
            // 处理上传异常
            this.$message.error(err.msg || err.message);
        }
        finally
        {
            target.value = ""; // 清空input中的文件
        }
        
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
    
    protected get _richText(): any
    {
        return this.$refs["richText"] as any;
    }

    protected initEdit()
    {
        let node = document.createElement("div"); // 创建新元素
        let editor = new E(node); // 创建编辑器

        const { BtnMenu } = E; // 获取编辑器菜单工具
        const _uploadInput = this._uploadInput;
        const _formModel = this.formModel; // 定义数据模型

        // 创建工具新菜单
        class UploadFileMenu extends BtnMenu
        {
            public constructor(editor) {
                console.log(editor);
                // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
                const $elem = E.$(
                    `<div class="w-e-menu" data-title="上传文件">
                        <i class="iconfont iconicon_wenjianjia"></i>
                    </div>`
                );
                super($elem, editor);
            }

            public clickHandler()
            {
                console.log(111111111);
                
                _uploadInput.click();
            }
            public tryChangeActive(val)
            {
                _formModel.content = editor.txt.html();
            }
        }
        editor.menus.extend("uploadFileMenuKey", UploadFileMenu);
        editor.menus.extend("Video", UploadFileMenu);
        editor.config.menus.push("uploadFileMenuKey"); // 插入菜单 -- 上传图片新增本地上传
        editor.config.menus.push("Video"); // 插入菜单 -- 上传视频新增本地上传
        console.log("--  ",editor.config);
        editor.config.height = 400; // 输入框 设置高
        editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
            console.log(resultFiles, insertImgFn);
            
            const commonFileRes = await this.commonFileService.upload({
                files: resultFiles
            });
            commonFileRes.content.forEach(item => {
                insertImgFn(imagePath(item.filePath, "url"));
            });
        };
        console.log(editor.config.customUploadImg);

        // 上传视频
        editor.config.customUploadVideo = async (resultFiles, insertImgFn) => {
            const commonFileRes = await this.commonFileService.upload({
                files: resultFiles
            });
            commonFileRes.content.forEach(item => {
                insertImgFn(imagePath(item.filePath, "url"));
            });
        };

        // 组合编辑器
        editor.create();
        
        // 编辑器 输入框内容
        editor.txt.html(this.formModel.content);

        // 输入框插入组件
        // document.getElementById("richText").appendChild(node);
    }
}
</script>

<style lang="less" scoped>
.customed-form
{
    padding: 30px 30px 0 5px;
}
.content #richText
{
    /deep/img
    {
        max-height: 300px !important;
    }
    /deep/.w-e-toolbar
    {
        z-index: 88 !important;
    }
    /deep/.w-e-menu .w-e-panel-container
    {
        margin-left: 0 !important;
    }
    /deep/.w-e-text-container
    {
        z-index: 10 !important;
    }
}
.textarea-contnt 
{
    /deep/ textarea
    {
        height: 200px;
    }
    
}
</style>