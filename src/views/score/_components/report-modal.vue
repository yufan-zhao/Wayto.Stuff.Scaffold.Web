<template>
    <u-crud-modal
        ref="systemNodeItemModal"
        :title="mode === 'insert' ? '添加危大工程' : '修改危大工程'"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="formRules">
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="工程类别：" :label-width="140" prop="dangerType">
                        <i-cascader :data="dangerTypeData" placeholder="请选择工程类别" v-model="dangerType" @on-change="onDangerTypeChange" style="margin-bottom:5px;"></i-cascader>
                    </i-form-item>
                </i-col>
                <!-- <i-col span="24">
                    <i-form-item class="customed-form-item" label="是否超危大：" :label-width="140" prop="riskType">
                        <i-switch v-model="formModel.riskType" @on-change="onRiskTypeChange"></i-switch>
                    </i-form-item>
                </i-col> -->
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="危大情况：" :label-width="140" prop="riskType">
                        <i-radio-group v-model="dangerDegree" @on-change="onRadioChange">
                            <i-radio label="a">危大</i-radio>
                            <i-radio label="b">超危大</i-radio>
                        </i-radio-group>
                    </i-form-item>
                </i-col>
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="危大描述：" :label-width="140" prop="epicDangerItemIds">
                        <i-select placeholder="请选择危大描述" multiple v-model="formModel.epicDangerItemIds" :max-tag-count="3">
                            <i-option v-for="(item, i) in dangerItemData" :key="i" :value="item.id">{{formModel.riskType ? (item.dangerPlusDetails || "-") : (item.dangerDetails || "-")}}</i-option>
                        </i-select>
                    </i-form-item>
                </i-col>
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="现场照片：" :label-width="140" prop="mediaFiles">
                        <ux-image-upload
                            v-model="formModel.mediaFiles"
                            :uploadSingleFunction="commonFileService.uploadBlobSingle.bind(commonFileService)"
                            :uploadFunction="commonFileService.upload.bind(commonFileService)"
                            :payload="consultDetail"
                            :watermarkLogoUrl="logoUrl"
                        ></ux-image-upload>
                    </i-form-item>
                </i-col>
                <i-col span="12">
                    <i-form-item class="customed-form-item" label="方案制定：" :label-width="140" prop="scheme">
                        <i-switch v-model="formModel.scheme"></i-switch>
                    </i-form-item>
                </i-col>
                <i-col span="12">
                    <i-form-item class="customed-form-item" label="专家论证：" :label-width="140" prop="demonstration">
                        <i-switch v-model="formModel.demonstration"></i-switch>
                    </i-form-item>
                </i-col>
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="实施阶段及方案执行情况：" :label-width="140" prop="implementation">
                        <i-input v-model="formModel.implementation" type="textarea" :rows="4" placeholder="请输入"></i-input>
                    </i-form-item>
                </i-col>
                <i-col span="24">
                    <i-form-item class="customed-form-item" label="问题隐患等级：" :label-width="140" prop="dangerLevel">
                        <i-select placeholder="请选择" v-model="formModel.dangerLevel">
                            <i-option v-for="(dangerItem, i) in dangerList" :key="'module-'+ i" :value="dangerItem.id">{{dangerItem.levelNumber}}（{{dangerItem.content}}）</i-option>
                        </i-select>
                    </i-form-item>
                </i-col>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { service } from "src/common/decorator";
import { ScoreReportService, DictService, CommonFileService, SpecialEpicDangerService, SpecialEpicDangerItemService } from "src/services";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@component
export default class ReportModal extends View
{
    @service("ScoreReportService")
    private scoreReportService: ScoreReportService;

    @service("CommonFileService")
    private commonFileService: CommonFileService;

    @service("DictService")
    private dictService: DictService;

    @service("SpecialEpicDangerService")
    private specialEpicDangerService: SpecialEpicDangerService;

