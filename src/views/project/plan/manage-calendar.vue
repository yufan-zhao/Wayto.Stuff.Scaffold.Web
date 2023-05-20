<template>
    <div class="system-view plan-calendar">
        <div class="legend-container">
            <ul>
                <li>
                    <span class="pic" style="background-color: #39cb77"></span>
                    <span class="label">已诊治</span>
                </li>
                <li>
                    <span class="pic" style="background-color: #FF4D3F"></span>
                    <span class="label">未诊治</span>
                </li>
                <li>
                    <span class="pic" style="background-color: #ffb119"></span>
                    <span class="label">诊治中</span>
                </li>
                <!-- <li>
                    <span class="pic" style="background-color: #FFB119"></span>
                    <span class="label">上午</span>
                </li>
                <li>
                    <span class="pic" style="background-color: #2770FF"></span>
                    <span class="label">下午</span>
                </li> -->
            </ul>
        </div>

        <b-plan-calendar
            @on-month-change="onMonthChange"
        >
            <template v-slot:day-content="{ day }">
                <DayItem :day="day" :data="getTargetPlan(day.date)" @on-add="onAdd"></DayItem>
            </template>
        </b-plan-calendar>

        <main-insert-update-modal
            ref="mainInsertUpdateModal"
            :insert="consultPlanService.insert.bind(consultPlanService)"
            :update="consultPlanService.update.bind(consultPlanService)"
            :selectListObj="selectListObj"
            @on-refresh="onRefresh"
        >
        </main-insert-update-modal>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import dayjs from "dayjs";
import { service } from "src/common/decorator";
import { ProjectPlanService, ConsultPlanService, DictService, DiagnosService, SpecialTypeService, CustomerService } from "src/services";
import DayItem from "./_components/day-item.vue";
import InsertUpdateModal from "./_components/insert-update-modal.vue";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@component({
    components:
    {
        DayItem,
        "main-insert-update-modal": InsertUpdateModal
    }
})
export default class ManageView extends View
{
    @service("ProjectPlanService")
    private projectPlanService: ProjectPlanService;

    @service("ConsultPlanService")
    protected consultPlanService: ConsultPlanService;

    @service("DictService")
    protected dictService: DictService;

    @service("DiagnosService")
    protected diagnosService: DiagnosService;

    @service("SpecialTypeService")
    protected specialTypeService: SpecialTypeService;

    @service("CustomerService")
    protected customerService: CustomerService;

    /**
     * 筛选来源数据集合（除去分页）
     * @property
     */
    protected selectListObj: any = {};

    /**
     * 当前计划列表
     * @property
     */
    protected planList = [];

    protected currentStartDateStr = "";

    protected currentEndDateStr = "";

    /**
     * 获取指定日期的计划列表
     * @protected
     */
    protected getTargetPlan(targetDate: Date)
    {
        return this.planList.filter((item: any) =>
        {
            return item.consultTime === dayjs(targetDate).format("YYYY-MM-DD");
        }).sort((a, b) =>
        {
            if (a.timeMark && !b.timeMark)
            {
                return 1;
            }
            if (!a.timeMark && b.timeMark)
            {
                return -1;
            }
            return 0;
        });
    }

    /**
     * 月份变动事件
     * @param startDateStr YYYY-MM-01
     * @param endDateStr YYYY-MM-31 自动根据月份和年份得出当月的尾日
     */
    protected async onMonthChange(startDateStr: string, endDateStr: string)
    {
        this.currentStartDateStr = startDateStr;
        this.currentEndDateStr = endDateStr;
        this.planList = await this.projectPlanService.getCalendarPlanList(startDateStr, endDateStr);
    }

    protected async onRefresh()
    {
        this.planList = await this.projectPlanService.getCalendarPlanList(this.currentStartDateStr, this.currentEndDateStr);
    }

    protected onAdd(vcDate: any)
    {
        this._mainInsertUpdateModal.openByDate(vcDate.id);
    }

    protected created()
    {
        this.selectList();
    }

    /**
     * 获得选项框的数据
     * @ref
     */
    protected async selectList()
    {

        let projectTypeList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.PROJECT_TYPE);
        this.selectListObj.projectTypeList = projectTypeList; // 项目类型

        let constructionStageList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE);
        this.selectListObj.constructionStageList = constructionStageList; // 施工阶段

        this.selectListObj.specialTypesList = await this.specialTypeService.getSpecialTypeList(0); // 体系类型表 -- 标准

        let diagonal = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE);
        this.selectListObj.diagonalList = diagonal; // 诊治类型

        let groundName = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.GROUP_NAME);
        this.selectListObj.groundName = groundName; // 诊治组名

        let getLeaders2 = await this.diagnosService.getLeaders({}); // roleId: 2
        this.selectListObj.getLeaders2 = getLeaders2.content; // 诊治组员

        let getLeaders3 = await this.diagnosService.getLeaders({roleId: 3});
        this.selectListObj.getLeaders3 = getLeaders3.content; // 诊治组长

        let areaList = await this.dictService.getTargetContentList(SYSTEM_CONFIG_TYPE.AD_AREA);
        this.selectListObj.areaList = [];
        this.areaTree(null, areaList);// 所在区域
        
        let customerList = await this.customerService.list();
        this.selectListObj.customerList = customerList.content; // 业主方列表
    }

    /**
     * 处理区域架构
     * @ref
     */
    protected areaTree(parentData: any = {}, data: any): any
    {
        if (parentData)
        {
            const children = data.filter(item => item.parentId === parentData.id);
            if (children.length)
            {
                children.forEach(item =>
                {
                    item.label = item.name;
                    item.value = item.id;
                    item.children = this.areaTree(item, data);
                });
                return children;
            } else {
                return [];
            }
        } else {
            data.filter(item => data.filter(e => e.id === item.parentId).length === 0).forEach(item =>
            {
                item.label = item.name;
                item.value = item.id;
                item.children = this.areaTree(item, data);
                this.selectListObj.areaList.push(item);
            });
        }
    }

    /**
     * 主新增编辑弹层
     * @ref
     */
    protected get _mainInsertUpdateModal(): InsertUpdateModal
    {
        return this.$refs["mainInsertUpdateModal"] as InsertUpdateModal;
    }
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/system";

.plan-calendar
{
    height: 100%;
    overflow: auto;
    padding: 20px 30px 60px 30px;

    .legend-container
    {
        ul
        {
            display: flex;
            margin-bottom: 5px;

            li
            {
                display: flex;
                align-items: center;
                padding-right: 10px;

                .pic
                {
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                }
            }
        }
    }
}
</style>