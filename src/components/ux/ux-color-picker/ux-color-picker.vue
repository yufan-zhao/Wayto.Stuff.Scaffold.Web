<template>
    <div class="ux-color-picker" ref="colorPcikerContainer">
        <input class="color ux-color-picker-input" ref="colorPickerInput" :value="valueCopy" readonly />
    </div>
</template>

<script lang="ts">
import { component, View, config, watch } from "uxmid-vue-web";
import { ResourceUtils } from "src/common/utils";

@component
export default class UxColorPicker extends View
{
    @config({required: true, type: String, default: ""})
    protected value: string;

    protected valueCopy: string = "";

    @watch("value", {immediate: true})
    protected valueWatcher(val: string)
    {
        this.valueCopy = val;
    }

    protected emitInput()
    {
        this.$emit("input", this.valueCopy);
        console.log(this.valueCopy);
    }

    protected mounted()
    {
        const _this = this;
        const jsColorPicker = (<any>window).jsColorPicker;

        let colors = jsColorPicker(
            "input.color",
            {
                customBG: "#222",
                readOnly: false,
                // patch: false,
                appendTo: this._colorPickerContainer,
                init: function(elm, colors)
                {
                    // colors is a different instance (not connected to colorPicker)
                    elm.style.backgroundColor = elm.value;
                    elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? "#222" : "#ddd";
                },
                displayCallback: function(colors, mode, options)
                {
                    _this.valueCopy = "#" + colors.HEX;
                    _this.emitInput();
                }
            }
        );
    }

    private get _colorPickerContainer()
    {
        return this.$refs["colorPcikerContainer"] as any;
    }

    private get _colorPickerInput()
    {
        return this.$refs["colorPickerInput"] as any;
    }
}
</script>

<style lang="less">
.cp-app.alpha-bg-w
{
    left: 0 !important;
    top: 36px !important;
    z-index: 1900;
}

.ux-color-picker
{
    display: block;

    .ux-color-picker-input
    {
        cursor: pointer;
    }
}
</style>