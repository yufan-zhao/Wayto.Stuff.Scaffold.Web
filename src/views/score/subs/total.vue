<template>
    <div class="total-view">
        <ScoreDetail
            :consultId="consultId"
            :specialTypeId="specialTypeId"
            :specialIds="currentConsultSpecialIds"
        ></ScoreDetail>
    </div>
</template>

<script lang="ts">
import { View, component, config } from "uxmid-vue-web";
import ScoreDetail from "../_components/score-detail.vue";

/**
 * 总评分
 */
@component({
    components:
    {
        ScoreDetail
    }
})
export default class TotalView extends View
{
    /**
     * 诊治详情
     * @config
     */
    @config({required: true})
    protected consultDetail: any;

    /**
     * 诊治id
     * @property
     */
    protected get consultId(): number
    {
        return this.consultDetail ? this.consultDetail.id : -1;
    }

    /**
     * 诊治的体系类型id
     * @property
     */
    protected get specialTypeId(): number
    {
        return this.consultDetail ? this.consultDetail.specialTypeId : -1;
    }

    /**
     * 当前诊治计划包含的体系id列表
     * @property
     */
    protected get currentConsultSpecialIds(): Array<number>
    {
        return this.consultDetail ? this.consultDetail.specialIds.split(",") : [];
    }
}
</script>

<style lang="less" scoped>
.total-view
{
    width: 100%;
    height: 100%;
}
</style>