    @service("SpecialEpicDangerItemService")
    private specialEpicDangerItemService: SpecialEpicDangerItemService;

    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    protected get logoUrl()
    {
        if (this.consultDetail)
        {
            return "/serverApi" + this.consultDetail.logoUrl;
        }
        return "";
    }

    protected dangerList = [];

    protected dangerTypeData = [];

    protected dangerTypeTargetId = -1;

    protected dangerType = [];

    protected dangerItemData = [];

    protected extraList = [];

    protected wtfId = -1;

    protected dangerDegree = "a";

    /**
     * 弹层模式列表
     * @property
     */
    protected modeList: Array<string> = ["insert", "update"];

    /**
     * 弹层模式
     * @property
     */
    protected mode: string = this.modeList[0];

    protected specialTypeId: number = -1;

    /**
     * 表格值
     * @protected
     * @property
     */
    protected formModel: any =
    {
        id: undefined,
        consultPlanId: undefined,
        mediaFiles: [],
        scheme: false,
        demonstration: false,
        implementation: "",
        dangerLevel: undefined,
        epicDangerItemIds: [],
        riskType: false
    };

    protected deleteIds = [];

    /**
     * 表格校验规则
     * @protected
     * @property
     */
    protected formRules: any =
    {
        // dangerType:
        // [
        //     {required: true, validator: (rule, value, callback) =>
        //     {
        //         let target = this.dangerType;
        //         console.log(target);
        //         if (Array.isArray(target) && target.length > 0)
        //         {
        //             callback();
        //         }
        //         else
        //         {
        //             callback(new Error("工程类别不能为空"));
        //         }
        //     }}
        // ],
        epicDangerItemIds:
        [
            {required: true, message: "危大描述不能为空"}
        ],
        mediaFiles:
        [
            {required: true, validator: (rule, value, callback) =>
            {
                if (Array.isArray(value) && value.length > 0)
                {
                    callback();
                }
                else
                {
                    callback(new Error("现场照片不能为空"));
                }
            }}
        ],
        implementation:
        [
            {required: true, message: "实施阶段及方案执行情况不能为空"}
        ],
        dangerLevel:
        [
            {required: true, message: "问题隐患等级不能为空"}
        ]
    };

