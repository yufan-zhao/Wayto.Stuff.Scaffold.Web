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
            <div class="project-modal">
                <div class="steps">
                    <div class="step" :class="{active: stepIndex === 0, finished: stepIndex > 0}">
                        <span class="dot">1</span>
                        <span class="label">项目信息</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 1, finished: stepIndex > 1}">
                        <span class="dot">2</span>
                        <span class="label">相关单位</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 2, finished: stepIndex > 2}">
                        <span class="dot">3</span>
                        <span class="label">项目工机具</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 3, finished: stepIndex > 3}">
                        <span class="dot">4</span>
                        <span class="label">产值内容</span>
                        <span class="line"></span>
                    </div>
                </div>
                <i-form v-show="stepIndex === 0" class="customed-form" ref="form" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="12">
                            <i-form-item prop="customerId" class="customed-form-item" label="业主方" :label-width="120">
                                <i-select  v-model="formModel.customerId" maxlength="20">
                                    <i-option v-for="item in selectListObj.customerList" :key="item.id" :value="item.id">{{item.deptName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="projectName" class="customed-form-item" label="项目名称" :label-width="120">
                                <i-input v-model="formModel.projectName" placeholder="请输入项目名称" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item class="customed-form-item" label="项目对接人:" :label-width="130">
                                {{formModel.responsible}}
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item class="customed-form-item" label="对接人电话:" :label-width="130">
                                {{formModel.mobilePhone}}
                            </i-form-item>
                        </i-col>
                        
                        <!-- <i-col span="24"> -->
                            <!-- <i-form-item prop="" class="customed-form-item" label="单位编号" :label-width="120"> -->
                                
                                <!-- <i-input v-model="formModel.projectCode" placeholder="请输入项目编号" maxlength="255" style="width:87%"> -->
                                    <!-- <template #prefix> -->
                                       <!-- <span class="dsib mt5 ml10" style="" slot="prefix">{{formModel.customerNum}} </span> -->
                                    <!-- </template> -->
                                    
                                <!-- </i-input> -->
                            <!-- </i-form-item> -->
                        <!-- </i-col> -->
                        
                        <!-- <i-col span="12">
                            <i-form-item prop="location" class="customed-form-item" label="项目地址" :label-width="120">
                                <u-map-position v-model="formModel.location" :position="defaultPoint" @on-change="onMapConfirm"></u-map-position>
                            </i-form-item>
                        </i-col> -->
                        <i-col span="12">
                            <i-form-item prop="projectTypeId" class="customed-form-item" label="项目类型" :label-width="120">
                                <i-select  v-model="formModel.projectTypeId" maxlength="20" @on-change="changeProjectTypeId">
                                    <i-option v-for="item in selectListObj.projectTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="constructionStageId" class="customed-form-item" label="施工阶段" :label-width="120">
                                <i-select  v-model="formModel.constructionStageId" maxlength="20" :disabled="!formModel.projectTypeId">
                                    <i-option v-for="item in constructionStageList" :key="item.id" :value="item.id">{{item.phaseName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="floorage" class="customed-form-item" label="面积/长度" :label-width="120">
                                <i-select style="width: 35%" v-model="formModel.meterDescription">
                                    <i-option :value="0">建筑面积</i-option>
                                    <i-option :value="1">长度</i-option>
                                </i-select>
                                <i-input style="width: 65%; float: right" v-model="formModel.floorage" number>
                                    <span slot="append">{{formModel.meterDescription === 0 ? "m²" : "km"}}</span>
                                </i-input>
                            </i-form-item>
                             <!-- <i-form-item prop="floorage" class="customed-form-item" :label="formModel.projectTypeId === 136 ? '建筑面积' : ''" :label-width="120">
                               <i-input v-model="formModel.floorage" number>
                                    <span slot="append">M²</span>
                                </i-input>
                            </i-form-item> -->
                        </i-col>
                        
                        <i-col span="12">
                            <i-form-item prop="beginDate" class="customed-form-item" label="开工日期" :label-width="120">
                                <i-date-picker type="date" v-model="formModel.beginDate" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></i-date-picker>
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="completionDate" class="customed-form-item" label="计划竣工日期" :label-width="120">
                                <i-date-picker type="date" v-model="formModel.completionDate" format="yyyy-MM-dd"  placeholder="请选择" style="width: 100%"></i-date-picker>
                            </i-form-item>
                        </i-col>
                        
                        <i-col span="12">
                            <i-form-item prop="userGroupIds" class="customed-form-item" label="责任部门" :label-width="120">
                                <i-cascader :data="selectListObj.orgRree" v-model="formModel.userGroupIds" change-on-select filterable @on-change="userGroupValueChange"></i-cascader>

                                <!-- <i-select  v-model="formModel.responsibleDepId" maxlength="20">
                                    <i-option v-for="item in [1,2,3,4]" :key="item" :value="item">{{item}}</i-option>
                                </i-select>  -->
                            </i-form-item>
                        </i-col>
                        <i-col span="24">
                            <i-form-item prop="projectAddress" class="customed-form-item" label="项目地址" :label-width="120">
                                <u-map-position v-model="formModel.projectAddress" :position="defaultPoint" @on-change="onMapConfirm"></u-map-position>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="areaIds" class="customed-form-item" label="所属街道/社区" :label-width="120">
                                <i-cascader :data="selectListObj.areaList" v-model="formModel.areaIds" change-on-select filterable @on-change="userAreaListChange"></i-cascader>

                                <!-- <i-select  v-model="formModel.communityId" maxlength="20">
                                    <i-option v-for="item in selectListObj.areaList" :key="item" :value="item">{{item}}</i-option>
                                </i-select>  -->
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="contractPeriod" class="customed-form-item" label="合同期限" :label-width="120">
                                <i-input v-model="formModel.contractPeriod" number>
                                    <span slot="append">天</span>
                                </i-input>
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="contractSum" class="customed-form-item" label="项目合同额" :label-width="120">
                                <i-input v-model="formModel.contractSum" number>
                                    <span slot="append">亿元</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="localeDepartment" class="customed-form-item" label="现场科室" :label-width="120">
                               <i-input v-model="formModel.localeDepartment"></i-input>
                            </i-form-item>
                        </i-col>

                        <i-col span="24">
                            <i-form-item prop="projectOverview" class="customed-form-item" label="概述" :label-width="120">
                                <i-input v-model="formModel.projectOverview" type="textarea" :maxlength="500" :autosize="{minRows: 2}" placeholder="请输入备注" />
                            </i-form-item>
                        </i-col>
                        

                        <!-- <i-col span="12">
                            <i-form-item prop="userNameList" class="customed-form-item" label="跟进人" :label-width="120">--> 
                                <!-- <i-select v-model="formModel.establishUserId">
                                    <i-option v-for="item in users" :key="item.id" :value="item.id">{{ item.name }}</i-option>
                                </i-select> -->
                                <!-- <div></div> -->
                                <!-- <div class="userIdList" @click="onSelectEstablishUser('userIdList', userList)" >
                                    <i-tag v-for="(item , index) in userNameList" :key="index" @click.native="onSelectEstablishUser('userIdList', userList)">{{item}}</i-tag>
                                </div> -->
                                <!-- <i-input @on-focus="onSelectEstablishUser('userIdList')" placeholder="项目跟进人"/> -->
                            <!-- </i-form-item>
                        </i-col> --> 
                    </i-row>
                </i-form>
                <i-form v-show="stepIndex === 1" class="customed-form" ref="form1" :model="formModel" :rules="rules">
                    <h3 class="item-title">代建单位
                        <!-- <span class="font-error">*</span>  -->
                         <i-button type="info" class="fr" @click="buildUnitAdd">增加</i-button>
                    </h3>
                    <i-row type="flex" justify="start" class="item-content-1 mb10" v-for="(item,i) in formModel.buildUnit" :key="'buildUnit' + i">
                        <i-icon class="icon" type="ios-close" v-if="i > 0" @click="deldataLength('buildUnit',i)"/>
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].name'" class="customed-form-item" label="代建单位名称" :label-width="120">
                                <i-input v-model="item.name" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].person'" class="customed-form-item" label="项目负责人" :label-width="120">
                                <i-input v-model="item.person" placeholder="请输入" maxLength="25"/>
                            </i-form-item>
                        </i-col>
                        
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].phone'" class="customed-form-item" label="项目负责人电话" :label-width="120">
                                <i-input v-model="item.phone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].department'" class="customed-form-item" label="负责人科室" :label-width="120">
                                <i-input v-model="item.department" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].securityAdminPerson'" class="customed-form-item" label="安全管理员" :label-width="120">
                                <i-input v-model="item.securityAdminPerson" placeholder="请输入" maxLength="25"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'buildUnit[' + i + '].securityAdminPhone'" class="customed-form-item" label="安全管理员电话" :label-width="120">
                                <i-input v-model="item.securityAdminPhone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                    </i-row>

                    <!-- <h3 class="item-title">设计单位<span class="font-error">*</span> <i-button type="info" class="fr" @click="designAdd">增加</i-button></h3>
                    <i-row type="flex" justify="start" class="item-content-1 mb10" v-for="(item,i) in formModel.design" :key="'design' + i">
                        <i-icon class="icon" type="ios-close"  v-if="i > 0" @click="deldataLength('design',i)"/>
                        <i-col span="24">
                            <i-form-item :prop="'design[' + i + '].name'" class="customed-form-item" label="设计单位名称" :label-width="120">
                                <i-input v-model="item.name" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'design[' + i + '].person'" class="customed-form-item" label="负责人" :label-width="120">
                               
                                <i-input v-model="item.person" placeholder="请输入" maxLength="25"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'design[' + i + '].phone'" class="customed-form-item" label="负责人电话" :label-width="120">
                                <i-input v-model="item.phone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                    </i-row> -->
                    
                    <h3 class="item-title">
                        施工单位
                        <!-- <span class="font-error">*</span> -->
                        <i-button type="info" class="fr" @click="constructionAdd">增加</i-button>
                    </h3>
                    <i-row type="flex" justify="start" class="item-content-1 mb10" v-for="(item,i) in formModel.construction" :key="'construction' + i">
                        <i-icon class="icon" type="ios-close"  v-if="i > 0" @click="deldataLength('construction',i)"/>
                        <i-col span="21">
                            <i-form-item :prop="'construction[' + i + '].constructionName'"  class="customed-form-item" label="施工单位名称" :label-width="120" v-if="item.changeCunId">
                                <i-input v-model="item.constructionName" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                            <i-form-item :prop="'construction[' + i + '].constructionId'"  class="customed-form-item" label="施工单位名称" :label-width="120" v-if="!item.changeCunId || item.constructionId">
                                <i-select  v-model="item.constructionId" maxlength="20"  placeholder="请选择" @on-change="changeConstructionId(item.constructionId,i)">
                                    <i-option v-for="item in selectListObj.constructionListAdd" :key="item.id" :value="item.id">{{item.constructionName}}</i-option>
                                </i-select> 
                            </i-form-item>
                            
                        </i-col>
                        <i-col span="3">
                           <i-button type="info" @click="changeCunId(i)">{{item.changeCunId ? "选择" : "输入"}}</i-button>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'construction[' + i + '].manager'"  class="customed-form-item" label="项目经理" :label-width="120">
                                <i-input v-model="item.manager" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'construction[' + i + '].managerPhone'"  class="customed-form-item" label="电话" :label-width="120">
                                <i-input v-model="item.managerPhone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                         <i-col span="12">
                            <i-form-item :prop="'construction[' + i + '].charger'"  class="customed-form-item" label="安全总监/经理" :label-width="120">
                                <i-input v-model="item.charger" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'construction[' + i + '].principalPhone'"  class="customed-form-item" label="电话" :label-width="120">
                                <i-input v-model="item.principalPhone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'construction[' + i + '].personNumber'"  class="customed-form-item" label="人员数" :label-width="120">
                                <i-input v-model="item.personNumber" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                    </i-row>

                    <h3 class="item-title">
                        监理单位
                        <!-- <span class="font-error">*</span>  -->
                        <i-button type="info" class="fr" @click="supervisingAdd">增加</i-button>
                    </h3>
                    
                    <i-row type="flex" justify="start" class="item-content-1 mb10" v-for="(item,i) in formModel.supervising" :key="'supervising'+i">
                        <i-icon class="icon" type="ios-close"  v-if="i > 0" @click="deldataLength('supervising',i)"/>
                        <i-col span="24">
                            <i-form-item :prop="'supervising[' + i + '].name'" class="customed-form-item" label="监理单位名称" :label-width="140">
                                <i-input v-model="item.name" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="16">
                            <i-form-item :prop="'supervising[' + i + '].engineer'" class="customed-form-item" label="项目总监" :label-width="140">
                                <i-input v-model="item.engineer" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="8">
                            <i-form-item :prop="'supervising[' + i + '].directorPhone'" class="customed-form-item" label="电话" :label-width="60">
                                <i-input v-model="item.directorPhone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                         <i-col span="16">
                            <i-form-item :prop="'supervising[' + i + '].person'" class="customed-form-item" label="安全专监" :label-width="140">
                                <i-input v-model="item.person" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="8">
                            <i-form-item :prop="'supervising[' + i + '].phone'" class="customed-form-item" label="电话" :label-width="60">
                                <i-input v-model="item.phone" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'supervising[' + i + '].personNumber'" class="customed-form-item" label="人员数" :label-width="140">
                                <i-input v-model="item.personNumber" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                    </i-row>

                </i-form>

                <i-form v-show="stepIndex === 2" class="customed-form" ref="form2" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="24">
                            <i-form-item prop="fileIdList" class="customed-form-item " label="" :label-width="0">
                                <section class="">
                                    <h3 class="item-title mr20">项目部照片 </h3>
                                    <u-upload-file-list
                                        v-model="formModel.fileIdList"
                                        :maxLength="1"
                                    >
                                    </u-upload-file-list>
                                </section>
                               
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <h3 class="item-title">项目工机具 <i-button type="info" class="fr" @click="toolsAdd">增加</i-button></h3>
                    <i-row type="flex" justify="start"  class="item-content-1 mb10" v-for="(item,i) in formModel.tools" :key="i">
                        <i-icon class="icon" type="ios-close"  @click="deldataLength('tools',i)"/>
                        <i-col span="12">
                            <i-form-item :prop="'tools[' + i + '].toolsName'" class="customed-form-item" label="工机具名称" :label-width="120">
                                <i-input v-model="item.toolsName" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item :prop="'tools[' + i + '].toolsAmount'" class="customed-form-item" label="数量" :label-width="120">
                                <i-input v-model="item.toolsAmount" placeholder="请输入" maxlength="40"/>
                            </i-form-item>
                        </i-col>
                    </i-row>
                </i-form>

                <i-form v-show="stepIndex === 3" class="customed-form" ref="form3" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="12">
                            <i-form-item prop="outputValue.estimateOutput" class="customed-form-item" label="预估产值" :label-width="120">
                                <i-input v-model="formModel.outputValue.estimateOutput" number placeholder="请输入" >
                                    <span slot="append">元</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="outputValue.actualOutput" class="customed-form-item" label="实际产值" :label-width="120">
                               <i-input v-model="formModel.outputValue.actualOutput" number placeholder="请输入" >
                                    <span slot="append">元</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="outputValue.projectQuantity" class="customed-form-item" label="项目量" :label-width="120">
                                <!-- <i-input v-model="formModel.outputValue.projectQuantity" placeholder="请输入" maxlength="255"/> -->
                                <i-input v-model="formModel.outputValue.projectQuantity" number placeholder="请输入" >
                                    <span slot="append">个</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                    </i-row>
                </i-form>
            </div>
        </template>
        <template v-slot:footer>
            <i-button type="info" @click="onOps('cancel')">取消</i-button>
            <i-button v-if="stepIndex <= 3 && stepIndex >0" type="info" @click="onOps('previous')">上一步</i-button>
            <i-button v-if="stepIndex < 3" type="primary" @click="onOps('next')">下一步</i-button>
            <i-button v-if="stepIndex === 3" :loading="loading" type="primary" @click="onOps('submit')">提交</i-button>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import dayjs from "dayjs";
