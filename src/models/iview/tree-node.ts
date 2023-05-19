/**
 * iview tree组件节点相关的保留配置字段
 */
type TreeNode =
{
    /**
     * 文字内容
     */
    title?: string;
    /**
     * 是否展开
     * 默认false
     */
    expand?: boolean;
    /**
     * 禁掉响应
     * 默认false
     */
    disabled?: boolean;
    /**
     * 禁掉 checkbox
     * 默认false
     */
    disableCheckbox?: boolean;
    /**
     * 是否选中子节点
     * 默认false
     */
    selected?: boolean;
    /**
     * 是否勾选(如果勾选，子节点也会全部勾选)
     * 默认false
     */
    checked?: boolean;
    /**
     * 子节点属性数组
     */
    children?: Array<any>;
    /**
     * 自定义当前节点渲染内容，见示例
     */
    render?: Function;
    /**
     * 是否支持右键菜单
     * 默认false
     */
    contextmenu?: boolean;
    /**
     * 异步节点
     * 标识当前是否在加载中
     */
    loading?: boolean;
};

export default TreeNode;