    /**
     * 打开方法
     * @param mode 弹层模式 insert，update
     * @param data 组织信息，insert模式下为父组织，update时为指定待更新组织
     * @member
     */
    public async open(mode: string, data: any, consultPlanId: number, specialTypeId: number, wtfId: number, extraList: Array<any>)
    {
        this.specialTypeId = specialTypeId;
        this.wtfId = wtfId;
        this.extraList = extraList;
        this.mode = mode === "update" ? this.modeList[1] : this.modeList[0];

        if (mode === this.modeList[0])
        {
            // 新增
            this.$set(this.formModel, "consultPlanId", consultPlanId);
            this._systemNodeItemModal.open();
        }
        else
        {
            // 更新
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "consultPlanId", data.equipment);
            this.$set(this.formModel, "mediaFiles", data.mediaFiles);
            this.$set(this.formModel, "scheme", data.scheme);
            this.$set(this.formModel, "demonstration", data.demonstration);
            this.$set(this.formModel, "implementation", data.implementation);
            this.$set(this.formModel, "dangerLevel", data.dangerLevel);
            this.dangerDegree = data.riskType ? "b" : "a";
            
            setTimeout(() =>
            {
                let t = this.findValueLink(data.projTypeId);
                this.dangerType.splice(0);
                this.dangerType.push(...t);
                this.onDangerTypeChange(t, undefined);
                this.dangerTypeTargetId = data.projTypeId;
                this.$set(this.formModel, "epicDangerItemIds", data.epicDangerItemIds);
            }, 1000);

            this._systemNodeItemModal.open();
        }
    }

    /**
     * 按钮操作
     * @protected
     * @member
     * @param opName submit - 提交  cancel - 取消
     */
    protected onOps(opName: string, onValidateFailed: Function)
    {
        if (opName === "submit")
        {
            this.$form.validate(async valid =>
            {
                if (!valid)
                {
                    onValidateFailed();
                    return;
                }

                if (this.dangerType.length === 0)
                {
                    this.$message.error("工程类型不能为空");
                    return;
                }

                try
                {
                    let data = JSON.parse(JSON.stringify(this.formModel));
                    
                    if (this.mode === this.modeList[0])
                    {
                        if (this.wtfId > 0)
                        {
                            await this.scoreReportService.update({
                                data:
                                {
                                    param:
                                    {
                                        id: this.wtfId,
                                        consultPlanId: data.consultPlanId,
                                        isRisk: true
                                    },
                                    paramExt:
                                    {
                                        riskDetails:
                                        [
                                            ...this.extraList.map(item =>
                                            {
                                                return {
                                                    id: item.id,
                                                    projTypeId: item.projTypeId,
                                                    scheme: item.scheme,
                                                    dangerLevel: item.dangerLevel,
                                                    fileIds: item.mediaFiles.map(item => item.id),
                                                    demonstration: item.demonstration,
                                                    implementation: item.implementation,
                                                    riskType: item.riskType ? 2 : 1,
                                                    dangerItemIds: item.epicDangerItemIds.join(",")
                                                };
                                            }),
                                            {
                                                id: data.id,
                                                projTypeId: this.dangerTypeTargetId,
                                                scheme: data.scheme,
                                                dangerLevel: data.dangerLevel,
                                                fileIds: data.mediaFiles.map(item => item.id),
                                                demonstration: data.demonstration,
                                                riskType: data.riskType ? 2 : 1,
                                                implementation: data.implementation,
                                                dangerItemIds: data.epicDangerItemIds.join(",")
                                            }
                                        ]
                                    }
                                }
                            });
                        }
                        else
                        {
                            await this.scoreReportService.insert({
                                data:
                                {
                                    param:
                                    {
                                        consultPlanId: data.consultPlanId,
                                        isRisk: true
                                    },
                                    paramExt:
                                    {
                                        riskDetails:
                                        [
                                            ...this.extraList.map(item =>
                                            {
                                                return {
                                                    id: item.id,
                                                    projTypeId: item.projTypeId,
                                                    scheme: item.scheme,
                                                    dangerLevel: item.dangerLevel,
                                                    fileIds: item.mediaFiles.map(item => item.id),
                                                    demonstration: item.demonstration,
                                                    implementation: item.implementation,
                                                    riskType: item.riskType ? 2 : 1,
                                                    dangerItemIds: item.epicDangerItemIds.join(",")
                                                };
                                            }),
                                            {
                                                projTypeId: this.dangerTypeTargetId,
                                                scheme: data.scheme,
                                                dangerLevel: data.dangerLevel,
                                                fileIds: data.mediaFiles.map(item => item.id),
                                                demonstration: data.demonstration,
                                                implementation: data.implementation,
                                                riskType: data.riskType ? 2 : 1,
                                                dangerItemIds: data.epicDangerItemIds.join(",")
                                            }
                                        ]
                                    }
                                }
                            });
                        }
                        this.$message.success("新增成功");
                    }
                    else
                    {
                        await this.scoreReportService.update({
                            data:
                            {
                                param:
                                {
                                    id: this.wtfId,
                                    consultPlanId: data.consultPlanId,
                                    isRisk: true
                                },
                                paramExt:
                                {
                                    riskDetails:
                                    [
                                        ...this.extraList.map(item =>
                                        {
                                            if (item.id === data.id)
                                            {
                                                return {
                                                    id: data.id,
                                                    projTypeId: this.dangerTypeTargetId,
                                                    scheme: data.scheme,
                                                    dangerLevel: data.dangerLevel,
                                                    fileIds: data.mediaFiles.map(jtem => jtem.id),
                                                    demonstration: data.demonstration,
                                                    implementation: data.implementation,
                                                    dangerItemIds: data.epicDangerItemIds.join(","),
                                                    riskType: data.riskType ? 2 : 1
                                                };
                                            }
                                            else
                                            {
                                                return {
                                                    id: item.id,
                                                    projTypeId: item.projTypeId,
                                                    scheme: item.scheme,
                                                    dangerLevel: item.dangerLevel,
                                                    fileIds: item.mediaFiles.map(jtem => jtem.id),
                                                    demonstration: item.demonstration,
                                                    implementation: item.implementation,
                                                    dangerItemIds: item.epicDangerItemIds.join(","),
                                                    riskType: item.riskType ? 2 : 1
                                                };
                                            }
                                        })
                                    ]
                                }
                            }
                        });
                        this.$message.success("修改成功");
                    }
                }
                catch (err)
                {
                    onValidateFailed();
                    this.$message.error(err.message || err.msg);
                }
                this._systemNodeItemModal.close();
                this.$emit("on-refresh");
            });
        }
        else
        {
            this._systemNodeItemModal.close();
        }
    }

    /**
     * 弹层完全关闭时事件
     * @protected
     * @member
     */
    protected onClosed()
    {
        this.$set(this.formModel, "id", undefined);
        this.$set(this.formModel, "consultPlanId", undefined);
        this.$set(this.formModel, "mediaFiles", []);
        this.$set(this.formModel, "scheme", false);
        this.$set(this.formModel, "demonstration", false);
        this.$set(this.formModel, "riskType", false);
        this.$set(this.formModel, "implementation", "");
        this.$set(this.formModel, "dangerLevel", undefined);
        this.$set(this.formModel, "epicDangerItemIds", []);
        this.dangerDegree = "a";

        this.mode = this.modeList[0];
        this.$form.resetFields();

        this.dangerItemData = [];
        this.dangerType = [];
        // this.dangerTypeData = [];
    }

    protected async onDangerTypeChange(value, selectedData)
    {
        this.$set(this.formModel, "epicDangerItemIds", []);
        let targetId = value[value.length - 1];
        this.dangerTypeTargetId = targetId;
        let res = await this.specialEpicDangerItemService.query(targetId);
        this.dangerItemData = res.content;
    }

    protected onRiskTypeChange()
    {
        this.$set(this.formModel, "epicDangerItemIds", []);
    }
    
    protected onRadioChange(value: string)
    {
        this.$set(this.formModel, "riskType", value === "b");
        this.$set(this.formModel, "epicDangerItemIds", []);
    }

    protected async created()
    {
        const res = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.HAZARD_LEVEL);
        this.dangerList = res;

        // this.specialEpicDangerService.getSpecialDangerList();
    }

    @watch("specialTypeId", {immediate: true})
    protected async specialTypeIdWatcher(val: number)
    {
        if (val > 0)
        {
            let res = await this.specialEpicDangerService.getSpecialDangerList(val);
            let result = this.resolveDangerTypeData(res.content);
            this.dangerTypeData = result;
        }
    }

    private resolveDangerTypeData(list: Array<any>)
    {
        list.forEach(item =>
        {
            item.label = item.name;
            item.value = item.id;
            if (Array.isArray(item.childList) && item.childList.length > 0)
            {
                item.children = this.resolveDangerTypeData(item.childList);
            }
        });
        return list;
    }

    private findValueLink(targetId: number, list = this.dangerTypeData, result: Array<number> = []): Array<number>
    {
        for (let i = 0; i < list.length; i++)
        {
            let item = list[i];
            result.push(item.id);
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                let temp = this.findValueLink(targetId, item.children, result);
                if (temp)
                {
                    return temp;
                }
            }
            else
            {
                if (item.id === targetId)
                {
                    return result;
                }
                else
                {
                    result.splice(0);
                }
            }
        }
    }

    /**
     * 表格ref
     * @private
     */
    private get $form(): any
    {
        return this.$refs["form"] as any;
    }

    /**
     * 弹层ref
     * @private
     */
    private get _systemNodeItemModal(): any
    {
        return this.$refs["systemNodeItemModal"] as any;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/group-form-inputs";

.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>