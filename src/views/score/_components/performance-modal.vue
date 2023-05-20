<template>
    <u-crud-modal
        ref="curdModal"
        class="curd-modal"
        :title="title"
        :width="536"
        @on-ops="onOps"
        @on-closed="onClosed"
    >
        <template v-slot:content>
            <i-form class="customed-form" ref="form" :model="formModel" :rules="rules">
                <i-row type="flex" justify="start">
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="现场照片：" :label-width="120" prop="mediaFiles">
                            <ux-image-upload
                                v-model="formModel.mediaFiles"
                                :uploadSingleFunction="commonFileService.uploadBlobSingle.bind(commonFileService)"
                                :uploadFunction="commonFileService.upload.bind(commonFileService)"
                                :payload="consultDetail"
                                :watermarkLogoUrl="logoUrl"
                                @on-change="onMediaFilesChange(arguments)"
                                :limit="1"
                            ></ux-image-upload>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="人员姓名：" :label-width="120">
                            <i-input v-model="formModel.userName" placeholder="请输入"></i-input>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="人员职位：" :label-width="120">
                            <!-- <i-input v-model="formModel.position" placeholder="请输入"></i-input> -->
                            <i-select v-model="formModel.positionId" placeholder="请选择">
                                <i-option v-for="(item, i) in positionList" :key="i" :value="item.id">{{item.positionName}}</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="在岗情况：" :label-width="120">
                            <i-select v-model="formModel.jobSituation" placeholder="请选择">
                                <i-option :value="1">在岗</i-option>
                                <i-option :value="0">离岗</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                    <i-col span="24" v-if="formModel.jobSituation === 0">
                        <i-form-item class="customed-form-item" label="离岗情况描述：" :label-width="120">
                            <i-input v-model="formModel.description" placeholder="请输入"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { ScorePerformanceService, CommonFileService, DictService } from "src/services";
import { service } from "src/common/decorator";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends View
{
    @service("ScorePerformanceService")
    private mianService: ScorePerformanceService;

    @service("CommonFileService")
    private commonFileService: CommonFileService;

    @service("DictService")
    private dictService: DictService;

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

    /**
     * 职务列表
     * @property
     */
    protected positionList: Array<any> = [];

    /**
     * 弹层标题
     * @protected
     * @property
     */
    protected title: string = "";

    /**
     * 表单对象
     * @protected
     * @property
     */
    protected formModel: any =
    {
        id: undefined,
        mediaFiles: [],
        consultPlanId: undefined,
        description: "",
        jobSituation: undefined,
        userName: "",
        positionId: undefined
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        mediaFiles:
        [
            {
                required: true,
                validator: (rule, value, callback) =>
                {
                    if (value.length > 0)
                    {
                        callback();
                    }
                    else
                    {
                        callback(new Error("请选择现场照片"));
                    }
                }
            }
        ]
    };

    /**
     * 打开方法
     * @public
     */
    public open(type: string, consultPlanId: number, data?: any)
    {
        this.$set(this.formModel, "consultPlanId", consultPlanId);

        if (type === "update")
        {
            // 更新
            this.title = "编辑履职情况";
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "description", data.description);
            this.$set(this.formModel, "mediaFiles", data.commonFileList);
            this.$set(this.formModel, "jobSituation", data.jobSituation ? 1 : 0);
            this.$set(this.formModel, "positionId", data.positionId);
            this.$set(this.formModel, "userName", data.userName);
            this.$set(this.formModel, "mediaFiles", [{
                id: data.commonFileId,
                filePath: data.filePath
            }]);
        }
        else
        {
            // 新增
            this.title = "新增履职情况";
        }
        this._curdModal.open();
    }

    /**
     * 媒体文件变化事件
     * @protected
     */
    protected onMediaFilesChange(args: Array<any>)
    {
        this.$set(this.formModel, "mediaFiles", args[0]);
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
                    const data = JSON.parse(JSON.stringify(this.formModel));
                    if (this.formModel.id)
                    {
                        // 更新
                        await this.mianService.update({
                            id: data.id,
                            consultPlanId: data.consultPlanId,
                            description: data.description,
                            jobSituation: data.jobSituation,
                            positionId: data.positionId,
                            userName: data.userName,
                            commonFileId: data.mediaFiles[0].id
                        });
                        this.$message.success("编辑成功");
                    }
                    else
                    {
                        // 新增
                        await this.mianService.insert({
                            consultPlanId: data.consultPlanId,
                            description: data.description,
                            jobSituation: data.jobSituation,
                            positionId: data.positionId,
                            userName: data.userName,
                            commonFileId: data.mediaFiles[0].id
                        });
                        this.$message.success("新增成功");
                    }
                    this.$emit("on-refresh", this.formModel);
                    this._curdModal.close();
                }
                catch(err)
                {
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
        this.$set(this.formModel, "id", undefined);
        this.$set(this.formModel, "description", "");
        this.$set(this.formModel, "mediaFiles", []);
        this.$set(this.formModel, "jobSituation", undefined);
        this.$set(this.formModel, "positionId", undefined);
        this.$set(this.formModel, "userName", "");
        this._form.resetFields();
    }

    protected async created()
    {
        const res = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.POSITION_SETTING);
        this.positionList = res;
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
.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>