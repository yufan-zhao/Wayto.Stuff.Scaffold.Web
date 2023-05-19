type SpecialRuleModule =
{
    /**
     * 模块名称
     */
    moduleName?: string;
    /**
     * 模块id
     */
    moduleId?: number;
    /**
     * 体系类型id
     */
    specialTypeId?: number;
    /**
     * 二级体系项列表
     */
    secondSpecials?: Array<{id?: number; name?: string; weight?: number}>;
    /**
     * 模块包含的体系列表
     */
    specials?: Array<any>;
};

export
{
    SpecialRuleModule
};
