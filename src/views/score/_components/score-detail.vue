<template>
    <div class="score-detail-view">
        <div class="tabs">
            <span class="tab-item" :class="{active: tabIndex === 0}" @click="onTabChange(0)">总评分表</span>
            <span class="tab-item" :class="{active: tabIndex === 1}" @click="onTabChange(1)">评分详情</span>
        </div>

        <div class="tab-content" :class="{active: tabIndex === 0}">
            <div class="total-rule" v-for="(item, i) in data1" :key="i">
                <p class="header">{{item.ruleName}}</p>
                <i-table
                    class="score-detail-table"
                    :columns="column1"
                    :data="item.tableList"
                    disabled-hover
                    :span-method="handleSpan"
                    border
                ></i-table>
            </div>
        </div>
        <div class="tab-content" :class="{active: tabIndex === 1}">
            <!-- <i-collapse style="margin-top: 10px;">
                <i-panel v-for="(item, i) in data2" :key="i" :name="String(item.ruleId)">
                    {{item.ruleName}}
                    <div slot="content">
                        <ScoreDetailSpecials
                            :consultId="consultId"
                            :specialTypeId="specialTypeId"
                            :specialIds="specialIds"
                        ></ScoreDetailSpecials>
                    </div>
                </i-panel>
            </i-collapse> -->
            <div style="padding-right:15px;padding-bottom:30px;margin-bottom: 30px;">
                <ScoreDetailSpecials
                    :consultId="consultId"
                    :specialTypeId="specialTypeId"
                    :specialIds="specialIds"
                ></ScoreDetailSpecials>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import ScoreDetailExpand from "./score-detail-expand.vue";
import ScoreDetailSpecials from "./score-detail-specials.vue";
import { SpecialCustomRruleService } from "src/services";
import { service } from "src/common/decorator";

@component({
    components:
    {
        ScoreDetailExpand,
        ScoreDetailSpecials
    }
})
export default class ScoreDetailView extends View
{
    @service("SpecialCustomRruleService")
    protected specialCustomRruleService: SpecialCustomRruleService;

    /**
     * 诊治id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected consultId: number;

    /**
     * 体系类型id
     * @config
     */
    @config({required: true, type: Number, default: -1})
    protected specialTypeId: number;

    /**
     * 体系ids
     * @config
     */
    @config({required: true, type: Array, default: () => []})
    protected specialIds: Array<number>;

    protected tabIndex: number = 0;

    protected column1: Array<any> =
    [
        {
            // title: "模块名称",
            title: "体系项目",
            render: (h, params) =>
            {
                return h("span", params.row.moduleName);
            }
        },
        {
            // title: "模块权重",
            title: "权重",
            render: (h, params) =>
            {
                if (params.row.moduleName === "合计")
                {
                    return h("span", "");
                }
                else if (params.row.moduleName === "正负清单得分")
                {
                    return h("span", {
                        style:
                        {
                            "display": "inline-block",
                            "width": "100%",
                            "text-align": "center"
                        }
                    }, `加分项：+${params.row.plusScore}`);
                }
                else
                {
                    return h("span", params.row.moduleWeight + "%");
                    
                }
                
            }
        },
        {
            // title: "一级体系",
            title: "子体系",
            render: (h, params) =>
            {
                if (params.row.moduleName === "合计")
                {
                    return h("span", "");
                }
                else if (params.row.moduleName === "正负清单得分")
                {
                    return h("span", {
                        style:
                        {
                            "display": "inline-block",
                            "width": "100%",
                            "text-align": "center"
                        }
                    }, `加分项：+${params.row.plusScore}`);
                }
                else
                {
                    if (params.row.type)
                    {
                        return h("span", "-");
                    }
                    else
                    {
                        return h("span", params.row.parentSpecial.name);
                    }
                    
                }
            }
        },
        {
            // title: "体系权重",
            title: "权重",
            render: (h, params) =>
            {
                if (params.row.moduleName === "合计")
                {
                    return h("span", "");
                }
                else if (params.row.moduleName === "正负清单得分")
                {
                    return h("span", {
                        style:
                        {
                            "display": "inline-block",
                            "width": "100%",
                            "text-align": "center"
                        }
                    }, `减分项：-${params.row.minusScore}`);
                }
                else
                {
                    // return h("span", params.row.parentSpecialWeight + "%");
                    if (params.row.type)
                    {
                        return h("span", "-");
                    }
                    else
                    {
                        return h("span", params.row.parentSpecialWeight + "%");
                    }
                }
                
            }
        },
        {
            title: "分项得分",
            render: (h, params) =>
            {
                if (params.row.moduleName === "合计")
                {
                    if (typeof params.row.totalScore === "number")
                    {
                        return h("span", Number(params.row.totalScore).toFixed(2));
                    }
                    else
                    {
                        return h("span", "-");
                    }
                }
                else if (params.row.moduleName === "正负清单得分")
                {
                    return h("span", {
                        style:
                        {
                            "display": "inline-block",
                            "width": "100%",
                            "text-align": "center"
                        }
                    }, `减分项：-${params.row.minusScore}`);
                }
                else
                {
                    let score = params.row.parentActualScore;
                    if (typeof score === "number")
                    {
                        return h("span", score.toFixed(2));
                    }
                    else
                    {
                        return h("span", "-");
                    }
                }
                
            }
        }
    ];

