<template>
    <div class="custom-day-item" @click.stop="onDayClick" ref="dayItems">
        
        <i-poptip placement="bottom" popper-class="zoom-poptip" v-model="visible" :width="width" transfer>
            <div style="width:100%;height:0px;"></div>
            <div class="custom-day-item-pop" slot="content">
                <div class="close-btn" @click="onClosePop">X</div>
                <div class="day-label">{{day.day}}</div>
                <div class="plan-items" v-if="data.length > 0">
                    <span
                        class="row"
                        v-for="(item, i) in data"
                        :key="i"
                        :class="{afternoon: item.timeMark, [isPlanFinished(item)]: true}"
                        @dblclick="onDetailSelect(item)"
                    >
                        <span class="label">{{item.projectManager.projectName}}</span>
                        <span class="time">{{item.timeMark ? "下午" : "上午"}}</span>
                    </span>
                    <span class="row-add" @click="onAdd">+</span>
                </div>
                <div class="add-btn" v-else>
                    <span class="container" @click="onAdd">
                        +
                    </span>
                </div>
            </div>
        </i-poptip>
        <div class="day-label">{{day.day}}</div>
        <div class="plan-items" v-if="data.length > 0">
            <span
                class="row"
                v-for="(item, i) in data"
                :key="i"
                :class="{afternoon: item.timeMark, [isPlanFinished(item)]: true}"
                @dblclick="onDetailSelect(item)"
            >
                <span class="label">{{item.projectManager.projectName}}</span>
                <span class="time">{{item.timeMark ? "下午" : "上午"}}</span>
            </span>
            <span class="row-add" @click="onAdd">+</span>
        </div>
        <div class="add-btn" v-else>
            <span class="container" @click="onAdd">
                +
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, config } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { CONSULT_STATUS } from "src/enums";
import dayjs from "dayjs";

@component
export default class DayItem extends CommonView
{
    /**
     * v-calendar的day对象
     * @config
     */
    @config({required: true})
    protected day: any;

    /**
     * 指定日期的计划列表
     * @config
     */
    @config({required: true, default: () => []})
    protected data: Array<any>;

    protected visible = false;

    protected width = 0;

    protected onDayClick()
    {
        if (this.data.length > 1)
        {
            this.visible = true;
        }
    }

    protected onClosePop()
    {
        this.visible = false;
    }

    protected onAdd()
    {
        this.onClosePop();
        this.$emit("on-add", JSON.parse(JSON.stringify(this.day)));
    }

    protected onDetailSelect(item: any)
    {
        if (item.status === CONSULT_STATUS.UNDO)
        {
            // 未诊治
            this.goConsultIncomplete(item.id);
        }
        else if (item.status === CONSULT_STATUS.DOING)
        {
            // 诊治中
            this.goConsultReport(item.id);
        }
        else
        {
            // 已诊治
            this.goConsultComplete(item.id);
        }
    }

    protected isPlanFinished(item: any)
    {
        let result = "";
        // if (item.beginTime)
        // {
        //     let beginTime = dayjs(item.beginTime.split(" ")[0]).unix();
        //     let nowTime = dayjs(dayjs().format("YYYY-MM-DD")).unix();
        //     let status = item.status;

        //     if (beginTime === nowTime)
        //     {
        //         result = "";
        //     }
        //     else
        //     {
        //         result = status === CONSULT_STATUS.DONE ? "done" : "undo";
        //     }
        // }
        if (item.status === CONSULT_STATUS.DONE)
        {
            result = "done";
        }
        if (item.status === CONSULT_STATUS.UNDO)
        {
            result = "undo";
        }

        return result;
    }

    protected mounted()
    {
        let width = this._dayItems.clientWidth;
        this.width = width;
    }

    private get _dayItems()
    {
        return this.$refs["dayItems"] as any;
    }
}
</script>

