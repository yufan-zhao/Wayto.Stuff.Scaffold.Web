<template>
    <div class="main">
        <div class="header d-f">
            <div class="time">
                <span>选择时间：</span>
                <div class="select-width">
                    <i-date-picker v-model="date" type="date" split-panels placeholder="请选择" style="width: 200px"  @on-change="getTime"></i-date-picker>
                </div>
            </div> 
            <div class="project d-f"> 
                <span class="project-span">项目：</span>
                <i-select class="project-select-width d-i" v-model="projectId" width="200" @on-change="search" clearable @on-clear="getLocus">
                    <!-- <i-select  v-model="projectId" maxlength="20" @on-change="onSearch" clearable> -->
                        <i-option v-for="item in projectList" :key="item.id" :value="item.id">{{item.projectName}}</i-option>
                    <!-- </i-select>  -->
                </i-select>
            </div>
        </div>
       <amap
            ref="amap"
            @map-ready="onMapComplete"
            vid="amap"
            :zoom="volatileZoom"
            class="map-box"
            :expandZoomRange="true"
            :zooms="[6, 20]"
            :doubleClickZoom="false"
            :center="mapCenter"
            :mapStyle="applicationContext.settings.amapSettings.style"
        >

            <amap-polyline v-model="poitline"
                        :visible="true"
                        :editable="false"
                        :strokeWeight="4"
                        strokeColor="#3DC99D"
                        :strokeOpacity="1"
                        :isOutline="true"
                        outlineColor="#3DC99D"
                        :showDir="true"
                        lineJoin="round">
                </amap-polyline>

                <!-- <amap-bezier-curve v-model="poitline"
                        :visible="true"
                        :editable="false"
                        :strokeWeight="4"
                        strokeColor="#3DC99D"
                        :strokeOpacity="1"
                        :isOutline="true"
                        outlineColor="#3DC99D"
                        :showDir="true"
                        lineJoin="round">
                </amap-bezier-curve> -->
            <!-- :map-style="mapConfig.mapStyle" -->
            
            <slot name="extends"></slot>
        </amap>
        <!-- applicationContext.settings.amapSettings.style -->
    </div>
</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";
import { LocusService, ProjectService } from "src/services";
import { service } from "src/common/decorator";
import dayjs from "dayjs";
import { imagePath } from "src/common/utils/extend-utils";
import { ApplicationContext } from "src/application";
import globalConfig from "src/common/utils/global";
import { ApplicationContextBase } from "uxmid-core";
import CommonView from "src/views/common-view";

@component
export default class StaffLocusView extends CommonView
{
    @service("LocusService")
    protected locusService: LocusService;

    @service("ProjectService")
    protected projectService: ProjectService;

    protected center = [];

    @config({required: true, default: () => ({})})
    protected detail: any;
    
    protected projectList: any = [];

    protected imagePath = imagePath;
    protected dayjsF = dayjs;

    protected projectId: any = "";

    protected poitline: any = []; // 轨迹画线条数据

    protected poitList: any = []; // 所有轨迹数据

    protected flowStatus = "全部";

    // 数据录入类型c
    protected inputType = [".png",".jpg",".jpeg","",""];

    protected date = "";
    
    protected fileData = [];

    protected filters =
    {
        endDate: dayjs().unix(),
        startDate: dayjs().subtract(-1,"day").unix()
    };

    /**
     * 当前地图层级。
     * @protected
     * @type {number}
     */
    protected zoom: number = 12;

    protected mapCenter = [...globalConfig.mapCenter];

    /**
     * 地图缩放倍数(变化)。
     * @protected
     * @type {number}
     */
    protected volatileZoom: number = this.zoom;

    /**
     * 获取设备信息
     * @protected
     * @param {any} - e map实例对象
     * @returns {Promise<void>}
     */
    protected async onMapComplete(map: any): Promise<void>
    {
        const
            AMap: any = (<any>window).AMap,
            AMapUI: any = (<any>window).AMapUI;

        // this.$emit("on-map-ready", this.mapIns = map);

        AMap.plugin(["AMap.Autocomplete"], () =>
        {
            // this._autocomplete = new AMap.Autocomplete
            // ({
            //     datatype: "all",
            //     input: this.$refs.keywords as HTMLInputElement
            // });

            // this._autocomplete.on("select", this.autoCompleteSelect);
        });
    }
    
