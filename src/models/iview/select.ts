type IViewSelectOption =
{
    /**
     * 选项值，默认根据此属性值进行筛选，必填
     */
    value: string | number;
    /**
     * 选项显示的内容，默认会读取 slot，无 slot 时，优先读取该 label 值，无 label 时，读取 value。当选中时，选择器会显示 label 为已选文案。大部分情况不需要配置此项，直接写入 slot 即可，在自定义选项时，该属性非常有用。
     */
    label?: string;
    /**
     * 是否禁用当前项，默认false
     */
    disabled?: boolean;
    /**
     * 设置后，在多选时，标签内容会优先显示设置的值
     * 4.0.0
     */
    tag?: string | number;
};

export default IViewSelectOption;