<style lang="less">
.custom-day-item
{
    display: flex;
    flex-direction: column;
    height: 100%;

    .plan-items
    {
        height: calc(100% - 21px);
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;

        .row
        {
            flex: 0 0 auto;
            height: 32px;
            font-size: 16px;
            line-height: 32px;
            // display: flex;
            // justify-content: space-between;
            position: relative;
            padding: 0 4px 0 42px;
            margin-bottom: 4px;
            border-radius: 2px;
            background-color: #FFB119;
            color: #fff;
            // border: 2px solid #3dc3e0;
            cursor: pointer;

            .label
            {
                display: inline-block;
                width: 100%;
                height: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .time
            {
                position: absolute;
                height: 22px;
                left: 4px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                line-height: 22px;
                background-color: #FFFFFF;
                border-radius: 2px;
                padding: 0 2px;
                color: #ffb119;
            }
        }
        .row.afternoon
        {
            // border-color: #f8934a;
            // background-color: #f8934a;
            .time
            {
                // background-color: #2770FF;
            }
        }
        .row:hover
        {
            // background-color: lighten(#3dc3e0, 10%);
        }
        .row.afternoon:hover
        {
            // background-color: lighten(#f8934a, 10%);
        }
        .row.undo
        {
            background-color: #FF4D3F;

            .time
            {
                color: #FF4D3F;
            }
        }
        .row.done
        {
            background-color: #39cb77;

            .time
            {
                color: #39cb77;
            }
        }
        .row-add
        {
            flex: 0 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #3375F4;
            border-radius: 4px;
            color: #3375F4;
            cursor: pointer;
            transition: all ease-in-out 0.3s;
        }
        .row-add:hover
        {
            border-color: darken(#3375F4, 10%);
            color: darken(#3375F4, 10%);
        }
    }

    .add-btn
    {
        height: calc(100% - 21px);
        padding: 10px;

        .container
        {
            opacity: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #3375F4;
            border-radius: 4px;
            font-size: 24px;
            color: #3375F4;
            cursor: pointer;
            transition: opacity ease-in-out 0.3s;
        }
        .container:hover
        {
            opacity: 1;
        }
    }

    .ivu-poptip
    {
        height: 0px;
        .ivu-poptip-rel
        {
            width: 100%;
        }
    }
}

.ivu-poptip-popper.zoom-poptip
{
    z-index: 500 !important;
    height:0px;
    transform: translateY(-20px);

    .custom-day-item-pop
    {
        .close-btn
        {
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
        }
        .plan-items
        {
            height: calc(100% - 21px);
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;

            .row
            {
                flex: 0 0 auto;
                // height: 32px;
                font-size: 16px;
                // line-height: 32px;
                // display: flex;
                // justify-content: space-between;
                position: relative;
                padding: 0 4px 0 42px;
                margin-bottom: 4px;
                border-radius: 2px;
                background-color: #FFB119;
                color: #fff;
                // border: 2px solid #3dc3e0;
                cursor: pointer;

                .label
                {
                    display: inline-block;
                    width: 100%;
                    // height: 18px;
                    white-space: pre-wrap;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                }
                .time
                {
                    position: absolute;
                    height: 22px;
                    left: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 14px;
                    line-height: 22px;
                    background-color: #FFFFFF;
                    border-radius: 2px;
                    padding: 0 2px;
                    color: #ffb119;
                }
            }
            .row.afternoon
            {
                // border-color: #f8934a;
                // background-color: #f8934a;
                .time
                {
                    // background-color: #2770FF;
                }
            }
            .row:hover
            {
                // background-color: lighten(#3dc3e0, 10%);
            }
            .row.afternoon:hover
            {
                // background-color: lighten(#f8934a, 10%);
            }
            .row.undo
            {
                background-color: #FF4D3F;

                .time
                {
                    color: #FF4D3F;
                }
            }
            .row.done
            {
                background-color: #1BBE86;

                .time
                {
                    color: #1BBE86;
                }
            }
            .row-add
            {
                flex: 0 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #3375F4;
                border-radius: 4px;
                color: #3375F4;
                cursor: pointer;
                transition: all ease-in-out 0.3s;
            }
            .row-add:hover
            {
                border-color: darken(#3375F4, 10%);
                color: darken(#3375F4, 10%);
            }
        }

        .add-btn
        {
            height: calc(100% - 21px);
            padding: 10px;

            .container
            {
                opacity: 0;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #3375F4;
                border-radius: 4px;
                font-size: 24px;
                color: #3375F4;
                cursor: pointer;
                transition: opacity ease-in-out 0.3s;
            }
            .container:hover
            {
                opacity: 1;
            }
        }
    }
}
</style>