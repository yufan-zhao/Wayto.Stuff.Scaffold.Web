<template>
    <div class="workbench-view">
        <amap ref="amap"
            :mapStyle="applicationContext.settings.amapSettings.style"
            :center="mapCenter"
        >
            <template v-for="item in projectMapList.projectList">
                <!-- <amap-text-marker class="amap-textsss" 
                    :key="item.id" 
                    :styles="markeRedStyles.textStyle"
                    :position="[item.longitude,item.latitude]" 
                    :text="item.projectName"
                >

                </amap-text-marker> -->
                <amap-marker :key="item.id" :position="[item.longitude,item.latitude]" >
                                    <div>4444</div>
                </amap-marker>
                <amap-simple-marker :key="item.id +'0'"
                    :iconStyle="markeRedStyles.iconStyle"
                    :position="[item.longitude,item.latitude]" 
                >

                </amap-simple-marker>
            </template>
        </amap>

        <section class="statis-left active">
            <div class="statis-item mb15">
                <div class="statis-item-title d-f">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <h3>项目类型</h3>

                    <div class="statis-item-status">
                        <span :class="showTypeProject === 2 ? 'active' : ''" @click="changeTabs(2,'showTypeProject')">全部</span>
                        <span :class="showTypeProject === 0 ? 'active' : ''" @click="changeTabs(0,'showTypeProject')">施工中</span>
                        <span :class="showTypeProject === 1 ? 'active' : ''" @click="changeTabs(1,'showTypeProject')">已完结</span>
                    </div>
                </div>

                <div>
                    <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="projectTypeGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                </div>
            </div>

            <div class="statis-item mb15">
                <div class="statis-item-title d-f">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <h3>项目诊治</h3>

                    <!-- <div class="statis-item-status">
                        <span>全部</span>
                        <span>施工中</span>
                        <span>已完结</span>
                    </div> -->
                </div>

                <div>
                    <fw-echarts :width="388" :height="200"  :options="options"></fw-echarts>
                 <!-- <u-line-chart :wH="[490,250]" :data="[{type: 'bar', name: '客户户数', data: [10,20,30,50,60,80]}]" ></u-line-chart> -->

                </div>
            </div>

            <div class="statis-item">
                <div class="statis-item-title d-f">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                    <h3>隐患统计</h3>

                    <div class="statis-item-status">
                        <span :class="showHiddenTime === 1 ? 'active' : ''" @click="changeTabs(1,'showHiddenTime')">全部</span>
                        <span :class="showHiddenTime === 2 ? 'active' : ''" @click="changeTabs(2,'showHiddenTime')">近一周</span>
                        <span :class="showHiddenTime === 3 ? 'active' : ''" @click="changeTabs(3,'showHiddenTime')">近一月</span>
                        <span :class="showHiddenTime === 4 ? 'active' : ''" @click="changeTabs(4,'showHiddenTime')">近一年</span>
                    </div>
                </div>

                <div>
                    <div class="type-tap">
                        <p :class="showHiddenType === 1 ? 'active' : ''" @click="changeTabs(1,'showHiddenType')">闭合情况</p>
                        <p :class="showHiddenType === 2 ? 'active' : ''" @click="changeTabs(2,'showHiddenType')">体系分类</p>
                    </div>
                    <u-pie-chart :data="hiddenTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                </div>
            </div>
        </section>

        <section class="statis-right active">
            <section class="statis-right-tabs">
                <div class="statis-right-tabs-btn" :class="showTabs === 136 ? 'active' : ''" @click="changeTabs(136,'showTabs')"><span>市政</span></div>
                <div class="statis-right-tabs-btn" :class="showTabs === 135 ? 'active' : ''" @click="changeTabs(135,'showTabs')"><span>房建</span></div>
            </section>

            <section class="statis-wrap" v-if="showTabs === 136">
                <div class="statis-right-content">
                    <div class="statis-right-time">
                        <span :class="showRightTime === 1 ? 'active' : ''" @click="changeTabs(1,'showRightTime')">全部</span>
                        <span :class="showRightTime === 2 ? 'active' : ''" @click="changeTabs(2,'showRightTime')">近一周</span>
                        <span :class="showRightTime === 3 ? 'active' : ''" @click="changeTabs(3,'showRightTime')">近一月</span>
                        <span :class="showRightTime === 4 ? 'active' : ''" @click="changeTabs(4,'showRightTime')">近一年</span>
                    </div>
                </div>

                <div class="statis-item statis-item-1">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>排名情况</h3>
                    </div>

                    <div>
                        <div class="type-tap">
                            <p :class="showRightUnit === 1 ? 'active' : ''" @click="changeTabs(1,'showRightUnit')">施工单位 综合排名</p>
                            <p :class="showRightUnit === 2 ? 'active' : ''" @click="changeTabs(2,'showRightUnit')">监理单位 综合排名</p>
                            <p :class="showRightUnit === 3 ? 'active' : ''" @click="changeTabs(3,'showRightUnit')">施工单位 综合排名</p>
                            <p :class="showRightUnit === 4 ? 'active' : ''" @click="changeTabs(4,'showRightUnit')">监理单位 综合排名</p>
                        </div>
                        <i-table class="table-normal" :data="data" :columns="unitColumuns"></i-table>
                    </div>
                </div>
                <div class="statis-item pt10">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>履职情况</h3>
                    </div>

                    <div>
                        <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                    </div>
                </div>

                <div class="statis-item">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>隐患情况</h3>
                    </div>

                    <div>
                        <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                    </div>
                </div>

            </section>

            <section class="statis-wrap" v-if="showTabs === 135">
                <div class="statis-right-content">
                    <div class="statis-right-content">
                    <div class="statis-right-time">
                        <span :class="showRightTime === 1 ? 'active' : ''" @click="changeTabs(1,'showRightTime')">全部</span>
                        <span :class="showRightTime === 2 ? 'active' : ''" @click="changeTabs(2,'showRightTime')">近一周</span>
                        <span :class="showRightTime === 3 ? 'active' : ''" @click="changeTabs(3,'showRightTime')">近一月</span>
                        <span :class="showRightTime === 4 ? 'active' : ''" @click="changeTabs(4,'showRightTime')">近一年</span>
                    </div>
                </div>
                </div>

                <div class="statis-item statis-item-1">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>排名情况</h3>
                    </div>

                    <div>
                        <div class="type-tap">
                            <p :class="showRightUnit === 1 ? 'active' : ''" @click="changeTabs(1,'showRightUnit')">施工单位 综合排名</p>
                            <p :class="showRightUnit === 2 ? 'active' : ''" @click="changeTabs(2,'showRightUnit')">监理单位 综合排名</p>
                            <p :class="showRightUnit === 3 ? 'active' : ''" @click="changeTabs(3,'showRightUnit')">施工单位 综合排名</p>
                            <p :class="showRightUnit === 4 ? 'active' : ''" @click="changeTabs(4,'showRightUnit')">监理单位 综合排名</p>
                        </div>
                        <i-table class="table-normal" :data="unitDdata" :columns="unitColumuns"></i-table>
                    </div>
                </div>
                <div class="statis-item pt10">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>履职情况</h3>
                    </div>

                    <div>
                        <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                    </div>
                </div>

                <div class="statis-item">
                    <div class="statis-item-title d-f">
                        <img src="src/assets/application/statis-img.png" alt="" srcset="" class="statis-item-icon">
                        <h3>隐患情况</h3>
                    </div>

                    <div>
                        <u-pie-chart :data="projectTypeData" :wH="[388,200]" :graphic="hiddenGraphic" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                    </div>
                </div>

            </section>
            
        </section>

        <section class="map-window">
            <h3>深圳科学高中新建项目</h3> 
            <i-icon type="md-close" class="close-i" size="20"/>
            <div class="map-window-status">
                <span :class="showMapAct === 1 ? 'active' : ''" @click="changeTabs(1,'showMapAct')">概述</span>
                <span :class="showMapAct === 2 ? 'active' : ''" @click="changeTabs(2,'showMapAct')">隐患统计</span>
            </div>
            <section v-if="showMapAct === 1" class="map-window-warp">
                <div class="map-window-title d-f">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="map-window-icon">
                    <h3>排名情况</h3>
                </div>
                <i-form class="u-form map-window-form" label-position="left"  style="width: 100%;">
                    <i-row type="flex" justify="start">
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="项目类型：">xxx</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="项目地址：">xxx</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="施工单位：">xxx</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="监理单位：">xxx</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="工机具：">xxx</i-form-item>
                        </i-col>

                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="施工人员：">xxx</i-form-item>
                        </i-col>
                        <i-col class-name="u-col" span="24">
                            <i-form-item class="u-form-item" label="监理人员：">xxx</i-form-item>
                        </i-col>
                        
                    </i-row>
                </i-form>
                <div class="map-window-title d-f">
                    <img src="src/assets/application/statis-img.png" alt="" srcset="" class="map-window-icon">
                    <h3>诊治统计</h3>
                </div>
                <div class="map-window-happen">
                    <div>
                        <h4>3</h4>
                        <p>巡查次数</p>
                    </div>
                    <div>
                        <h4>17</h4>
                        <p>问题总数</p>
                    </div>
                    <div>
                        <h4>17</h4>
                        <p>待整改</p>
                    </div>
                    <div>
                        <h4>17</h4>
                        <p>已闭合</p>
                    </div>
                </div>
            </section>
            <section v-if="showMapAct === 2" class="map-window-warp">
                <div class="map-window-hidden">
                    <div>
                        <h4 :style="{color: ''}">17</h4>
                        <p>A级</p>
                    </div>
                    <div>
                        <h4 :style="{color: ''}">17</h4>
                        <p>A级</p>
                    </div>
                    <div>
                        <h4 :style="{color: '#FF9832'}">17</h4>
                        <p>A级</p>
                    </div>
                </div>
                <div>
                    <u-pie-chart :data="projectTypeData" :wH="[388,200]" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                </div>
                <div>
                    <u-pie-chart :data="projectTypeData" :wH="[388,200]" :showLegend="true" :showLine="true" :radius="['38%', '58%']"></u-pie-chart>
                </div>
            </section>
        </section>
    </div>
