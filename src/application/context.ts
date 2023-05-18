import { ApplicationContextBase, IWorkbench } from "uxmid-core";
import Router from "vue-router";

export default class ApplicationContext extends ApplicationContextBase
{
    protected createWorkbench(args: string[]): IWorkbench
    {
        throw new Error("Method not implemented.");
    }
}
