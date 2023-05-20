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
                        <i-form-item class="customed-form-item" label="现场照片：" :label-width="140" prop="mediaFiles">
                            <ux-image-upload
                                v-model="formModel.mediaFiles"
                                :uploadSingleFunction="commonFileService.uploadBlobSingle.bind(commonFileService)"
                                :uploadFunction="commonFileService.upload.bind(commonFileService)"
                                :payload="consultDetail"
                                :watermarkLogoUrl="logoUrl"
                                @on-change="onMediaFilesChange(arguments)"
                            ></ux-image-upload>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="施工阶段：" :label-width="140" prop="constructionStageId">
                            <i-select v-model="formModel.constructionStageId">
                                <i-option v-for="(item, i) in constructionStageList" :key="i" :value="item.id">{{item.phaseName}}</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                    <i-col span="24">
                        <i-form-item class="customed-form-item" label="项目进度概述：" :label-width="140">
                            <i-input v-model="formModel.describe" type="textarea" placeholder="请输入"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { ScoreProgressService, CommonFileService, DictService } from "src/services";
import { service } from "src/common/decorator";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends View
{
    @service("ScoreProgressService")
    private mianService: ScoreProgressService;

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

    protected constructionStageList: Array<any> = [];

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
        describe: "",
        constructionStageId: undefined
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {
        constructionStageId: [{required: true, message: "请选择施工阶段"}],
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
            this.title = "编辑项目进度";
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "describe", data.describe);
            this.$set(this.formModel, "mediaFiles", data.commonFileList);
            this.$set(this.formModel, "constructionStageId", data.constructionStageId);
        }
        else
        {
            // 新增
            this.title = "新增项目进度";
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
                            describe: data.describe,
                            fileIds: data.mediaFiles.map(item => item.id),
                            constructionStageId: data.constructionStageId
                        });
                        this.$message.success("编辑成功");
                    }
                    else
                    {
                        // 新增
                        await this.mianService.insert({
                            consultPlanId: data.consultPlanId,
                            describe: data.describe,
                            fileIds: data.mediaFiles.map(item => item.id),
                            constructionStageId: data.constructionStageId
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
        this.$set(this.formModel, "describe", "");
        this.$set(this.formModel, "mediaFiles", []);
        this.$set(this.formModel, "constructionStageId", undefined);
        this._form.resetFields();
    }

    protected async created()
    {
        const res = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE);
        this.constructionStageList = res;
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