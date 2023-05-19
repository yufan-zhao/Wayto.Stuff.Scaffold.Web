import { SpecialNode } from "./special";

/**
 * 评估打分中的体系节点
 */
type ScoreSpecialNode = SpecialNode &
{
    /**
     * 诊治id
     */
    consultId: number;
    /**
     * 实得分
     */
    actualScore?: number;
    /**
     * 是否甩项
     */
    label?: boolean;
    /**
     * 隐患统计数量
     */
    dangerCount?: number;
    /**
     * 甩项统计数量
     */
    labelCount?: number;
};

/**
 * 评估打分中的体系节点下的隐患
 */
type ScoreSpecialDanger =
{
    /**
     * id
     */
    id?: number;

    /**
     * 检查项id
     */
    checkId?: number;

    /**
     * 评分体系类型id
     */
    scoreSpecialId?: number;

    /**
     * 可选问题隐患等级，由系统设置中配置，name是问题隐患等级编码中文，value是对应的id
     */
    dangerLevelOptions?: Array<{name: string; value: number}>;

    /**
     * 问题隐患等级
     */
    dangerLevel?: number;

    /**
     * 甩项
     */
    label?: boolean;

    /**
     * 问题描述（只读）
     */
    content?: string;

    /**
     * 问题描述
     */
    problemDescribe?: string;

    /**
     * 问题图片/视频
     */
    mediaFiles?: Array<any>;

    /**
     * 整改建议
     */
    rectifySuggestion?: string;

    /**
     * 整改时间（天数）
     */
    rectifyDay?: number;

    /**
     * 扣分
     */
    deductPoints?: number;
    /**
     * 是否标记重点
     */
    tag?: boolean;
};

export
{
    ScoreSpecialNode,
    ScoreSpecialDanger
};