</template>

<script lang="ts">
import { component } from "uxmid-vue-web";
import CommonView from "src/views/common-view";
import { WorkbenchService } from "src/services";
import { service } from "src/common/decorator";
import dayjs from "dayjs";

@component
export default class StatisticView extends CommonView
{
    @service("WorkbenchService")
    protected workbenchService: WorkbenchService;

    protected mapCenter: Array<number> = [113.90735, 22.538335];
    protected optionColors = ["#37C462","#9686F3","#FF9832","#FF4D3F","#0DD0C5"];
    protected timeRange =
    [
        {startDate: null,endDate: ""},
        {startDate:  dayjs().subtract(1,"week").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate:  dayjs().subtract(1,"month").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")},
        {startDate:  dayjs().subtract(1,"year").format("YYYY-MM-DD"),endDate: dayjs().format("YYYY-MM-DD")}
    ];

    protected markeRedStyles =
    {
        textStyle:
        {
            "background-color": "#FF4D3F",
            "border": "none",
            "color": "#fff",
            "padding": "3px 9px",
            "box-shadow": "0px 1px 1px 0px rgba(0, 0, 0, 0.5)"
        },
        iconStyle:
        {

        }
        
    };

    /**
     * 饼图数据
     * @protected
     * @member
     */
    protected projectTypeData: Array<any> = [{value: 15, name: "市政",ename: "市政"},{value: 15, name: "消防",ename: "消防"}];
    protected hiddenTypeData: Array<any> = [{value: 15, name: "市政",ename: "市政"},{value: 15, name: "消防",ename: "消防"}];
    protected projectTypeSun = 0;

    protected unitDdata: any = [];
    protected optionsXAxis: any = []; // 项目诊治 - 横坐标数据
    protected optionsSeries: any = [];// 项目诊治 - 数据

    protected showTypeProject: number = 2; // 项目类型状态 

    protected showHiddenTime: number = 1; // 隐患时间 切换
    protected showHiddenType: number = 1; // 隐患类型 切换
    
    protected showTabs: number = 136;// 右边tab 切换
    protected showRightTime: number = 1; // 右边tab 时间 切换
    protected showRightUnit: number = 1; // 右边tab 单位 切换

    protected  filters: any =
    {
        projectType:
        {
            status: this.showTypeProject,
            constructionId: null,
            customerId: null
        },
        hidden:
        {
            timeType: this.showHiddenTime,
            customerId: null
        },
        rightTable:
        {
            specialTypeId: this.showTabs, // 135房建  136市政 137消防 138商业
            type: this.showRightUnit // 1施工水平排名，2施工综合排名，3监理水平排名，4监理综合排名
        }
    };

    protected showMapAct: number = 1;

    protected projectMapList: any = [];

    protected get projectTypeGraphic(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  this.projectTypeSun,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "53%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "项目总数",
                    font: " 14px Microsoft YaHei"
                }
            }
        ];
    }

    protected get hiddenGraphic(): any
    {
        return [
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "42%",  // 相对父元素居中
                style: {
                    
                    fill: "#182334",
                    text:  117,
                    font: "bold 22px Microsoft YaHei"
                }
            },
            {
                type: "text",
                left: "center", // 相对父元素居中
                top: "53%",  // 相对父元素居中
                style: {
                    fill: "#5D6673",
                    text: "隐患总数",
                    font: " 14px Microsoft YaHei"
                }
            }
        ];
    }

    protected get options(): any
    {
        return {
            
            tooltip: {
                trigger: "axis"
            },
            legend: {
                left: "center",
                show: true,
                bottom: 0,
                // show: this.showLegend,
                itemWidth: 20,
                itemHeight: 3,
                icon: "circle",
                data: this.optionsXAxis || []
            },
            grid: {
                left: "30px",
                right: "30px",
                bottom: "15px",
                top: "15px",
                containLabel: true
            },
            toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
            },
            xAxis: {
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 0,
                    interval: 0,
                    color: "#5D6673",
                    textStyle: {
                    fontSize: "14px"
                    }
                },
                type: "category",
                boundaryGap: false,
                data: this.optionsXAxis
            },
            yAxis: {
                type: "value",
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: "#A6ABB5"
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                    color: "#F2F4F6"
                    }
                }
            },
            
            series: this.optionsSeries
        };
    }

    protected get unitColumuns(): Array<any>
    {
        return [
            {
                title: "排名",
                render: (h, {row,index}: any) =>
                {
                    let colors = ["#FF4D3F", "#FF9832", "#A533F4"];
                    let top = [require("src/assets/application/top1.png"),require("src/assets/application/top2.png"),require("src/assets/application/top3.png")];
                    return h("div",{class: "statistics-num statistics-num-1"}, [
                        index <= 3 ? h("img", {attr: {src: top[index]}}, "") : h("span",row.sort)
                        
                    ]);
                }
            },
            {
                title: "单位名称",
                render: (h, {row}: any) =>
                {
                    return h("div", row.name);
                }
            },
            {
                title: "得分",
                render: (h, {row}: any) =>
                {
                    return h("div", row.score);
                }
            }
            
        ];

    }
    
    protected get _amap(): any
    {
        return this.$refs["amap"] as any;
    }

    protected changeTabs(num,name)
    {
        this[name] = num;

        switch (name)
        {
            case "showTypeProject":
                this.filters.projectType.status = num;
                this.getProjectTypeStatisticsList();
                break;
            case "showHiddenType":
                this.getWorkbenchHazardCountList();
                break;
            case "showHiddenTime":
                this.getWorkbenchHazardCountList();
            case "showTabs":
                this.getRedHeiBang();
                break;
            case "showRightUnit":
                this.getRedHeiBang();
                break;
            case "showRightTime":
                this.getRedHeiBang();
                break;
            default:
                break;
        }
    }

    protected async created()
    {
        await this.getProjectMapList();
        await this.getProjectTypeStatisticsList();
        await this.getHiddenDangerWorkbenchList();
        await this.getWorkbenchHazardCountList();
        await this.getRedHeiBang();
    }

    // 地图里的项目列表
    protected async getProjectMapList()
    {
        let content = await this.workbenchService.getProjectMapList();
        this.projectMapList = content;
        this.mapCenter = [content.projectList[0].longitude, content.projectList[0].latitude];
    }

    // 项目类型
    protected async getProjectTypeStatisticsList()
    {
        this.projectTypeData = [];
        let content = await this.workbenchService.getProjectTypeStatisticsList({ status: this.filters.projectType.status});
        this.projectTypeSun = content[0].projectSum || 10;
        content.forEach(ele => {
            this.projectTypeData.push({value: ele.projectCount, name: ele.projectTypeName,ename: ele.projectTypeName});
        });
        
    }

    // 项目诊治
    protected async getHiddenDangerWorkbenchList()
    {
        let content = await this.workbenchService.getHiddenDangerWorkbenchList({});
        
        let month = JSON.parse(JSON.stringify(content.hazardWorkRecordVoList)).map(item => item.month + "月");
        this.optionsXAxis = month;
        let lineData = JSON.parse(JSON.stringify(content.hazardWorkRecordVoList)).map(item => item.size);
        let optionsseries = [];
        optionsseries.push(
        {
            name: "",
            type: "line",
            // stack: 'Total',
            color: "#37C462",
            data:  lineData
        });
        let data = content.hazardWorkRecordVoList;

        data.forEach(item =>
        {
            item.level.forEach(ele =>
            {
                item[ele.hazardLevelName] = ele.hazardCount;
            });
        });
        data[0].level.forEach((item,i) =>
        {
            optionsseries.push(
            {
                name: "",
                type: "bar",
                stack: "Total",
                stackStrategy: "all",
                color: this.optionColors[i + 1],
                data: data.map(ele => ele[item.hazardLevelName])
            });
        });
        
        this.optionsSeries = optionsseries;
    }

    // 隐患统计
    protected async getWorkbenchHazardCountList()
    {
        this.hiddenTypeData = [];
        this.hiddenGraphic[0].style.text = 0;
        if(this.showHiddenType === 1)
        {
            let statas = ["待整改","待闭合","已闭合","已闭合"];
            let content = await this.workbenchService.getWorkbenchHazardCountList({...(this.timeRange[this.showHiddenTime - 1])});
            this.hiddenGraphic[0].style.text = content[0].hazardSum || 0;
            content.forEach(ele => {
                this.hiddenTypeData.push({value: ele.hazardCount, name: statas[ele.mendStatus],ename: statas[ele.mendStatus]});
            });
        }
        else
        {
            let typeContent = await this.workbenchService.getDangerByCustomerDeptId({day: this.timeRange[this.showHiddenTime - 1].startDate});
            // this.hiddenGraphic[0].style.text = content[0].hazardSum || 0;
            typeContent.forEach(ele => {
                this.hiddenGraphic[0].style.text += ele.count;
                this.hiddenTypeData.push({value: ele.count, name: ele.name,ename: ele.name});
            });
        }
        
    }

    protected async getRedHeiBang()
    {
        let content = await this.workbenchService.getRedHeiBang({specialTypeId: this.showTabs,type: this.showRightUnit,day: this.timeRange[this.showRightTime - 1].startDate});
        console.log(content);
        this.unitDdata = content;
    }
    protected async xxx()
    {
        // let content = await this.workbenchService.getProjectMapList({});
    }
}
</script>

