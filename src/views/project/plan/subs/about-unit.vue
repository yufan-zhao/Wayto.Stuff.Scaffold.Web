<template>
    <div class="sub-detail">
        <h3 class="sub-detail-title u-form-content-title">代建单位</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left">
                <i-row type="flex" justify="start" v-for="item in (detail.projectManager && detail.projectManager.buildUnit || [])" :key="'buildUnit' + item.id">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="单位名称">{{ item.name ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="项目负责人">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="负责科室">{{ item.department ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="安全管理员">{{ item.securityAdminPerson ||" - " }}（{{item.securityAdminPhone ||" - "}}）</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>

        <!-- <h3 class="sub-detail-title u-form-content-title">设计单位</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left">
                <i-row type="flex" justify="start" v-for="item in (detail.projectManager && detail.projectManager.design || [])" :key="'design' + item.id">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="单位名称">{{ item.name ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="负责人">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div> -->

        <h3 class="sub-detail-title u-form-content-title">施工单位</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" v-for="item in (detail.projectManager && detail.projectManager.construction || [])" :key="'construction' + item.id">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="单位名称">{{ item.constructionName ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="项目经理">{{ item.manager ||" - " }}（{{item.managerPhone ||" - "}}）</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="安全总监/经理">{{ item.charger ||" - " }}（{{item.principalPhone ||" - "}}）</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="人员数">{{ item.personNumber ||" - " }}</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>

        <h3 class="sub-detail-title u-form-content-title">监理单位</h3>
        <div class="sub-content u-form-content">
            <i-form class="u-form" label-position="left" v-for="item in (detail.projectManager && detail.projectManager.supervising || [])" :key="'supervising' + item.id">
                <i-row type="flex" justify="start">
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="单位名称">{{ item.name ||" - " }}</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item" label="项目总监">{{ item.engineer ||" - " }}（{{item.directorPhone ||" - "}}）</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="安全专监">{{ item.person ||" - " }}（{{item.phone ||" - "}}）</i-form-item>
                    </i-col>
                    <i-col class-name="u-col" span="8">
                        <i-form-item class="u-form-item"  label="人员数">{{ item.personNumber ||" - " }}</i-form-item>
                    </i-col>
                </i-row>
            </i-form>
        </div>
        
    </div>

</template>

<script lang="ts">
import { component, View, watch, config } from "uxmid-vue-web";

@component
export default class AboutUnit extends View
{
    @config({required: true, default: () => ({})})
    protected detail: any;
}
</script>

<style lang="less" scoped>
@import "~src/styles/business/sub-detail";

</style>