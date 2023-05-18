import { IServiceProvider, ServiceProviderFactory } from "uxmid-core";
import Vue, { CreateElement } from "vue";
import { Message, Notice, Spin, ModalInstance } from "view-design";
import iview from "../components/iview";
// import { WarningModal } from "src/components/business";

const components: any = iview;

export class Component extends Vue
{
    /**
     * 获取默认服务容器实例。
     * @protected
     * @property
     * @returns uxmid.IServiceProvider
     */
    protected get serviceProvier(): IServiceProvider
    {
        return ServiceProviderFactory.instance.default;
    }

    /**
     * 获取一个全局加载条实例。
     * @returns LoadingBar
     */
    protected get $loading(): any
    {
        return components.LoadingBar;
    }
    
    /**
     * 获取一个全局消息提示框实例。
     * @returns Message
     */
    protected get $message(): Message
    {
        return components.Message;
    }

    // protected $globalWarningModal(options) {

    //     if (document.getElementById("warningModal"))
    //     {
    //         const warningModal = document.getElementById("warningModal");
    //         warningModal.parentElement.removeChild(warningModal);
    //     }
    //     const element = document.createElement("div");
    //     element.setAttribute("id", "modal");
    //     document.body.appendChild(element);
    //     const $warningModal = new Vue({
    //         el: "#modal",
    //         components: {
    //             "warning-modal": WarningModal
    //         },
    //         render(h: CreateElement)
    //         {
    //             return h("warning-modal", {
    //                 attrs: {
    //                     id: "warningModal"
    //                 },
    //                 ref: "$warningModal"
    //             }, []);
    //         }
    //     });

    //     ($warningModal.$refs["$warningModal"] as any).$on("on-close", () => {
    //         if (document.getElementById("warningModal"))
    //         {
    //             const warningModal = document.getElementById("warningModal");
    //             warningModal.parentElement.removeChild(warningModal);
    //         }
    //     });

    //     ($warningModal.$refs["$warningModal"] as any).open(options);
    // };
    
    /**
     * 获取一个全局模态框实例。
     * @returns Modal
     */
    protected get $modal(): ModalInstance
    {
        return components.Modal;
    }
    
    /**
     * 获取一个全局通知提醒实例。
     * @returns Notice
     */
    protected get $notice(): Notice
    {
        return components.Notice;
    }
    
    /**
     * 获取一个全局加载中组件实例。
     * @returns Spin
     */
    protected get $spin(): Spin
    {
        return components.Spin;
    }
}