<style lang="less" scoped>
/deep/.amap-overlay-text-container
{
    background: #4B7EFE;
    border: none;
    
}
.workbench-view
{
    width: 100%;
    height: 100%;
    position: relative;
}
.statis-left
{
    position: absolute;
    left: 30px;
    top: 105px ;
    
    overflow-y: auto;
    height: 88%;
    width: 0;
    &::-webkit-scrollbar
    {
        display: none;
    }
    &.active
    {
        width: 388px;
    }
    .statis-item
    {
        width: 388px;
        height: 310px;
        background: #FFFFFF;
        border: 1px solid #E7E8EC;
        box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.0600);
        border-radius: 4px;
        &-title
        {
            padding: 12px 20px;
            border-bottom: 1px solid #E7E8EC;
            
            h3
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #182334;
                width: 50%;

            }
        }
        &-icon
        {
            height: 17px;
            height: 15px;
            margin-top: 4px;
            margin-right: 5px;
        }

        &-status
        {
            display: flex;
            border-right: none;
            float: right;
            span
            {
                flex: 1;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                width: 60px;
                color: #838D9C;
                border: 1px solid #E7E8EC;
                text-align: center;
                cursor: pointer;
                &:nth-child(1){
                    border-radius: 4px 0 0 4px;

                }
                &:nth-child(2){
                    border-radius: 0px;
                }
                &:nth-child(3){
                    border-radius: 0px;
                }
                &:nth-child(4){
                    border-radius: 0px 4px 4px 0px;
                }

                &:hover,
                &.active
                {
                    border: 1px solid #4B7EFE;
                    color: #4B7EFE;
                }
            }
        }
        .type-tap
        {
            // border: 1px solid #E7E8EC;
            width: 148px;
            border-right: none;
            margin-top: 10px;
            margin-left: 20px;
            display: flex;
            p
            {
                width: 80px;
                flex: 1;
                font-size: 14px;
                border: 1px solid #E7E8EC;
                cursor: pointer;
                text-align: center;
                &:nth-child(1){
                    border-radius: 4px 0 0 4px;

                }
                &:nth-child(2){
                    border-radius: 0px 4px 4px 0px;

                    
                }
                &:hover,
                &.active
                {
                    border: 1px solid #4B7EFE;
                    color: #4B7EFE;
                }
                
            }
        }
    }
}
.statis-right
{
    position: absolute;
    right: 30px;
    top: 105px;
    width: 0;
    height: 88%;

    &.active
    {
        width: 388px;
    }

    &-tabs
    {
        display: flex;
        // background: #fff;
        &-btn
        {
            width: 136px;
            height: 48px;
            line-height: 48px;
            font-size: 15px;
            font-weight: bold;
            color: #182334;
            position: relative;
            cursor: pointer;
            
            &.active
            {
                
                color: @main-color;
                &:after
                {
                    background-color: #fff;
                    border-right: 1px solid #E7E8EC;
                }

                &:nth-child(1)::before
                {
                    background-color: #fff;
                }

                &:nth-child(2)
                {
                    background-color: none;
                }
            }
            span
            {
                position: relative;
                z-index: 9;
                transform: skewX(-30deg);
            }
            &:after
            {
                content: '';
                position: absolute;
                width: 97%;
                height: 100%;
                background: transparent;
                transform: skewX(30deg);
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #F3F5F7;
                z-index: 1;
                border-right: 1px solid #E7E8EC;
                border-top: 1px solid #E7E8EC;
                border-radius: 4px 12px 0px 0px;
            }
            &:nth-child(1)
            {
                width: 96px;
                text-align: left;
                text-indent: 20%;
                &::after
                {
                    z-index: 3;
                }
                &::before
                {
                    content: '';
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    background-color: #F3F5F7;
                    left: -15px;
                    border-left: 1px solid #E7E8EC;
                    border-top: 1px solid #E7E8EC;

                }
            }

            &:nth-child(2)
            {
                width: 116px;
                position: relative;
                left: -0;
                z-index: 2;
                text-align: left;
                text-indent: 25%;
                &::after
                {
                    left: -13px;
                    z-index: 2;
                    
                }
            }
        }
    }
    
    .statis-wrap
    {
        box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.06);
        position: relative;
        left: -14px;
        transition: 0.5s all;
        overflow-y: auto;
        height: 670px;
        overflow-x: hidden;
    }
    
    &-content
    {
        width: 100%;
        padding: 10px 15px;
        height: 35px;
        // height: 100px;
        background: #FFFFFF;
        display: block;
        clear: both;
    }

    &-time
    {
        
        display: flex;
        border-right: none;
        float: left;

        &::after
        {
            display: block;
            content: "";
            clear: both;
        }
        span
        {
            flex: 1;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            width: 60px;
            color: #838D9C;
            border: 1px solid #E7E8EC;
            text-align: center;
            cursor: pointer;
            &:nth-child(1){
                border-radius: 4px 0 0 4px;

            }
            &:nth-child(2){
                border-radius: 0px;
            }
            &:nth-child(3){
                border-radius: 0px;
            }
            &:nth-child(4){
                border-radius: 0px 4px 4px 0px;
            }

            &:hover,
            &.active
            {
                border: 1px solid #4B7EFE;
                color: #4B7EFE;
            }
        }
    }
    .statis-item
    {
        width: 388px;
        height: 276px;
        background: #FFFFFF;
        &-1
        {
            height: auto;
        }
        &-title
        {
            padding: 12px 20px;
            // border-bottom: 1px solid #E7E8EC;
            
            h3
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #182334;
                width: 50%;
            }
        }
        &-icon
        {
            height: 17px;
            height: 15px;
            margin-top: 4px;
            margin-right: 5px;
        }
        .type-tap
        {
            display: flex;
            p
            {
                flex: 1;
                border-left: 1px solid #DFE1E3;
                padding: 0 18px;
                margin-top: 10px;
                margin-bottom: 10px;
                color: #838D9C;
                font-size: 14px;
                text-align: center;
                &:nth-child(1)
                {
                    border-left: none;
                }
                &:hover,
                &.active
                {
                    
                    font-weight: bold;
                    color: #4B7EFE;
                }
            }
        }
    }
}