    protected data1: Array<any> = [];

    protected column2: Array<any> =
    [
        {
            type: "expand",
            width: 50,
            render: (h, params) =>
            {
                return h(ScoreDetailExpand, {
                    props:
                    {
                        data: params.row.subs || []
                    }
                });
            }
        },
        {
            title: "体系",
            key: "name"
        },
        {
            title: "得分情况",
            key: "value"
        }
    ];

    protected data2: Array<any> =
    [
        {
            name: "1.工程现场安全生产",
            value: "(应得分:230分)(实际得分:175分)",
            subs:
            [
                {
                    name: "1.1基坑工程",
                    value: "(应得分:70分)(实际得分:44分)",
                    subs:
                    [
                        {
                            name: "1.1.1基坑支护",
                            value: "(应得分:10分)(实际得分:7分)",
                            subs:
                            [
                                {
                                    name: "1.基坑支护结构不符合设计及专项施工方案要求.扣5分",
                                    value: ""
                                },
                                {
                                    name: "2.应放坡开挖而未放坡或放坡坡率不符合方案要求，每处扣5分",
                                    value: "扣分:(3分)"
                                },
                                {
                                    name: "3.支护结构出现开裂、明显变形，基坑局部坍塌，每处扣3分",
                                    value: ""
                                },
                                {
                                    name: "4.其他不符合要求的情况，根据问题等级扣分。（一级扣10分，二级扣7分，三级扣5分，四级扣3分）",
                                    value: ""
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    protected onTabChange(index: number)
    {
        this.tabIndex = index;
    }

    protected handleSpan({ row, column, rowIndex, columnIndex })
    {
        if (row.moduleName === "正负清单得分")
        {
            if (columnIndex === 1 || columnIndex === 3)
            {
                return [1, 2];
            }
            if (columnIndex === 2 || columnIndex === 4)
            {
                return [1, 0];
            }
        }
        else
        {
            if (columnIndex === 0 || columnIndex === 1)
            {
                return row.spanInfo1;
            }
        }
    }

    @watch("consultId", {immediate: true})
    protected consultIdWatcher(val: number)
    {
        if (typeof val === "number" && val > 0)
        {
            this.initData();
        }
    }

    private async initData()
    {
        const res = await this.specialCustomRruleService.getCustomRuleScore({
            consultId: this.consultId,
            specialTypeId: this.specialTypeId
        });

        this.data1 = this.resolveTotalData(res);
    }

    private resolveTotalData(data: Array<any>)
    {
        let ruleList = [];

        data.forEach(item =>
        {
            let target: any = {};
            target.ruleName = item.name;
            target.ruleId = item.id;
            target.moduleList = [];
            target.tableList = [];

            item.ruleModelInfoVos.forEach(jtem =>
            {
                let subTarget =
                {
                    moduleId: jtem.id,
                    moduleName: jtem.modelName,
                    primarySpecials: []
                };

                if (jtem.type)
                {
                    let lastTarget: any =
                    {
                        parentSpecial: null,
                        sonSpecials: null
                    };
                    subTarget.primarySpecials.push(lastTarget);
                    target.tableList.push({
                        ruleId: item.id,
                        ruleName: item.name,
                        ruleWeight: item.weight,
                        moduleId: jtem.id,
                        moduleName: jtem.modelName,
                        moduleWeight: jtem.weight,
                        parentSpecialWeight: jtem.weight,
                        parentActualScore: jtem.actualScore,
                        parentSpecial: null,
                        sonSpecials: null,
                        type: jtem.type
                    });
                }
                else
                {
                    if (Array.isArray(jtem.modelInfoVos))
                    {
                        jtem.modelInfoVos.forEach(ktem =>
                        {
                            let lastTarget: any =
                            {
                                parentSpecial: ktem.parentSpecial,
                                sonSpecials: ktem.sonSpecials
                            };
                            subTarget.primarySpecials.push(lastTarget);
                            target.tableList.push({
                                ruleId: item.id,
                                ruleName: item.name,
                                ruleWeight: item.weight,
                                moduleId: jtem.id,
                                moduleName: jtem.modelName,
                                moduleWeight: jtem.weight,
                                parentSpecialWeight: ktem.weight,
                                parentActualScore: ktem.actualScore,
                                parentSpecial: ktem.parentSpecial,
                                sonSpecials: ktem.sonSpecials
                            });
                        });
                    }
                    else
                    {
                        console.warn("此评分模块未有对应体系，请检查配置", jtem);
                    }
                }

                target.moduleList.push(subTarget);

                if (Array.isArray(target.tableList) && target.tableList.length > 0)
                {
                    let pointer1 = target.tableList[0];
                    let stackNum1 = 1;
                    for (let i = 1; i < target.tableList.length; i++)
                    {
                        let item = target.tableList[i];
                        if (pointer1.moduleId !== item.moduleId)
                        {
                            pointer1.spanInfo1 = [stackNum1, 1];
                            stackNum1 = 1;
                            pointer1 = target.tableList[i];
                        }
                        else
                        {
                            item.spanInfo1 = [1, 0];
                            stackNum1++;
                        }

                        if (i === target.tableList.length - 1)
                        {
                            pointer1.spanInfo1 = [stackNum1, 1];
                        }
                    }
                }
                // console.log(target.ruleName, target);
            });
            if (item.isList && item.itemInfoScore)
            {
                target.tableList.push({
                    moduleName: "正负清单得分",
                    minusScore: item.itemInfoScore.minusScore,
                    plusScore: item.itemInfoScore.plusScore
                });
            }
            if (target.tableList.length > 0)
            {
                target.tableList.push({
                    ruleId: undefined,
                    ruleName: undefined,
                    ruleWeight: undefined,
                    moduleId: undefined,
                    moduleName: "合计",
                    parentSpecial: undefined,
                    sonSpecials: undefined,
                    totalScore: item.actualScore
                });
            }
            
            ruleList.push(target);
        });
        return ruleList;
    }
}
</script>

<style lang="less" scoped>
.score-detail-view
{
    padding: 20px;

    .tabs
    {
        display: flex;
        border-bottom: 1px solid #dcdee2;

        .tab-item
        {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 96px;
            border-bottom: 2px solid #fff;
            cursor: pointer;
        }
        .tab-item.active
        {
            color: #2d8cf0;
            border-bottom: 2px solid #2d8cf0;
        }
        .tab-item:hover
        {
            color: #2d8cf0;
        }
    }

    .tab-content
    {
        display: none;
    }
    .tab-content.active
    {
        display: block;
    }
}

.total-rule
{
    padding: 20px 0;

    .header
    {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
    }
}

@{deep}.ivu-table-expanded-cell
{
    padding: 0;
}

.score-detail-table
{
    margin-top: 0 !important;

    @{deep}.ivu-table.ivu-table-default
    {
        .ivu-table-header
        {

        }
        .ivu-table-body
        {
            .ivu-table-row
            {
                .ivu-table-cell
                {
                    background-color: #fff;
                }
            }
            
        }
    }
}
</style>