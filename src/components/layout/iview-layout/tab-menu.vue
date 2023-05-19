<template>
    <tabs class="custom-tabs" type="card">
        <i-tab-pane label="标签一"></i-tab-pane>
        <i-tab-pane label="标签二"></i-tab-pane>
    </tabs>
</template>

<script lang="ts">
import { component, Component, config, watch } from "uxmid-vue-web";

@component
export default class TabMenu extends Component
{

}
</script>

<style lang="less" scoped>
.custom-tabs
{
    @{deep}.ivu-tabs-bar
    {
        margin-bottom: 0;

        .ivu-tabs-nav-container
        {
            height: 51px;

            .ivu-tabs-nav-wrap
            {
                position: absolute;
                bottom: 0;
                padding: 0 30px;
            }
        }
    }
}
</style>