import patterns from "src/common/utils/patterns";

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
    // @service("CustomerContactsService")
    // protected customerContactsService: Function = function() {};

    // @service("UserService")
    // protected userService: Function = function() {};

    // @service("UserExtService")
    // protected userExtService: Function = function() {};

    // @service("CustomerService")
    // protected customerService: Function = function() {};

    protected buildUnit: any = [];

    protected construction: any = [];
    
    protected design: any = [];
   
    protected supervising: any = [];

    protected tools: any = [];

    protected userGroupIds: Array<any> = [];

    protected constructionStageList: Array<any> = [];

    /**
     * 选择项所需要的数据
     * @protected
     * @config
     */
    @config({required: true, type: Object})
    protected selectListObj: any;

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
        beginDate: "",
        completionDate: "",
        fileIdList: [],
        outputValue:
        {
            actualOutput: undefined,
            createUserId: undefined,
            estimateOutput: undefined,
            id: undefined,
            projectId: undefined,
            projectQuantity: undefined,
            updateUserId: undefined,
            userGroupId: undefined
        },
        buildUnit: [],
        construction: [],
        design: [],
        supervising: [],
        tools: [],
        meterDescription: 0
    };

    /**
     * 客户信息
     * @protected
     */
    protected customers: any = [];

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        projectName: [{required: true, message: "请输入项目名称"}],
        localeDepartment: [{required: true, message: "请输入现场科室"}],
        // projectCode: [{required: true, message: "请输入正确的项目编号", pattern: patterns["character"]}],
        projectAddress: [{required: true, message: "请选择项目地址"}],
        projectTypeId: [{required: true, message: "请选择项目类型"}],
        // beginDate: [{required: true, message: "请选择开工日期"}],
        // completionDate: [{required: true, message: "请选择计划竣工日期"}],
        constructionStageId: [{required: true, message: "请选择施工阶段"}],
        userGroupIds: [{required: true, message: "请选择责任部门"}],
        areaIds: [{required: true, message: "请选择所属街道/社区"}],
        customerId: [{required: true, message: "请选择业主方"}],
        // fileIdList: [{required: true, message: "请选择图片"}],
        // commonFileId: [{required: true, message: "请选择照片"}],
        floorage:
        [
            {
                required: false,
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
        contractSum:
        [
            {
                required: false,
                validator:
                (rule, value, callback) =>
                {
                    if(patterns["positive.integer.zero.two.point"].test(value))
                    {
                        callback();
                    }else
                    {
                        callback(new Error("请输入正确的金额"));
                    }
                }
            }
        ],
        contractPeriod:
        [
            {
                required: false,
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
        
        // "outputValue.estimateOutput": [{required: true, validator: (rule, value, callback) =>
        // {
        //     if(patterns["positive.integer.zero.two.point"].test(value))
        //     {
        //         callback();
        //     }else
        //     {
        //         callback(new Error("请输入正确的数值"));
        //     }
        // }}],
        // "outputValue.actualOutput": [{required: true, validator: (rule, value, callback) =>
        // {
        //     if(patterns["positive.integer.zero.two.point"].test(value))
        //     {
        //         callback();
        //     }else
        //     {
        //         callback(new Error("请输入正确的数值"));
        //     }
        // }}],
        // "outputValue.projectQuantity": [
        //     {
        //         required: true,
        //         validator:
        //         (rule, value, callback) =>
        //         {
        //             if(patterns["positive.integer.zero.two.point"].test(value))
        //             {
        //                 callback();
        //             }else
        //             {
        //                 callback(new Error("请输入正确的数值"));
        //             }
        //         }
        //     }
        // ],

        "buildUnit[0].name": [{required: false, message: "请输入代建单位名称	"}],
        // "buildUnit[0].department": [{required: true, message: "请输入负责人科室	"}],
        "buildUnit[0].person": [{required: false, message: "请输入负责人"}],
        "buildUnit[0].phone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}],
        "buildUnit[0].securityAdminPhone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}],

        "design[0].name": [{required: false, message: "请输入设计单位名称"}],
        "design[0].phone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}],
        "design[0].person": [{required: false, message: "请输入负责人"}],

        "construction[0].charger": [{required: false, message: "请输入项目施工单位负责人"}],
        "construction[0].constructionId": [{required: true, message: "请选择施工单位"}],
        "construction[0].constructionName": [{required: true, message: "请输入项目施工单位名称"}],
        // "construction[0].manager": [{required: true, message: "请输入项目经理"}],
        "construction[0].managerPhone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}],
        // "construction[0].personNumber": [{required: true, validator: (rule, value, callback) =>
        // {
        //     if(patterns["positive.integer.zero"].test(value))
        //     {
        //         callback();
        //     }else
        //     {
        //         callback(new Error("请输入正确的数值"));
        //     }
        // }}],
        "construction[0].principalPhone": [{required: false, message: "请输入正确的电话号码	", pattern: patterns["telephoneAndMobile"]}],

        "supervising[0].directorPhone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}],
        // "supervising[0].engineer": [{required: true, message: "请输入项目经理"}],
        "supervising[0].name": [{required: true, message: "请输入单位名称"}],
        "supervising[0].person": [{required: false, message: "请输入负责人"}],
        // "supervising[0].personNumber":
        // [
        //     {
        //         required: true,
        //         validator:
        //         (rule, value, callback) =>
        //         {
        //             if(patterns["positive.integer.zero"].test(value))
        //             {
        //                 callback();
        //             }else
        //             {
        //                 callback(new Error("请输入正确的数值"));
        //             }
        //         }
        //     }
        // ],
        "supervising[0].phone": [{required: false, message: "请输入正确的电话号码", pattern: patterns["telephoneAndMobile"]}]

        // "tools[0].toolsAmount":
        // [
        //     {
        //         required: false,
        //         validator:
        //         (rule, value, callback) =>
        //         {
        //             if(patterns["positive.integer.zero"].test(value))
        //             {
        //                 callback();
        //             }else
        //             {
        //                 callback(new Error("请输入正确的数值"));
        //             }
        //         }
        //     }
        // ],
        // "tools[0].toolsName": [{required: false, message: "请输入工机具名称"}]
        
    };

    protected stepIndex: number = 0;

    /**
     * 打开方法
     * @public
     */
    public async open(data: any, stepIndex)
    {
        this.stepIndex = 0;
        this._curdModal.open();
        this.stepIndex = stepIndex;
        if (data && data.id)
        {
            // 更新
            this.title = "编辑项目";
            this.onReset(data);
            this.changeProjectTypeId(data.projectTypeId);
        }
        else
        {
            // 新增
            this.title = "新增项目";
            this.onReset({});
        }

    }
    
    protected onReset(data)
    {
        //  data.communityIds.split(",")
        let target =
        {
            meterDescription: data.meterDescription || 0,
            beginDate: data.beginDate || "",
            completionDate: data.completionDate || "",
            commonFileId: data.commonFileId || undefined,
            fileIdList: data.commonFileId ? [{id: data.commonFileId, filePath: data.projectFileName}] : [],
            communityId: data.communityId || undefined,
            areaIds: data.communityIds ? data.communityIds.split(",").map(item => Number(item)) : undefined,
            constructionStageId: data.constructionStageId || undefined,
            contractPeriod: data.contractPeriod || 0,
            contractSum: data.contractSum || 0,
            localeDepartment: data.localeDepartment || undefined,
            customerId: data.customerId || undefined,
            floorage: data.floorage || 0,
            id: data.id || undefined,
            latitude: data.latitude || undefined,
            longitude: data.longitude || undefined,
            priorityLevel: data.priorityLevel || 1,
            projectAddress: data.projectAddress || undefined,
            projectCode: data.projectCode || undefined,
            projectName: data.projectName || undefined,
            customerNum: data.customerNum || undefined,
            projectOverview: data.projectOverview || undefined,
            projectTypeId: data.projectTypeId || undefined,
            responsibleDepId: data.responsibleDepId || undefined,
            userGroupIds: data.id ? [data.responsibleDepId] : [],
            status: 0,
            userGroupId: data.userGroupId || undefined,
            outputValue: data.outputValue && data.outputValue.id ?
            {
               actualOutput: data.outputValue.actualOutput || undefined,
               createUserId: data.outputValue.createUserId || undefined,
               estimateOutput: data.outputValue.estimateOutput || undefined,
               id: data.outputValue.id || undefined,
               projectId: data.outputValue.projectId || undefined,
               projectQuantity: data.outputValue.projectQuantity || undefined,
               updateUserId: data.outputValue.updateUserId || undefined,
               userGroupId: data.outputValue.userGroupId || undefined
            } : {
                actualOutput: undefined,
                createUserId: undefined,
                estimateOutput: undefined,
                id: undefined,
                projectId: undefined,
                projectQuantity: undefined,
                updateUserId: undefined,
                userGroupId: undefined
            } ,
            buildUnit: [],
            construction: [],
            design: [],
            supervising: [],
            tools: []
        };
        
        target.tools = data.tools && data.tools.length ? data.tools : [
        {
            id: undefined,
            projectId: undefined,
            toolsAmount: undefined,
            toolsName: ""
        }];
        target.supervising = data.supervising && data.supervising.length ? data.supervising : [
        {
            constructionId: undefined,
            directorPhone: "",
            engineer: "",
            id: undefined,
            name: "",
            person: "",
            phone: ""
        }];

        target.design = data.design && data.design.length ? data.design : [
        {
            id: undefined,
            name: "",
            person: "",
            phone: ""
        }];
        target.buildUnit = data.buildUnit && data.buildUnit.length ? data.buildUnit : [
        {
            department: "",
            id: undefined,
            name: "",
            securityAdminPerson: "",
            securityAdminPhone: "",
            person: "",
            phone: ""
        }];
        target.construction = data.construction && data.construction.length ? data.construction : [
        {
            charger: "",
            constructionId: undefined,
            constructionName: "",
            id: undefined,
            manager: "",
            managerPhone: "",
            principalPhone: "",
            changeCunId: false
        }];
        console.log(target.construction);
        target.construction.map(item =>
        {
            item.changeCunId = item.constructionId ? false : true;
            return item;
        });
        // target.construction["changeCunId"] = (data.id && data.construction["constructionId"]) ? true : false, 
        this.$set(this, "formModel", target);
    }

    protected toolsAdd()
    {
        this.formModel.tools.push(
        {
            id: undefined,
            toolsAmount: undefined,
            toolsName: ""
        });
        // this.rules[`tools[${this.formModel.tools.length - 1}].toolsAmount`] = [
        // {
        //         required: false,
        //         validator:
        //         (rule, value, callback) =>
        //         {
        //             if(patterns["positive.integer.zero"].test(value))
        //             {
        //                 callback();
        //             }else
        //             {
        //                 callback(new Error("请输入正确的数值"));
        //             }
        //         }
        // }];
        // this.rules[`tools[${this.formModel.tools.length - 1}].toolsName`] = [{ required: false, message: "请输入工机具名称"}];
    }

    protected supervisingAdd()
    {
        this.formModel.supervising.push(
        {
            directorPhone: "",
            engineer: "",
            id: undefined,
            name: "",
            person: "",
            personNumber: 0,
            phone: ""
        });
        // this.rules[`supervising[${this.formModel.tools.length - 1}].directorPhone`] = [{required: true, message: "请输入总监电话", pattern: patterns["mobile"]}];
        // this.rules[`supervising[${this.formModel.tools.length - 1}].engineer`] = [{required: true, message: "请输入项目经理"}];
        this.rules[`supervising[${this.formModel.tools.length - 1}].name`] = [{required: true, message: "请输入单位名称"}];
        this.rules[`supervising[${this.formModel.tools.length - 1}].person`] = [{required: false, message: "请输入负责人"}];
        this.rules[`supervising[${this.formModel.tools.length - 1}].phone`] = [{required: false, message: "请输入负责人电话", pattern: patterns["telephoneAndMobile"]}];
        // this.rules[`supervising[${this.formModel.tools.length - 1}].personNumber`] =
        // [
        //     {
        //         required: true,
        //         validator:
        //         (rule, value, callback) =>
        //         {
        //             if(patterns["positive.integer.zero"].test(value))
        //             {
        //                 callback();
        //             }else
        //             {
        //                 callback(new Error("请输入正确的数值"));
        //             }
        //         }
        //     }
        // ];

    }

    protected designAdd()
    {
        this.formModel.design.push(
        {
            id: undefined,
            name: "",
            person: "",
            phone: ""
        });

        this.rules[`design[${this.formModel.design.length - 1}].name`] = [{required: false, message: "请输入设计单位名称"}];
        this.rules[`design[${this.formModel.design.length - 1}].person`] = [{required: false, message: "请输入负责人"}];
        this.rules[`design[${this.formModel.design.length - 1}].phone`] =  [{required: false, message: "请输入负责人电话", pattern: patterns["mobile"]}];
        
    }

    protected buildUnitAdd()
    {
        this.formModel.buildUnit.push(
        {
            department: "",
            id: undefined,
            name: "",
            securityAdminPerson: "",
            person: "",
            securityAdminPhone: "",
            phone: ""
        });
        
        this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].name`] = [{required: false, message: "请输入代建单位名称"}];
        this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].person`] = [{required: false, message: "请输入负责人"}];
        this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].phone`] = [{required: false, message: "请输入正确的电话号码", pattern: patterns["mobile"]}];
        this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].securityAdminPerson`] = [{required: false, message: "请输入安全管理员名称"}];
        this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].securityAdminPhone`] = [{required: false, message: "请输入正确的电话号码", pattern: patterns["mobile"]}];
        // this.rules[`buildUnit[${this.formModel.buildUnit.length - 1}].department`] = [{required: true, message: "请输入负责人科室	"}];
    }
    
    protected constructionAdd()
    {
        this.formModel.construction.push(
        {
            charger: "",
            constructionId: 0,
            constructionName: "",
            id: undefined,
            manager: "",
            managerPhone: "",
            personNumber: 0,
            changeCunId: false,
            principalPhone: ""
        });
        this.rules[`construction[${this.formModel.design.length - 1}].charger`] = [{required: false, message: "请输入项目施工单位负责人"}];
        this.rules[`construction[${this.formModel.design.length - 1}].constructionId`] = [{required: true, message: "请选择施工单位"}];
        this.rules[`construction[${this.formModel.design.length - 1}].constructionName`] = [{required: true, message: "请输入项目施工单位名称"}];
        // this.rules[`construction[${this.formModel.design.length - 1}].manager`] = [{required: true, message: "请输入项目经理"}];
        // this.rules[`construction[${this.formModel.design.length - 1}].managerPhone`] = [{required: true, message: "请输入项目经理电话", pattern: patterns["mobile"]}];
        this.rules[`construction[${this.formModel.design.length - 1}].principalPhone`] = [{required: false, message: "请输入项目施工单位负责人电话", pattern: patterns["mobile"]}];
        // this.rules[`construction[${this.formModel.design.length - 1}].personNumber`] =
        // [{required: true, validator: (rule, value, callback) =>
        // {
        //     if(patterns["positive.integer.zero"].test(value))
        //     {
        //         callback();
        //     }else
        //     {
        //         callback(new Error("请输入正确的数值"));
        //     }
        // }}];
    }

    protected deldataLength(name,i)
    {
        console.log(this.formModel[name]);

        this.formModel[name].splice(i,1);
        
    }

    /**
     * 选择框选择事件
     * @protected
     * 
     */
    @watch("formModel.customerId",{immediate: true})
    protected async selectChange(value,label)
    {
        if (this.selectListObj.customerList)
        {
            const customer = JSON.parse(JSON.stringify(this.selectListObj.customerList)).find(item => item.id === value);
            this.formModel.responsible = customer && customer.responsible || "";
            this.formModel.mobilePhone = customer && customer.mobilePhone || "";
            this.formModel.customerNum = customer && customer.customerNum || "";
        }
        else
        {
            this.formModel.responsible = "";
            this.formModel.mobilePhone = "";
            this.formModel.customerNum = "";
        }
    }

    protected changeProjectTypeId(val)
    {
        let data = this.selectListObj.projectTypeList.filter(item => item.id === val)[0];
        let items = this.selectListObj.constructionStageList.filter(item => item.projectType === data.typeName);
        
        this.$set(this,"constructionStageList", items);
    }
    
    protected userGroupValueChange(value: any, selectedData: any): void
    {
        this.formModel.responsibleDepId = value[value.length - 1];
    }

    protected userAreaListChange(value: any, selectedData: any): void
    {
        console.log(value,selectedData);
        
        // this.formModel.communityId = value[value.length - 1];
    }

    protected resolveRequestParams(param: any): any
    {
        return {
            data: {
                param: Object.assign({},{
                    beginDate: param.beginDate ? dayjs(param.beginDate).format("YYYY-MM-DD") : undefined,
                    completionDate: param.completionDate ? dayjs(param.completionDate).format("YYYY-MM-DD") : undefined,
                    commonFileId: param.fileIdList && param.fileIdList.length && param.fileIdList[0].id,
                    communityId: param.areaIds[param.areaIds.length - 1],
                    // communityIds: JSON.stringify(param.areaIds),
                    constructionStageId: param.constructionStageId,
                    contractPeriod: param.contractPeriod,
                    contractSum: param.contractSum,
                    localeDepartment: param.localeDepartment,
                    customerId: param.customerId,
                    floorage: param.floorage || 0,
                    latitude: param.latitude,
                    id: param.id || undefined,
                    longitude: param.longitude,
                    priorityLevel: param.priorityLevel,
                    projectAddress: param.projectAddress,
                    projectCode: param.projectCode,
                    projectName: param.projectName,
                    customerNum: param.customerNum,
                    projectOverview: param.projectOverview,
                    projectTypeId: param.projectTypeId,
                    responsibleDepId: param.responsibleDepId,
                    status: param.status,
                    meterDescription: param.meterDescription
                }),
                paramExt: Object.assign({},  {
                    buildUnit: param.buildUnit,
                    construction: param.construction,
                    design: param.design,
                    outputValue: param.outputValue,
                    supervising: param.supervising,
                    tools: param.tools
                })
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
                    onValidateFailed();
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
                    
                    // this.onReset({});
                    this.onClosed();
                    this._curdModal.close();

                }
                catch(err)
                {
                    onValidateFailed();
                    this.loading = false;
                    this.$message.error(err.msg || err.message);
                }
                
            });
        }
        else if (type === "next")
        {
            this._form.validate(async valid =>
            {
                if (valid)
                {
                    // onValidateFailed();
                    console.log(this.formModel);
                    // if(this.stepIndex === 2 && !(this.formModel.fileIdList && this.formModel.fileIdList.length))
                    // {
                    //     this.$message.warning("请选择项目部图片");
                    //     return;
                    // }
                    this.stepIndex = this.stepIndex + 1;
                    return;
                }else
                {
                    // onValidateFailed();
                }
                
            });
            
        } else if (type === "previous")
        {
            this.stepIndex  = this.stepIndex - 1;
        }
        else
        {
            this._curdModal.close();
        }
    }

    protected changeCunId(item)
    {
        this.$set(this.formModel.construction[item], "changeCunId", !this.formModel.construction[item].changeCunId);
        this.$set(this.formModel.construction[item], "constructionId", undefined);
        this.$set(this.formModel.construction[item], "constructionName", undefined);
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

    protected async mounted(): Promise<void>
    {
        // 
    }

    /**
     * 施工单位关联
     * @member
     * @return Array<string>
     */
    protected changeConstructionId(val,item)
    {
        try
        {
            let data = JSON.parse(JSON.stringify(this.selectListObj.constructionListAdd)).filter(i => i.id === val)[0];
            // this.$set(thi)
            this.formModel.construction[item].charger = data.charger;
            this.formModel.construction[item].principalPhone = data.principalPhone;
            this.formModel.construction[item].managerPhone  = data.managerPhone ;
            this.formModel.construction[item].manager  = data.manager;

            this.formModel.supervising[item].name = data.supervisionDept || "";
            this.formModel.supervising[item].engineer = data.engineer || "";
            this.formModel.supervising[item].directorPhone = data.directorPhone || "";
            this.formModel.supervising[item].person = data.safetyName || "";
            this.formModel.supervising[item].phone = data.safetyPhone || "";
        }
        catch(err)
        {
            console.warn("请处理开发异常代码");
        }
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
    background: #f6f8fc;
    border: 1px solid #ECECEC;
    border-radius: 4px;
    position: relative;
    padding: 20px 15px  0px 0;
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
                        width: 75px;
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

/deep/.ivu-input-prefix
{
    width: 90px;
}
/deep/.ivu-input-with-prefix
{
    margin-left: 90px;
}
</style>