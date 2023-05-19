<template>
    <div class="u-date">
        <i-datePicker :type="typeName" transfer transfer-class-name="date-color" :options="limit ? options2 : {}" :value="startTime" @on-change="(date) =>onDateChange('startTime', date)" :placeholder="placeholders[0]" ></i-datePicker>
        <span class="split"></span>
        <i-datePicker :type="typeName" transfer transfer-class-name="date-color" :options="limit ? options : {}" :value="endTime"   @on-change="(date) =>onDateChange('endTime', date)" :placeholder="placeholders[1]" ></i-datePicker>
        <i class="ivu-icon ivu-icon-ios-calendar-outline" v-show="!(isShowClearBtn && clearable)" @mouseover="isShowClearBtn = true"></i>
        <i class="ivu-icon ivu-icon-ios-close-circle" v-show="isShowClearBtn && clearable" @click="onClearDate"  @mouseleave="isShowClearBtn = false" ></i>
    </div>
</template>

<script lang="ts">
import { component, config, Component } from "uxmid-vue-web";
import dayjs from "dayjs";

@component
export default class Date extends Component
{
    /**
     * 是否显示清除按钮
     * @member
     * @protected
     * @returns boolean
     */
    protected isShowClearBtn: boolean = false;

    /**
     * 时间选择限制
     * @protected
     */
    protected options: any = {};
    /**
     * 时间选择限制
     * @protected
     */
    protected options2: any = {};

    /**
     * 开始时间
     * @member
     * @protected
     * @returns string
     */
    protected get startTime(): string
    {
        return this.value[0] || "";
    }

    /**
     * 结束时间
     * @member
     * @protected
     * @returns string
     */
    protected get endTime(): string
    {
        return this.value[1] || "";
    }

    /**
     * 日期提示
     * @config
     * @protected
     */
    @config({type: Array, default: () => (["",""])})
    public value: Array<any>;

    /**
     * 日期提示
     * @config
     * @protected
     */
    @config({type: Array, default: () => (["",""])})
    public placeholders: Array<any>;

    /**
     * 是否显示清除按钮
     * @config
     * @protected
     */
    @config({type: Boolean, default: true})
    public clearable: boolean;
    /**
     * 
     * @config
     * @protected
     */
    @config({type: String ,default: "date"})
    public typeName: any;

    /**
     * 是否开启限制时间选择
     * @config
     * @protected
     */
    @config({type: Boolean ,default: true})
    public limit: boolean;
    
    /**
     *  日期选择变化
     * @protected
     * @return void
     */
    protected onDateChange(str: string, date: any): void
    {
        let startTime = "";
        let endTime = "";
        if(str === "startTime")
        {
            startTime = date && dayjs(date).format("YYYY-MM-DD") || "";
            endTime =  this.endTime;
        }
        else
        {
            startTime = this.startTime;
            endTime = date && dayjs(date).format("YYYY-MM-DD") || "";
        }
        this.$emit("input", [startTime, endTime]);
        this.$emit("on-change", [startTime, endTime]);
    }

    /**
     *  清除日期
     * @protected
     * @return void
     */
    protected onClearDate(): void
    {
        this.$emit("input", ["", ""]);
        this.$emit("on-change", ["", ""]);
    }

    /**
     * vue钩子
     * @protected
     */
    protected mounted()
    {
        const options: any =
        {
            disabledDate: date => {
                
                // console.log(dayjs(dayjs((this.startTime !== "") && this.startTime).subtract(1, "month")));
                if(this.typeName === "month")
                {
                    // return date && date.valueOf() <=  dayjs(dayjs((this.startTime !== "") && this.startTime).subtract(1, "month")) ;
                    if(this.startTime !== "")
                    {
                        return date && date.valueOf() < dayjs(dayjs((this.startTime !== "") && this.startTime)) || date && date.valueOf() > dayjs(dayjs((this.startTime !== "") && this.startTime)).add(1, "year") || date && date.valueOf() > dayjs() ;
                    }else
                    {
                        return date && date.valueOf() > dayjs();
                    }
                    
                }else
                {
                    return date && date.valueOf() < dayjs((this.startTime !== "") && this.startTime);
                }
            }
        };
        this.options = options;
        const options2: any =
        {
            disabledDate: date => {
                
                if(this.typeName === "month")
                {
                    if(this.endTime !== "")
                    {
                        return date && date.valueOf() < dayjs(dayjs(dayjs((this.endTime !== "") && this.endTime))).subtract(1, "year") || date && date.valueOf() > dayjs() || date && date.valueOf() > dayjs(dayjs(dayjs((this.endTime !== "") && this.endTime)));
                    }else
                    {
                        return date && date.valueOf() > dayjs();
                    }
                    
                }else
                {
                    return ;
                }
            }
        };
        this.options2 = options2;
    }

}
</script>

<style lang="less">
    @import "./style.less";
    .ivu-picker-panel-body-wrapper
    {
        .ivu-picker-panel-body
        {
            .ivu-date-picker-header
            {
                
                .ivu-picker-panel-icon-btn
                {
                    color: #000 !important;
                }
            }
        }
    }
</style>
