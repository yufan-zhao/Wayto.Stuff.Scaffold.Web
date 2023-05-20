import type { IHttpResponse, IViewCascaderData } from "src/models";
import { Injectable } from "uxmid-core";
import { httpConfig } from "src/common/http";

import ServiceBase from "../../service-base";
import { SYSTEM_CONFIG_TYPE } from "src/enums";

@Injectable()
export default class DictService extends ServiceBase
{
    /**
     * 根据不同的基础设置枚举编码获取接口的数据
     * @param target 
     * @param enableOnly 是否只查询启用项，默认是
     */
    public async getTargetContentList(target: SYSTEM_CONFIG_TYPE, enableOnly: boolean = true, extra?: any): Promise<Array<any>>
    {
        let result: Array<any>;
        switch(target)
        {
            case SYSTEM_CONFIG_TYPE.PROJECT_TYPE:
            {
                result = await this.getProjectTypeList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE:
            {
                result = await this.getConstructionStageList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_TYPE:
            {
                result = await this.getHazardTypeList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_LEVEL:
            {
                result = await this.getHazardLevelList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_TYPE:
            {
                result = await this.getToolTypeList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_CRIB:
            {
                result = await this.getToolCribList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE:
            {
                result = await this.getStandardAtlasTypeList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.SAFETY_TRAINING:
            {
                result = await this.getSafetyTrainingList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.GROUP_NAME:
            {
                result = await this.getGroupNameSettingList(enableOnly, extra);
                break;
            }
            case SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE:
            {
                result = await this.getDiagnosisTypeSettingList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONTRACT_TYPE:
            {
                result = await this.getContractTypeSettingList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.AD_AREA:
            {
                result = await this.getAdministrativeSettingList(enableOnly);
                break;
            }
            case SYSTEM_CONFIG_TYPE.POSITION_SETTING:
            {
                result = await this.getPositionSettingList(enableOnly);
                break;
            }
            default:
            {
                result = [];
                break;
            }
        }
        return result.map(item =>
        {
            return {
                ...item,
                enumValue: target
            };
        });
    }

    /**
     * 根据不同的基础设置枚举编码提交基础配置新增
     * @param data 其中的extend是json对象，是对业务字段的总结
     */
    public async insert(data: {enable: boolean; extend: string; enumValue: SYSTEM_CONFIG_TYPE})
    {
        let target: SYSTEM_CONFIG_TYPE = data.enumValue;
        let jsonObj = JSON.parse(data.extend);
        let res: IHttpResponse;
        switch(target)
        {
            case SYSTEM_CONFIG_TYPE.PROJECT_TYPE:
            {
                res = await this.saveProjectType({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    typeNumber: jsonObj.typeNumber
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE:
            {
                // 施工阶段新增处理
                res = await this.saveConstructionStage({
                    status: data.enable ? 1 : 0,
                    phaseName: jsonObj.phaseName,
                    projectTypeId: jsonObj.projectTypeId
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_TYPE:
            {
                res = await this.saveHazardType({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_LEVEL:
            {
                // 问题隐患等级
                res = await this.saveHazardLevel({
                    status: data.enable ? 1 : 0,
                    levelNumber: jsonObj.levelNumber,
                    content: jsonObj.content,
                    required: jsonObj.required ? 1 : 0,
                    description: jsonObj.description,
                    sequence: Number(jsonObj.sequence),
                    color: jsonObj.color
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_TYPE:
            {
                res = await this.saveToolType({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    typeNumber: jsonObj.typeNumber
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_CRIB:
            {
                res = await this.saveToolCrib({
                    status: data.enable ? 1 : 0,
                    addr: jsonObj.addr
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE:
            {
                res = await this.saveStandardAtlasType({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    parentId: typeof jsonObj.parentId === "number" ? jsonObj.parentId : undefined
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.SAFETY_TRAINING:
            {
                res = await this.saveSafetyTraining({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.GROUP_NAME:
            {
                console.log(jsonObj);
                res = await this.saveGroupNameSetting({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    deptId: jsonObj.deptId.pop()
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE:
            {
                res = await this.saveDiagnosisTypeSetting({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONTRACT_TYPE:
            {
                res = await this.saveContractTypeSetting({
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.POSITION_SETTING:
            {
                res = await this.savePositionSetting({
                    status: data.enable ? 1 : 0,
                    positionName: jsonObj.positionName
                });
                break;
            }
            default:
            {
                break;
            }
        }
        return res;
    }

    /**
     * 根据不同的基础设置枚举编码提交基础配置编辑
     * @param data 
     */
    public async update(data: {id: number; enable: boolean; extend: string; enumValue: SYSTEM_CONFIG_TYPE})
    {
        // console.log(data);
        let target: SYSTEM_CONFIG_TYPE = data.enumValue;
        let jsonObj = JSON.parse(data.extend);
        let res: IHttpResponse;
        switch(target)
        {
            case SYSTEM_CONFIG_TYPE.PROJECT_TYPE:
            {
                res = await this.updateProjectTypeById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    typeNumber: jsonObj.typeNumber
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONSTRUCTION_STAGE:
            {
                // 施工阶段新增处理
                res = await this.updateConstructionStageById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    phaseName: jsonObj.phaseName,
                    projectTypeId: jsonObj.projectTypeId
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_TYPE:
            {
                res = await this.updateHazardTypeById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.HAZARD_LEVEL:
            {
                // 问题隐患等级
                res = await this.updateHazardLevelById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    levelNumber: jsonObj.levelNumber,
                    content: jsonObj.content,
                    required: jsonObj.required ? 1 : 0,
                    description: jsonObj.description,
                    sequence: jsonObj.sequence,
                    color: jsonObj.color
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_TYPE:
            {
                res = await this.updateToolTypeById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    typeNumber: jsonObj.typeNumber
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.TOOL_CRIB:
            {
                res = await this.updateToolCribById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    addr: jsonObj.addr
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.STANDARD_ATLAS_TYPE:
            {
                res = await this.updateStandardAtlasTypeById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.SAFETY_TRAINING:
            {
                res = await this.updateSafetyTrainingById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.GROUP_NAME:
            {
                res = await this.updateGroupNameSettingById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName,
                    deptId: jsonObj.deptId.pop()
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.DIAGNOSIS_TYPE:
            {
                res = await this.updateDiagnosisTypeSettingById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.CONTRACT_TYPE:
            {
                res = await this.updateContractTypeSettingById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    typeName: jsonObj.typeName
                });
                break;
            }
            case SYSTEM_CONFIG_TYPE.POSITION_SETTING:
            {
                res = await this.updatePositionSettingById({
                    id: data.id,
                    status: data.enable ? 1 : 0,
                    positionName: jsonObj.positionName
                });
                break;
            }
            default:
            {
                break;
            }
        }
    }

    /**
     * 删除指定的基础设置项
     * @param id 
     */
    @httpConfig({method: "PUT", url: "/basic/settings/virtualRemoveById", schema: "/serverApi"})
    public async delete(id: number)
    {
        const res = await this.request({params: {id}});
        return res;
    }

    // ------begin 编辑系列接口 ------
    @httpConfig({method: "PUT", url: "/basic/settings/updateProjectTypeById", schema: "/serverApi"})
    private async updateProjectTypeById(data: {status: number; typeName: string; typeNumber: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateConstructionStageById", schema: "/serverApi"})
    private async updateConstructionStageById(data: {status: number; phaseName: string; projectTypeId: number; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateHazardTypeById", schema: "/serverApi"})
    private async updateHazardTypeById(data: {status: number; typeName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateHazardLevelById", schema: "/serverApi"})
    private async updateHazardLevelById(data: {status: number; levelNumber: string; content: string; required: number; description: string; id: number; sequence: number; color: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateToolTypeById", schema: "/serverApi"})
    private async updateToolTypeById(data: {status: number; typeName: string; typeNumber: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateToolCribById", schema: "/serverApi"})
    private async updateToolCribById(data: {status: number; addr: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateStandardAtlasTypeById", schema: "/serverApi"})
    private async updateStandardAtlasTypeById(data: {status: number; typeName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateSafetyTrainingById", schema: "/serverApi"})
    private async updateSafetyTrainingById(data: {status: number; typeName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateGroupNameSettingById", schema: "/serverApi"})
    private async updateGroupNameSettingById(data: {status: number; typeName: string; deptId: number; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateDiagnosisTypeSettingById", schema: "/serverApi"})
    private async updateDiagnosisTypeSettingById(data: {status: number; typeName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updateContractTypeSettingById", schema: "/serverApi"})
    private async updateContractTypeSettingById(data: {status: number; typeName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "PUT", url: "/basic/settings/updatePositionSettingById", schema: "/serverApi"})
    private async updatePositionSettingById(data: {status: number; positionName: string; id: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    // ------begin 新增系列接口 ------
    @httpConfig({method: "POST", url: "/basic/settings/saveProjectType", schema: "/serverApi"})
    private async saveProjectType(data: {status: number; typeName: string; typeNumber: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveConstructionStage", schema: "/serverApi"})
    private async saveConstructionStage(data: {status: number; phaseName: string; projectTypeId: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveHazardType", schema: "/serverApi"})
    private async saveHazardType(data: {status: number; typeName: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveHazardLevel", schema: "/serverApi"})
    private async saveHazardLevel(data: {status: number; levelNumber: string; content: string; required: number; description: string; sequence: number; color: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveToolType", schema: "/serverApi"})
    private async saveToolType(data: {status: number; typeName: string; typeNumber: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveToolCrib", schema: "/serverApi"})
    private async saveToolCrib(data: {status: number; addr: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveStandardAtlasType", schema: "/serverApi"})
    private async saveStandardAtlasType(data: {status: number; typeName: string; parentId: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveSafetyTraining", schema: "/serverApi"})
    private async saveSafetyTraining(data: {status: number; typeName: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveGroupNameSetting", schema: "/serverApi"})
    private async saveGroupNameSetting(data: {status: number; typeName: string; deptId: number})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveDiagnosisTypeSetting", schema: "/serverApi"})
    private async saveDiagnosisTypeSetting(data: {status: number; typeName: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/saveContractTypeSetting", schema: "/serverApi"})
    private async saveContractTypeSetting(data: {status: number; typeName: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }

    @httpConfig({method: "POST", url: "/basic/settings/savePositionSetting", schema: "/serverApi"})
    private async savePositionSetting(data: {status: number; positionName: string})
    {
        const res = await this.request({data: {param: data}});
        return res;
    }
    // ------end 新增系列接口 ------

    @httpConfig({method: "GET", url: "/basic/settings/getProjectTypeList", schema: "/serverApi"})
    private async getProjectTypeList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName,
                typeNumber: item.typeNumber,
                userGroupId: item.userGroupId
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getConstructionStageList", schema: "/serverApi"})
    private async getConstructionStageList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                phaseName: item.phaseName,
                projectType: item.projectType,
                projectTypeId: item.projectTypeId
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getHazardTypeList", schema: "/serverApi"})
    private async getHazardTypeList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName,
                userGroupId: item.userGroupId
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getHazardLevelList", schema: "/serverApi"})
    private async getHazardLevelList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                levelNumber: item.levelNumber,
                content: item.content,
                description: item.description,
                required: item.required === 1,
                userGroupId: item.userGroupId,
                sequence: item.sequence,
                color: item.color
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getToolTypeList", schema: "/serverApi"})
    private async getToolTypeList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName,
                typeNumber: item.typeNumber
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getToolCribList", schema: "/serverApi"})
    private async getToolCribList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                addr: item.addr
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getStandardAtlasTypeList", schema: "/serverApi"})
    private async getStandardAtlasTypeList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName,
                child: Array.isArray(item.child) ? item.child.map(jtem =>
                {
                    return {
                        id: jtem.id,
                        enable: jtem.status === 1,
                        typeName: jtem.typeName,
                        parentId: Number(jtem.parentId)
                    };
                }) : []
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getSafetyTrainingList", schema: "/serverApi"})
    private async getSafetyTrainingList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getGroupNameSettingList", schema: "/serverApi"})
    private async getGroupNameSettingList(enableOnly: boolean, orgTreeSourceData?: Array<any>)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            let groups = [];
            if (orgTreeSourceData)
            {
                groups = this.getCascaderInitData(item.deptId, orgTreeSourceData, []) || [];
            }
            
            // console.log("组：" + item.deptId, JSON.stringify(groups));
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName,
                deptId: groups.map(item => item.value)
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getDiagnosisTypeSettingList", schema: "/serverApi"})
    private async getDiagnosisTypeSettingList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName
            };
        });
    }

    @httpConfig({method: "GET", url: "/basic/settings/getContractTypeSettingList", schema: "/serverApi"})
    private async getContractTypeSettingList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                typeName: item.typeName
            };
        });
    }

    @httpConfig({method: "GET", url: "/sysregion/tree", schema: "/serverApi"})
    private async getAdministrativeSettingList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content;
    }

    @httpConfig({method: "GET", url: "/basic/settings/getPositionSettingList", schema: "/serverApi"})
    private async getPositionSettingList(enableOnly: boolean)
    {
        const res = await this.request({
            params:
            {
                status: enableOnly ? 1 : undefined
            }
        });
        return res.content.map(item =>
        {
            return {
                id: item.id,
                enable: item.status === 1,
                positionName: item.positionName
            };
        });
    }

    private getCascaderInitData(targetId: number, source: Array<IViewCascaderData>, temp: Array<IViewCascaderData>)
    {
        for (let i = 0; i < source.length; i++)
        {
            let cur = [...temp];
            let item = source[i];
            cur.push(item);
            if (item.value === targetId)
            {
                return cur;
            }
            if (Array.isArray(item.children) && item.children.length > 0)
            {
                let res = this.getCascaderInitData(targetId, item.children, cur);
                if (res)
                {
                    return res;
                }
            }
            
        }
    }
}