.map-window
{
    position: absolute;
    top: 100px;
    left: 100px;
    padding: 30px;
    width: 468px;
    height: 705px;
    background: #FFFFFF;
    box-shadow: 0px 2px 16px 0px rgba(0,0,0,0.06);
    border-radius: 4px;
    display: none;
    transition: 0.5s all;
    &-warp
    {
        height: 680px;
        overflow-y: auto;
    }
    .close-i
    {
        position: absolute;
        right: 30px;
        top: 30px;
        z-index: 999;
        color: #182334;
        cursor: pointer;
    }
    h3
    {
        width: 397px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #182334;
        line-height: 28px;
    }

    &-status
    {
        margin-top: 20px;
        display: flex;
        border-right: none;
        span
        {
            display: block;
            flex-basis: 84px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            width: 84px;
            color: #838D9C;
            border: 1px solid #E7E8EC;
            text-align: center;
            cursor: pointer;
            &:nth-child(1){
                border-radius: 4px 0 0 4px;

            }
            &:nth-child(2){
                border-radius: 0px;
            }
            &:nth-child(3){
                border-radius: 0px;
            }
            &:nth-child(4){
                border-radius: 0px 4px 4px 0px;
            }

            &:hover,
            &.active
            {
                border: 1px solid #4B7EFE;
                color: #4B7EFE;
            }
        }
    }

    &-title
    {
        margin-bottom: 5px;
        margin-top: 20px;
        h3
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #182334;
            width: 50%;

        }
    }
    &-icon
    {
        width: 13px;
        height: 15px;
        margin-top: 7px;
        margin-right: 5px;
    }

    &-form
    {
        margin-bottom: 10px;
        /deep/.ivu-form-item
        {
            margin-bottom: 0;
            .ivu-form-item-label,.ivu-form-item-content
            {
                color: #5D6673;
            }
            .ivu-form-item-label
            {
                padding: 6px 10px 6px 0;
            }
            .ivu-form-item-content
            {
                line-height: 24px;
            }
        }
    }

    &-happen
    {
        text-align: center;
        width: 418px;
        display: flex;
        margin-top: 20px;
        >div
        {
            flex: 1;
        }
        h3
        {
            font-size: 20px;
            font-family: DINPro;
            font-weight: 500;
            color: #182334;
            line-height: 28px
        }
        p
        {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #838D9C;
            line-height: 28px;
        }
    }

    &-hidden
    {
        width: 415px;
        height: 92px;
        background: #FBFCFE;
        border: 1px solid #E9EDF2;
        border-radius: 10px;
        margin-top: 20px;
        display: flex;
        > div
        {
            flex: 1;
            text-align: center;
            position: relative;
            margin-top: 18px;
            h4
            {
                font-size: 24px;
                font-family: DINPro;
                font-weight: 500;
                color: #FF4D3F;
                line-height: 28px;
            }
            p
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #838D9C;
                line-height: 28px;
            }

            &:not(:last-child)::after
            {
                content: "";
                position: absolute;
                height: 40px;
                width: 1px;
                right: 0;
                top: 7px;
                background: #DADFE6;
            }
        }
    }
}
.table-normal
{
    margin-top: 0 !important;
    /deep/.ivu-table th
    {
        background-color: #F2F6F9;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #838D9C;
    }
    /deep/.ivu-table-row .ivu-table-cell
    {
        background: none !important;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #182334;
        padding: 8px;
        // text-align: center;
    }
}
</style>  
