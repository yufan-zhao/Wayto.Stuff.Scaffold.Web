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
                        <span class="label">基础信息</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 1, finished: stepIndex > 1}">
                        <span class="dot">2</span>
                        <span class="label">存放信息</span>
                        <span class="line"></span>
                    </div>
                    <div class="step" :class="{active: stepIndex === 1, finished: stepIndex > 2}">
                        <span class="dot">3</span>
                        <span class="label">检定信息</span>
                        <span class="line"></span>
                    </div>
                </div>
                <i-form v-show="stepIndex === 0" class="customed-form" ref="form" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start">
                        <i-col span="24">
                            <i-form-item prop="commonFileId" class="customed-form-item" label="图片" :label-width="120">
                               <u-upload-file-list
                                    v-model="formModel.fileIdList"
                                    :maxLength="9"
                                >
                                </u-upload-file-list>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="toolsNumber" class="customed-form-item" label="编号" :label-width="120">
                                <i-input v-model="formModel.toolsNumber" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="deviceName" class="customed-form-item" label="设备名称" :label-width="120">
                                <i-input v-model="formModel.deviceName" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="toolType" class="customed-form-item" label="工具类型" :label-width="120">
                                <i-select  v-model="formModel.toolType" maxlength="20">
                                    <i-option v-for="item in selectListObj.toolsTypeList" :key="item.id" :value="item.id">{{item.typeName}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="specifications" class="customed-form-item" label="规格型号" :label-width="120">
                                <i-input v-model="formModel.specifications" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="toolsLevel" class="customed-form-item" label="设备等级" :label-width="120">
                                <i-input v-model="formModel.toolsLevel" number>
                                    <span slot="append">级</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="factoryNo" class="customed-form-item" label="出厂编号" :label-width="120">
                                <i-input v-model="formModel.factoryNo" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="mileage" class="customed-form-item" label="里程" :label-width="120">
                                <i-input v-model="formModel.mileage" number>
                                    <span slot="append">km</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="deviceWeight" class="customed-form-item" label="设备重量" :label-width="120">
                                <i-input v-model="formModel.deviceWeight" number>
                                    <span slot="append">kg</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="accuracy" class="customed-form-item" label="精度" :label-width="120">
                                <i-input v-model="formModel.accuracy" number>
                                    <span slot="append">%</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="deviceSize" class="customed-form-item" label="设备尺寸" :label-width="120">
                                <i-input v-model="formModel.deviceSize" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="voltageLevel" class="customed-form-item" label="电压等级" :label-width="120">
                                <i-input v-model="formModel.voltageLevel" number>
                                    <!-- <span slot="append">kg</span> -->
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="power" class="customed-form-item" label="功率" :label-width="120">
                                <i-input v-model="formModel.power" number>
                                    <span slot="append">FV</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="manufacturer" class="customed-form-item" label="生产厂家" :label-width="120">
                                <i-input v-model="formModel.manufacturer" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="manufacturerCountry" class="customed-form-item" label="生产厂家国别" :label-width="120">
                                <i-input v-model="formModel.manufacturerCountry" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item class="customed-form-item" label="是否计量器具" prop="isEasuringInstrument" :label-width="120">
                                <i-switch  @on-change="changeisEasuringInstrument" v-model="formModel.isEasuringInstrument"/>
                            </i-form-item>
                        </i-col>
                    </i-row>
                </i-form>
                <i-form v-show="stepIndex === 1" class="customed-form" ref="form1" :model="formModel" :rules="rules">
                    <i-row type="flex" justify="start"  class="item-content-1">
                        
                        <i-col span="12">
                            <i-form-item prop="buyDate" class="customed-form-item" label="购入日期" :label-width="120">
                                <i-date-picker type="date" v-model="formModel.buyDate" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%"></i-date-picker>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="invoiceNumber" class="customed-form-item" label="发票号" :label-width="120">
                                <i-input v-model="formModel.invoiceNumber" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                         <i-col span="12">
                            <i-form-item prop="reimbursementNumber" class="customed-form-item" label="报销凭证号" :label-width="120">
                                <i-input v-model="formModel.reimbursementNumber" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="buyOriginalPrince" class="customed-form-item" label="购买原值" :label-width="120">
                                <i-input v-model="formModel.buyOriginalPrince" number>
                                    <span slot="append">元</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item class="customed-form-item" label="设备状态" prop="deviceStatus" :label-width="120">
                                <i-switch  @on-change="changeDeviceStatus" v-model="formModel.deviceStatus"/>
                            </i-form-item>
                        </i-col>

                         <i-col span="12">
                            <i-form-item prop="deviceAdministrator" class="customed-form-item" label="设备管理员" :label-width="120">
                                <i-select  v-model="formModel.deviceAdministrator" maxlength="20">
                                    <i-option v-for="item in selectListObj.supervisingList" :key="item.id" :value="item.id">{{item.name}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="storageLocation" class="customed-form-item" label="存放地点" :label-width="120">
                                <i-select  v-model="formModel.storageLocation" maxlength="20">
                                    <i-option v-for="item in selectListObj.toolsAreaList" :key="item.id" :value="item.id">{{item.addr}}</i-option>
                                </i-select> 
                            </i-form-item>
                        </i-col>

                        <i-col span="12">
                            <i-form-item prop="amount" class="customed-form-item" label="数量" :label-width="120">
                                <i-input v-model="formModel.amount" number>
                                    <span slot="append">个</span>
                                </i-input>
                            </i-form-item>
                        </i-col>

                    </i-row>
                    
                </i-form>

                <i-form v-show="stepIndex === 2" class="customed-form" ref="form2" :model="formModel" :rules="rules">
                   
                    <i-row type="flex" justify="start">

                        <i-col span="12">
                            <i-form-item prop="metrologyCalibrationCertificate" class="customed-form-item" label="计量/校准合格证书" :label-width="130">
                                <i-input v-model="formModel.metrologyCalibrationCertificate" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="calibrationUnit" class="customed-form-item" label="计量/校准单位" :label-width="130">
                                <i-input v-model="formModel.calibrationUnit" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="uncertainty" class="customed-form-item" label="不确定度" :label-width="130">
                                <i-input v-model="formModel.uncertainty" number>
                                    <span slot="append">%</span>
                                </i-input>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="validationBasis" class="customed-form-item" label="效验依据" :label-width="130">
                                <i-input v-model="formModel.validationBasis" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item prop="verificationCalibrationCycle" class="customed-form-item" label="检定/校准周期" :label-width="130">
                                <i-input v-model="formModel.verificationCalibrationCycle" placeholder="请输入" maxlength="255"/>
                            </i-form-item>
                        </i-col>
                         <i-col span="12">
                            <i-form-item prop="validityPeriod" class="customed-form-item" label="有效期" :label-width="130">
                                <i-input v-model="formModel.validityPeriod" number>
                                    <span slot="append">天</span>
                                </i-input>
                            </i-form-item>
                        </i-col>

                         <i-col span="12">
                            <i-form-item prop="latestCalibrationDate" class="customed-form-item" label="最新检定/校准日期" :label-width="130">
                                <i-date-picker type="date" v-model="formModel.latestCalibrationDate" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%"></i-date-picker>
                            </i-form-item>
                        </i-col>
                         <i-col span="12">
                            <i-form-item prop="nextCalibrationDate" class="customed-form-item" label="下次检定/校准日期" :label-width="130">
                                <i-date-picker type="date" v-model="formModel.nextCalibrationDate" placeholder="请选择" format="yyyy-MM-dd" style="width: 100%"></i-date-picker>
                            </i-form-item>
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
        toolsNumber: [{required: true, message: "请输入正确的工器具编号", pattern: patterns["character"]}],
        factoryNo: [{required: false, message: "请输入正确的出厂编号", pattern: patterns["character"]}],
        invoiceNumber: [{required: false, message: "请输入正确的发票号", pattern: patterns["character"]}],
        reimbursementNumber: [{required: false, message: "请输入正确的报销凭证号", pattern: patterns["character"]}],
        specifications: [{required: true, message: "请输入正确的规格型号" }], // , pattern: patterns["character"]
        deviceName: [{required: true, message: "请输入设备名称	"}],
        toolType: [{required: true, message: "请选择工具类型"}],
        buyDate: [{required: true, message: "请选择购入日期"}],
        buyOriginalPrince:
        [
            {
                required: true,
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
        storageLocation: [{required: true, message: "请选择存放地点"}],
        amount:
        [
            {
                required: true,
                validator:
                (rule, value, callback) =>
                {
                    
                    if(patterns["positive.integer.zero"].test(value))
                    {
                        callback();
                        
                    }
                    else
                    {
                        callback(new Error("请输入正确数量"));
                    }
                
                }
            }
            
        ],
        toolsLevel:
        [
            {
                required: false
                // validator:
                // (rule, value, callback) =>
                // {
                    
                //     if(patterns["positive.integer.zero"].test(value))
                //     {
                //         callback();
                        
                //     }
                //     else
                //     {
                //         callback(new Error("请输入正确等级"));
                //     }
                
                // }
            }
            
        ],

        uncertainty:
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
                        callback(new Error("请输入正确的不确定度"));
                    }
                }
            }
        ],
        mileage:
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
                        callback(new Error("请输入正确的里程数"));
                    }
                }
            }
        ],
        power:
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
                        callback(new Error("请输入正确的功率"));
                    }
                }
            }
        ],
        deviceWeight:
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
                        callback(new Error("请输入正确的重量"));
                    }
                }
            }
        ],
        accuracy:
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
                        callback(new Error("请输入正确的精度"));
                    }
                }
            }
        ],
        validityPeriod:
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
                        callback(new Error("请输入正确的天数"));
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
            this.title = "编辑工器具";
            
            this.onReset(data);
        }
        else
        {
            // 新增
            this.title = "新增工器具";
            this.onReset({});
        }

    }

    /**
     * 重置数据
     * @public
     */
    protected onReset(param?)
    {

        this.formModel =
        {
            accuracy: param.accuracy || 0,
            amount: param.amount || 1,
            buyDate: param.buyDate && dayjs(param.buyDate).format("YYYY-MM-DD") || "",
            latestCalibrationDate: param.latestCalibrationDate && dayjs(param.latestCalibrationDate).format("YYYY-MM-DD") || "",
            nextCalibrationDate: param.nextCalibrationDate && dayjs(param.nextCalibrationDate).format("YYYY-MM-DD") || "",
            buyOriginalPrince: param.buyOriginalPrince || 0,
            calibrationUnit: param.calibrationUnit || undefined,
            deviceAdministrator: param.deviceAdministrator || undefined,
            deviceName: param.deviceName || undefined,
            deviceSize: param.deviceSize || undefined,
            deviceStatus:  param.deviceStatus !== undefined ? !!param.deviceStatus : true,
            deviceWeight: param.deviceWeight || 0,
            factoryNo: param.factoryNo || undefined,
            id: param.id || undefined,
            invoiceNumber: param.invoiceNumber || undefined,
            isEasuringInstrument: param.isEasuringInstrument !== undefined ? !!param.isEasuringInstrument : true,
            manufacturer: param.manufacturer || undefined,
            manufacturerCountry: param.manufacturerCountry || undefined,
            mileage: param.mileage || 0,
            metrologyCalibrationCertificate: param.metrologyCalibrationCertificate || undefined,
            power: param.power || 0,
            reimbursementNumber: param.reimbursementNumber || undefined,
            specifications: param.specifications || undefined,
            storageLocation: param.storageLocation || undefined,
            toolType: param.toolType || undefined,
            toolsFileId: param.toolsFileId || undefined,
            toolsLevel: param.toolsLevel || undefined,
            toolsNumber: param.toolsNumber || undefined,
            uncertainty: param.uncertainty || 0,
            validationBasis: param.validationBasis || undefined,
            validityPeriod: param.validityPeriod || 0,
            verificationCalibrationCycle: param.verificationCalibrationCycle || undefined,
            voltageLevel: param.voltageLevel || undefined
        };

    }

    /**
     * 是否计量器具
     * @public
     */
    protected changeisEasuringInstrument(bool)
    {
        this.formModel.isEasuringInstrument = bool;
    }

    /**
     * 设备状态
     * @public
     */
    protected changeDeviceStatus(bool)
    {
        this.formModel.deviceStatus = bool;
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
                    accuracy: param.accuracy || 0,
                    amount: param.amount || 0,
                    buyDate: param.buyDate && dayjs(param.buyDate).format("YYYY-MM-DD") || "",
                    latestCalibrationDate: param.latestCalibrationDate && dayjs(param.latestCalibrationDate).format("YYYY-MM-DD") || "",
                    nextCalibrationDate: param.nextCalibrationDate && dayjs(param.nextCalibrationDate).format("YYYY-MM-DD") || "",
                    buyOriginalPrince: param.buyOriginalPrince || undefined,
                    calibrationUnit: param.calibrationUnit || undefined,
                    deviceAdministrator: param.deviceAdministrator || undefined,
                    deviceName: param.deviceName || undefined,
                    deviceSize: param.deviceSize || undefined,
                    deviceStatus: param.deviceStatus ? 1 : 0,
                    deviceWeight: param.deviceWeight || 0,
                    factoryNo: param.factoryNo || undefined,
                    id: param.id || undefined,
                    invoiceNumber: param.invoiceNumber || undefined,
                    isEasuringInstrument: param.isEasuringInstrument ? 1 : 0,
                    manufacturer: param.manufacturer || undefined,
                    manufacturerCountry: param.manufacturerCountry || undefined,
                    mileage: param.mileage || 0,
                    metrologyCalibrationCertificate: param.metrologyCalibrationCertificate || undefined,
                    power: param.power || 0,
                    reimbursementNumber: param.reimbursementNumber || undefined,
                    specifications: param.specifications || undefined,
                    storageLocation: param.storageLocation || undefined,
                    toolType: param.toolType || undefined,
                    toolsFileId: param.toolsFileId || undefined,
                    toolsLevel: param.toolsLevel || undefined,
                    toolsNumber: param.toolsNumber || undefined,
                    uncertainty: param.uncertainty || 0,
                    validationBasis: param.validationBasis || undefined,
                    validityPeriod: param.validityPeriod || 0,
                    verificationCalibrationCycle: param.verificationCalibrationCycle || undefined,
                    voltageLevel: param.voltageLevel || undefined
                    
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
        else if (type === "next")
        {
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