    /**
     * 获得选项框的数据
     * @ref
     */
    protected async selectList()
    {
        let projectList = await this.projectService.list({diagnosisUserId: this.detail.userId});
        this.projectList = projectList; // 项目列表
    }

    @watch("detail",{immediate: true})
    protected decc()
    {
        
        this.getTime();
        this.selectList();
    }

    /**
     * 地图缩放。
     * @protected
     * @param {boolean} - increase 是不是增加层级。
     * @returns {void}
     */
    protected zoomChange(increase: boolean): void
    {
        increase ? ++this.volatileZoom : --this.volatileZoom;
    }

    protected getTime()
    {
        if(this.date)
        {
            this.filters =
            {
                endDate: dayjs(this.date).endOf("day").unix(),
                startDate: dayjs(this.date).startOf("day").unix()
            };
            
        }
        else
        {
            this.filters =
            {
                endDate: dayjs().subtract(1,"day").endOf("day").unix(),
                startDate: dayjs().subtract(1,"day").startOf("day").unix()
            };

        }
        
        this.projectId = null;
        this.getLocus();
    }

    protected async getLocus()
    {
        this.poitline = [];
        
        let content = await this.locusService.gettrack({
            coord_type_output: "gcj02",
            process_option: "need_mapmatch=1,transport_mode=auto",
            // match: 1,
            // is_processed: 1,
            page_size: 5000,
            entity_name: this.detail.userName + "_" + this.detail.userId,
            start_time: this.filters.startDate,
            end_time: this.filters.endDate
        });
        
        if(content["data"].status === 0)
        {
            let poitline = JSON.parse(JSON.stringify(content)).data.points.map(item => [item.longitude, item.latitude]);
           
            this.$set(this,"poitline", poitline);

            this.mapCenter = this.poitline.length ? this.poitline[0] : globalConfig.mapCenter;

            this.poitList = JSON.parse(JSON.stringify(content)).data.points;

            this.projectList &&  this.projectList.length && (this.projectId = this.projectList[0].id);

            this.search(this.projectList[0].id);
        }
        
    }

    protected search(val)
    {
        console.log(val);
        
        let poitline = JSON.parse(JSON.stringify(this.poitList)).filter(item => Number(item.project_id) === val).map(item => [item.longitude, item.latitude]);
        let poitlineCur = [];
        poitline.forEach(element => {
            console.log(new Set(poitlineCur).has(element),poitline[0] === poitline[1]);
            if(!poitlineCur.includes(element))
            {
                poitlineCur.push(element);
            }
        });
        this.$set(this,"poitline", poitlineCur);
        this.mapCenter = this.poitline.length ? this.poitline[0] : globalConfig.mapCenter;
        console.log(this.poitline);
                
    }

        // protected1

}
</script>

<style lang="less" scoped>
.map-box
{
    width: 100%;
    height: 550px;
}
.project-span
{
    line-height: 28px;
    width: 90px;
    display: inline-block;
    text-align: right;
}
.project-select-width
{
    width: 200px;
}
.main
{
    padding-right: 30px;
    position: relative;
    .header
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        padding-top: 20px;
        padding-bottom: 20px;
        background: #fff;
        .mr
        {
            margin-right: 8px;
            width: 76px;
            text-align: center;
        }
        .time
        {
            margin-left: 10px;
            display: inline-block;
            .select-width
            {
                display: inline-block;
            }
        }
    }
    .content
    {
        .date-title
        {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #182334;
        }
        .line
        {
            margin-top: 13px;
            margin-bottom: 22px;
            height: 1px;
            background: #F1F2F2;
        }
        .data-title
        {
            margin-bottom: 17px;
            span:nth-child(1), span:nth-child(2), span:nth-child(3)
            {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #182334;
                display: inline-block;
                margin-right: 19px;
            }
            span:nth-child(4)
            {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #A6ABB5;
            }
        }
        .data-img
        {
            display: flex;
            flex-wrap: wrap;
            .img
            {
                // background: rgb(0, 169, 255);
                display: inline-block;
                width: 328px;
                height: 178px;
                border-radius: 2px;
                margin-right: 14px;
                overflow: hidden;
                line-height: 178px;
            }
            img
            {
                width:  108%;
            }
            // video
            // {
            //     width: 328px;
            //     height: 108px;
            // }
        }
    }
    .bottom-div
    {
        height: 50px;
    }
}
</style>