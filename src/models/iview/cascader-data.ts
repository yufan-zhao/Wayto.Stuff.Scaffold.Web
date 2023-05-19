type IViewCascaderData =
{
    /**
     * 描述
     */
    label?: string;
    /**
     * 选项值
     */
    value: number | string;
    /**
     * 子节点列表
     */
    children?: Array<IViewCascaderData>;
    /**
     * 允许额外的业务字段
     */
    [property: string]: any;
};

export default IViewCascaderData;
