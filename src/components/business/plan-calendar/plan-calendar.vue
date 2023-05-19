<template>
    <div class="plan-calendar-component">
        <vc-calendar
            class="custom-v-calendar"
            disable-page-swipe
            is-expanded
            @update:from-page="onFromPage"
        >
            <template v-slot:day-content="{ day }">
                <div class="day-content-item">
                    <slot name="day-content" :day="day"></slot>
                </div>
            </template>
        </vc-calendar>
    </div>
</template>

<script lang="ts">
import { component, View, watch } from "uxmid-vue-web";
import dayjs from "dayjs";

@component
export default class PlanCalendar extends View
{
    protected months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    protected onFromPage(page: any)
    {
        let days = dayjs(`${String(page.year)}-${this.months[page.month - 1]}`, "YYYY-MM").endOf("month").date();
        let startDateStr = `${String(page.year)}-${this.months[page.month - 1]}-01`;
        let endDateStr = `${String(page.year)}-${this.months[page.month - 1]}-${String(days)}`;
        this.$emit("on-month-change", startDateStr, endDateStr);
    }
}
</script>

<style lang="less" scoped>
@{deep}.custom-v-calendar.vc-container
{
    @day-border: 1px solid #b8c2cc;
    @day-border-highlight: 1px solid #b8c2cc;
    @day-width: 90px;
    @day-height: 150px;
    @weekday-bg: #f8fafc;
    @weekday-border: 1px solid #eaeaea;

    border-radius: 0;
    width: 100%;
    & .vc-header
    {
        background-color: #f1f5f8;
        padding: 10px 0;
    }
    & .vc-weeks
    {
        padding: 0;
    }
    & .vc-weekday
    {
        background-color: @weekday-bg;
        border-bottom: @weekday-border;
        border-top: @weekday-border;
        padding: 5px 0;
    }
    & .vc-day {
        padding: 0 5px 3px 5px;
        text-align: left;
        height: @day-height;
        min-width: @day-width;
        background-color: white;
        &.weekday-1,
        &.weekday-7 {
            background-color: #eff8ff;
        }
        &:not(.on-bottom) {
            border-bottom: @day-border;
            &.weekday-1 {
                border-bottom: @day-border-highlight;
            }
        }
        &:not(.on-right) {
            border-right: @day-border;
        }
    }
    & .vc-day-dots {
        margin-bottom: 5px;
    }
}

@{deep}.day-content-item
{
    height: 100%;
}
</style>