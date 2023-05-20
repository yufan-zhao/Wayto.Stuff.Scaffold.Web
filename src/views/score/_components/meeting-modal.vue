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
                        <i-form-item class="customed-form-item" label="现场照片：" :label-width="108">
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
                        <i-form-item class="customed-form-item" label="情况描述：" :label-width="108">
                            <i-input v-model="formModel.remarks" type="textarea" placeholder="请输入"></i-input>
                        </i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </template>
    </u-crud-modal>
</template>

<script lang="ts">
import { component, View, mixins, config, watch } from "uxmid-vue-web";
import { ScoreMeetingService, CommonFileService } from "src/services";
import { service } from "src/common/decorator";

/**
 * 新增、编辑弹层
 * @component
 */
@component
export default class InsertUpdateModal extends View
{
    @service("ScoreMeetingService")
    private scoreMeetingService: ScoreMeetingService;

    @service("CommonFileService")
    private commonFileService: CommonFileService;

    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    @config({required: false, default: ""})
    protected logoUrl: string;

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
        remarks: ""
    };

    /**
     * 表单校验规则
     * @protected
     * @property
     */
    protected rules: any =
    {

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
            this.title = "编辑宣贯会";
            this.$set(this.formModel, "id", data.id);
            this.$set(this.formModel, "remarks", data.remarks);
            this.$set(this.formModel, "mediaFiles", data.commonFiles);
        }
        else
        {
            // 新增
            this.title = "新增宣贯会";
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
                        await this.scoreMeetingService.update({
                            id: data.id,
                            consultPlanId: data.consultPlanId,
                            remarks: data.remarks,
                            fileIds: data.mediaFiles.map(item => item.id)
                        });
                        this.$message.success("编辑成功");
                    }
                    else
                    {
                        // 新增
                        await this.scoreMeetingService.insert({
                            consultPlanId: data.consultPlanId,
                            remarks: data.remarks,
                            fileIds: data.mediaFiles.map(item => item.id)
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
        this.$set(this.formModel, "remarks", "");
        this.$set(this.formModel, "mediaFiles", []);
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
.customed-form
{
    padding: 30px 30px 0 5px;
}
</style>