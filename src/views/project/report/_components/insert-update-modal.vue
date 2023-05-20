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
            <i-form class="customed-form" ref="form_0" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start"  class="item-content-1">
                    <i-col span="24">
                        <i-form-item prop="customerId" class="customed-form-item" label="业主单位" :label-width="120">
                            <i-select  v-model="formModel.customerId" maxlength="20" @on-change="onchangeCustomer">
                                <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item prop="projectId" class="customed-form-item" label="项目名称" :label-width="120">
                            <i-select  v-model="formModel.projectId" maxlength="20" @on-change="projectItemChange">
                                <i-option v-for="(item, i) in projectList" :key="'project-id-option-' + i" :value="item.id">{{item.projectName}}</i-option>
                            </i-select> 
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item prop="255555" class="customed-form-item" label="项目类型" :label-width="120">
                            <i-input v-model="formModel.detail.projectTypeName" disabled></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="12">
                        <i-form-item prop="255555" class="customed-form-item" label="所属街道/社区" :label-width="120">
                            <i-input v-model="formModel.detail.streetCommunity" disabled></i-input>
                        </i-form-item>
                    </i-col>

                    <i-col span="12">
                        <i-form-item prop="location" class="customed-form-item" label="项目地址" :label-width="120">
                            <i-input v-model="formModel.detail.projectAddress" disabled></i-input>
                        </i-form-item>
                    </i-col>

                    <i-col span="12">
                        <i-form-item prop="255555" class="customed-form-item" label="施工阶段" :label-width="120">
                            <i-input v-model="formModel.detail.constructionStageName" disabled></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>

            <div class="project-modal">
                <div class="steps">
                    <div class="step" :class="{active: stepIndex === 0, finished: stepIndex > 0}">
                        <span class="dot">1</span>
                        <span class="label">诊治成员</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 1, finished: stepIndex > 1}">
                        <span class="dot">2</span>
                        <span class="label">诊治体系</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 1, finished: stepIndex > 2}">
                        <span class="dot">3</span>
                        <span class="label">施工/监理单位</span>
                        <span class="line"></span>
                    </div>
                </div>
                <i-form v-show="stepIndex === 0" class="customed-form" ref="form" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="12">
                            <i-form-item prop="consultNum" class="customed-form-item" label="诊治编号" :label-width="120">
                                <i-input v-model="formModel.consultNum" placeholder="请输入诊治编号" maxlength="255"/>
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="consultTime" class="customed-form-item" label="诊治计划时间 " :label-width="120">
                                <i-date-picker type="date" v-model="formModel.consultTime" placeholder="请选择" format="yyyy-MM-dd" style="width: 70%"></i-date-picker>
                                <i-select  v-model="formModel.timeMark" maxlength="20" style="width: 30%">
                                    <i-option :value="0">上午</i-option>
                                    <i-option :value="1">下午</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="priority" class="customed-form-item" label="诊治优先级" :label-width="120">
                                <i-select  v-model="formModel.priority" maxlength="20">
                                    <i-option v-for="item in [1,2,3]" :key="'priority-option-' + item" :value="item">{{item}}级</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="consultGroup" class="customed-form-item" label="诊治组名" :label-width="120">
                                <i-select  v-model="formModel.consultGroup" maxlength="20">
                                    <i-option v-for="item in selectListObj.groundName" :key="'consultGroup-option-' + item.id" :value="item.id">{{item.typeName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="consultType" class="customed-form-item" label="诊治类型" :label-width="120">
                                <i-select  v-model="formModel.consultType" maxlength="20">
                                    <i-option v-for="item in selectListObj.diagonalList" :key="'consultType-option-' + item.id" :value="item.id">{{item.typeName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        
                        <i-col span="12">
                            <i-form-item prop="captain" class="customed-form-item" label="诊治组长" :label-width="120">
                                <i-select  v-model="formModel.captain" maxlength="20">
                                    <i-option v-for="item in selectListObj.getLeaders3" :key="'captain-option-' + item.userId" :value="item.userId">{{item.name}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="crews" class="customed-form-item" label="诊治组员" :label-width="120">
                                <i-select  v-model="formModel.crews" maxlength="20" multiple>
                                    <i-option v-for="item in selectListObj.getLeaders2" :key="'crews-option-' + item.userId" :value="item.userId">{{item.name}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <!-- <i-col span="12">
                            <i-form-item prop="localeDepartment" class="customed-form-item" label="现场科室" :label-width="120">
                               <i-input v-model="formModel.localeDepartment"></i-input>
                            </i-form-item>
                        </i-col> -->
                    </i-row>
                </i-form>
                <i-form v-show="stepIndex === 1" class="customed-form" ref="form1" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start"  class="item-content-1">
                        <i-col span="24">
                            <i-form-item prop="255555" class="customed-form-item" label="" :label-width="0">
                               <i-radio-group v-model="formModel.specialTypeFlag" @on-change="specialTypeFlagChage">
                                    <i-radio :label="1" :value="1" >
                                        <span>标准体系</span>
                                    </i-radio>
                                    <i-radio :label="0" :value="0" >
                                        <span>客户体系</span>
                                    </i-radio>
                                </i-radio-group>
                            </i-form-item>
                        </i-col>
                        <i-col span="24">
                            <i-form-item prop="255555" class="customed-form-item" label="" :label-width="0">
                               <i-radio-group v-model="formModel.specialTypeId" v-if="formModel.specialTypeFlag">
                                    <i-radio :label="item.id" :value="item.id" :disabled="false" v-for="item in selectListObj.specialTypesList" :key="item.id">
                                        <span>{{item.name}}({{item.code}})</span>
                                    </i-radio>
                                </i-radio-group>
                                <i-radio-group v-model="formModel.specialTypeId" v-if="!formModel.specialTypeFlag">
                                    <i-radio :label="item.id" :value="item.id" :disabled="false" v-for="(item, i) in customerSpecailList" :key="'specialTypeId-option-' + i">
                                        <span>{{item.name}}({{item.code}})</span>
                                    </i-radio>
                                </i-radio-group>
                            </i-form-item>
                        </i-col>
                        <i-col span="24" v-if="specialIdsList && specialIdsList.length && formModel.specialTypeFlag">
                            <i-form-item prop="255555" class="customed-form-item" label="" :label-width="0">
                                <i-checkbox-group v-model="formModel.specialIds" @on-change="specialIdsChage">
                                    <i-checkbox :label="item.id" :value="item.id" :disabled="false" v-for="item in specialIdsList" :key="'specialIds-option-1-' + item.id">
                                        <span>{{item.specialNum}}{{item.name}}</span>
                                        <!-- -权重占比{{item.weight}} -->
                                    </i-checkbox>
                                </i-checkbox-group>
                            </i-form-item>
                        </i-col>
                        <i-col span="24" v-if="specialIdsList && specialIdsList.length && !formModel.specialTypeFlag">
                            <i-form-item prop="255555" class="customed-form-item" label="" :label-width="0">
                                <i-checkbox-group v-model="formModel.specialIds" @on-change="specialIdsChage">
                                    <i-checkbox :label="item.id" :value="item.id" :disabled="false" v-for="(item, i) in specialIdsList" :key="'specialIds-option-2-' + i">
                                        <span>{{item.specialNum}}{{item.name}}</span>
                                        <!-- -权重占比{{item.weight}} -->
                                    </i-checkbox>
                                </i-checkbox-group>
                            </i-form-item>
                        </i-col>
                    </i-row>
                    
                </i-form>

                <i-form v-show="stepIndex === 2" class="customed-form" ref="form2" :model="formModel" :rules="rules">
                    <h3 class="item-title">代建单位</h3>
                    <i-row type="flex" justify="start" v-for="item in (formModel.detail && formModel.detail.buildUnit || [])" :key="'buildUnit' + item.id">
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="单位名称：">{{ item.name ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="负责人：">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                        </i-col>
                    </i-row>

                    <!-- <h3 class="item-title">设计单位</h3>
                    <i-row type="flex" justify="start" v-for="item in (formModel.detail && formModel.detail.design || [])" :key="'design' + item.id">
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="单位名称：">{{ item.name ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="负责人：">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                        </i-col>
                    </i-row> -->

                    <h3 class="item-title">监理单位</h3>
                    <i-row type="flex" justify="start" v-for="item in (formModel.detail && formModel.detail.supervising || [])" :key="'supervising' + item.id">
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="单位名称：">{{ item.name ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="项目经理：">{{ item.engineer ||" - " }}（{{item.directorPhone ||" - "}}）</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="安全总监/经理/主任：">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="人员数：">{{ item.personNumber ||" - " }}</i-form-item>
                        </i-col>
                    </i-row>

                    <h3 class="item-title">施工单位</h3>
                    <i-row type="flex" justify="start" v-for="item in (formModel.detail && formModel.detail.construction || [])" :key="'construction' + item.id">
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="单位名称：">{{ item.constructionName ||" - " }}</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="项目总监：">{{ item.manager ||" - " }}（{{item.managerPhone ||" - "}}）</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="安全总监：">{{ item.charger ||" - " }}（{{item.principalPhone ||" - "}}）</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="12">
                            <i-form-item class="u-form-item" :label-width="120" label="人员数：">{{ item.personNumber ||" - " }}</i-form-item>
                        </i-col>
                    </i-row>
                </i-form>

            </div>
        </template>
        <template v-slot:footer>
            <i-button v-if="stepIndex < 2" type="info" @click="onOps('cancel')">取消</i-button>
            <i-button v-if="stepIndex <= 2 && stepIndex >0" type="info" @click="onOps('previous')">上一步</i-button>
            <i-button v-if="stepIndex < 2" type="primary" @click="onOps('next')">下一步</i-button>
            <i-button v-if="stepIndex === 2" :loading="loading" type="primary" @click="onOps('submit')">提交</i-button>
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

    /**
     * 新增接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected insert: Function;

    /**
     * 修改接口
     * @protected
     * @config
     */
    @config({required: true, type: Function})
    protected update: Function;

    @config({required: true, default: () => ({})})
    protected selectListObj: any;

    /**
     * 体系列表 - 项目列表
     * @protected
     * @config
     */
    protected specialIdsList: Array<any> = [];
    protected projectList: Array<any> = [];

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
    protected formModel: any =
    {
        detail:
        {
            constructionStageName: "",
            streetCommunity: "",
            projectAddress: "",
            projectTypeName: ""
            // constructionStageName: "",
            // constructionStageName: "",
        },
        priority: 1,
        timeMark: 0
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        consultNum: [{required: true, message: "请输入诊治编号", pattern: patterns["character"]}],
        localeDepartment: [{required: true, message: "请输入现场科室"}],
        projectId: [{required: true, message: "请选择项目"}],
        consultTime: [{required: true, message: "请选择诊治计划日期"}],
        consultType: [{required: true, message: "请选择诊治类型"}],
        captain: [{required: true, message: "请选择队长"}],
        consultGroup: [{required: true, message: "请选择诊治组名"}],
        crews: [{required: true, message: "请选择组员人"}],
        // customerId: [{required: true, message: "请选择客户名称"}],
        contractStartDate: [{required: true, message: "请选择合同期限"}],
        // budget: [{required: true, message: "请输入项目预算"}],
        budget:
        [
            {
                validator:
                (rule, value, callback) =>
                {
                    if(patterns["positive.integer.zero.two.point"].test(value))
                    {
                        callback();
                    }else
                    {
                        callback(new Error("请输入正确的数值"));
                    }
                }
            }
        ],
        jobsRequiredCount:
        [
            {
                validator:
                (rule, value, callback) =>
                {
                    
                    if(patterns["positive.integer.zero"].test(value))
                    {
                        callback();
                        
                    }
                    else
                    {
                        callback(new Error("请输入正确人数"));
                    }
                
                }
            }
            
        ]
    };

    /**
     * 步骤条进度
     * @public
     */
    protected stepIndex: number = 0;

    /**
     * 打开方法
     * @public
     */
    public async open(data?: any)
    {
        this.stepIndex = 0;
        this._curdModal.open();
        
        if (data && data.id)
        {
            
            // 更新
            this.title = "编辑计划";
            
            this.onReset(data);

            this.onchangeCustomer();
        }
        else
        {
            // 新增
            this.title = "新增计划";
            this.onReset({});
        }

    }

    /**
     * 重置数据
     * @public
     */
    protected onReset(data?)
    {

        this.formModel =
        {
            ...data,
            detail: data.projectManager ? data.projectManager : {
                constructionStageName: "",
                streetCommunity: "",
                projectAddress: "",
                projectTypeName: ""
                // constructionStageName: "",
                // constructionStageName: "",
            },

            priority: 1,
            timeMark: 0,
            customerId: data.projectManager ? data.projectManager.customerId : "",
            crews: data.crewsCustomers && data.crewsCustomers.map(item => item.id) || undefined,
            specialTypeFlag: data.specialTypeFlag ? 1 : 0 || 1,
            specialIds: data.specialIds && data.specialIds.split(",") && data.specialIds.split(",").map(item => Number(item)) || [],
            specialTypeId: data.specialTypeId || undefined
        };

    }

    /**
     * 业主方更改 触发
     * @protected
     * 
     */
    protected async onchangeCustomer(value?)
    {
        if(value)
        {
            this.formModel.projectId = "";
        }
        
        let projectList = await this.projectService.listDetails({customerId: value});
        this.projectList = projectList.content; // 项目列表
        console.log(projectList);
        
    }

    /**
     * 单选按钮选择事件 -- 标准/客户 -- 体系
     * @protected
     * 
     */
    protected async specialTypeFlagChage(value,label)
    {
        if(!value)
        {
            this.customerSpecailList = await this.specialTypeService.getSpecialTypeList(this.formModel.detail.customerId);
        }
    }

    /**
     * 单选按钮选择事件 -- 体系类型 -- 获得体系列表
     * @protected
     * 
     */
    @watch("formModel.specialTypeId",{immediate: true, deep: true})
    protected async specialTypeChage(value,label)
    {
        this.specialIdsList = await this.specialService.getSpecialListByParentId(value);
    }

    /**
     * 单选按钮选择事件
     * @protected
     * 
     */
    protected async specialIdsChage(value,label)
    {
        // this.selectListObj.specialIdsList = await this.specialService.getSpecialListByParentId(value);
        //    console.log(value,content);
    }

    /**
     * 触发项目选项更改数据
     * @public
     */
    protected projectItemChange(value)
    {
        let data = JSON.parse(JSON.stringify(this.projectList));
        this.formModel.detail = data.filter(item => item.id === value)[0];
        this.formModel.projectId = value;
        
    }

    /**
     * 接口数据 重新处理
     * @public
     */
    protected resolveRequestParams(param: any, paramExt?: any): any
    {
        return {
            data: {
                param: Object.assign({}, {
                    projectId: param.projectId,
                    // beginTime: param.beginTime && dayjs(param.beginTime).format("YYYY-MM-DD"),
                    captain: param.captain,
                    consultGroup: param.consultGroup,
                    consultNum: param.consultNum,
                    consultTime: param.consultTime && dayjs(param.consultTime).format("YYYY-MM-DD"),
                    consultType: param.consultType,
                    crews: param.crews.join(","),
                    // endTime: param.endTime && dayjs(param.endTime).format("YYYY-MM-DD"),
                    id: param.id,
                    localeDepartment: param.localeDepartment,
                    postponeId: param.postponeId,
                    priority: param.priority,
                    specialIds: param.specialIds.join() || "",
                    specialTypeFlag: !!param.specialTypeFlag,
                    specialTypeId: param.specialTypeId,
                    timeMark: !!param.timeMark
                }),
                paramExt: Object.assign({}, {})
            }
        };
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
                    // onValidateFailed();
                    return;
                }
                if (!this.formModel.specialIds || !this.formModel.specialIds.length)
                {
                    this.$message.warning("请选择体系");
                    // onValidateFailed();
                    return;
                }
                try
                {
                    this.loading = true;
                    if (this.formModel.id)
                    {
                        // 更新
                        await this.update(this.resolveRequestParams(this.formModel));
                        this.$message.success("编辑成功");
                    }
                    else
                    {
                        // 新增
                        await this.insert(this.resolveRequestParams(this.formModel));
                        this.$message.success("新增成功");
                        
                    }
                    this.$emit("on-refresh", this.formModel);
                    this.onClosed();
                    this._curdModal.close();
                }
                catch(err)
                {
                    this.loading = false;
                    this.$message.error(err.msg || err.message);
                    // onValidateFailed();
                }
                
            });
        }
        else if (type === "next")
        {
            if(!this.formModel.projectId)
            {
                this.$message.warning("请选择项目");
                return;
            }
            this._form.validate(async valid =>
            {
                if (valid)
                {
                    // onValidateFailed();
                    this.stepIndex = this.stepIndex + 1;
                    return;
                }else
                {
                    // onValidateFailed();
                }
                
            });
            
        } else if (type === "previous")
        {
            this.stepIndex = this.stepIndex - 1;
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
        if(this.stepIndex === 0)
        {
            return this.$refs["form"] as any;
        }
        if(this.stepIndex === 1)
        {
            return this.$refs["form1"] as any;
        }
        if(this.stepIndex === 2)
        {
            return this.$refs["form2"] as any;
        }
        if(this.stepIndex === 3)
        {
            return this.$refs["form3"] as any;
        }
        
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
    
    /**
     * 确定地图点位的选择。
     * @protected
     * @return void
     */
    protected onMapConfirm(payload: any): void
    {
        if (payload && payload.location && payload.position)
        {
            this.formModel.longitude = payload.position[0];
            this.formModel.latitude = payload.position[1];
        }
        else
        {
            this.formModel.longitude = this.formModel.latitude = "0";
        }
    }
    
    /**
     * 获取设备经纬度。
     * @member
     * @return Array<string>
     */
    protected get defaultPoint(): Array<string>
    {
        const point = this.formModel.latitude && this.formModel.longitude ? [this.formModel.longitude, this.formModel.latitude] : [];

        return point;
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