import TreeNode from "src/models/iview/tree-node";

/**
 * 体系类型
 * @type
 */
type SpecialType =
{
    /**
     * 是否是客户体系
     */
    isCustomer: boolean;
    /**
     * 是否需要正负面反馈
     */
    isList?: boolean;
    /**
     * 如果isCustomer为true，应携带客户id
     */
    customerId?: number;
    /**
     * 体系id
     */
    id: number;
    /**
     * 体系名称
     */
    name: string;
    /**
     * 体系编码
     */
    code: string;
};

/**
 * 体系节点
 */
type SpecialNode = TreeNode &
{
    /**
     * 体系类型id
     */
    specialTypeId: number;
    /**
     * 体系节点id
     */
    id?: number;
    /**
     * 体系节点父id
     */
    parentId: number;
    /**
     * 层级-从1开始
     */
    level: number;
    /**
     * 子节点
     */
    children?: Array<SpecialNode>;
    /**
     * 体系节点名称
     */
    name: string;
    /**
     * 体系编号
     */
    code?: string;
    /**
     * 应得分
     */
    deservedScore?: number;
    /**
     * 权重-百分比
     * 第2，3级才有
     */
    weight?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 是否标记重点
     */
    tag?: boolean;
};

type SpecialNodeCascader = SpecialNode &
{
    /**
     * 级联选择中的值
     */
    value: number;
    /**
     * 级联选择中的名字
     */
    label: string;
};

/**
 * 体系树节点下的隐患项
 */
type SpecialDanger =
{
    /**
     * 体系树节点id
     */
    specialNodeId?: number;
    /**
     * 体系隐患id
     */
    id?: number;
    /**
     * 内容
     */
    content: string;
    /**
     * 问题隐患等级
     * 问题隐患等级，格式 1,2,3
     */
    dangerLevels?: Array<number>;
    /**
     * 问题隐患等级中文名
     */
    dangerLevelAlias?: string;
    /**
     * 状态
     * 启用/禁用
     */
    enable: boolean;
    /**
     * 是否标记重点
     */
    tag: boolean;
};

/**
 * 规则下的子规则列表项
 */
type SpecialRuleInfo =
{
    /**
     * id
     */
    id?: number;
    /**
     * 分值名称
     */
    ruleName?: string;
    /**
     * 体系类型id
     */
    specialTypeId: number;
    /**
     * 规则id
     */
    ruleId: number;
    /**
     * 一级体系id
     */
    primarySpecialId: number;
    /**
     * 一级体系名称
     */
    primarySpecialName?: string;
    /**
     * 子规则权重
     */
    weight?: number;
    /**
     * 二级体系id
     */
    secondSpecialId?: number;
    /**
     * 二级体系ids
     */
    secondSpecialIds?: Array<number>;
    /**
     * 二级体系名称
     */
    secondSpecialName?: string;
    /**
     * 二级体系权重
     */
    secondSpecialWeight?: number;
    /**
     * 二级体系索引
     */
    secondSpecialIndex?: number;
    /**
     * 单元格合并信息
     */
    spanInfo?: [number, number];
};

export {
    SpecialType,
    SpecialNode,
    SpecialDanger,
    SpecialRuleInfo,
    SpecialNodeCascader
};
