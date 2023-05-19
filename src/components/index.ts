import * as ApplicationComponents from "./application";
import * as LayoutComponents from "./layout";
import * as UxComponents from "./ux";
import * as BusinessComponents from "./business";

const globalComponents =
{
    ...ApplicationComponents,
    ...LayoutComponents,
    ...UxComponents,
    ...BusinessComponents
};

export function install(vueClass: any, opts: any = {})
{
    const _Vue = vueClass;
    Object.keys(globalComponents).forEach(key =>
    {
        _Vue.component(key, globalComponents[key]);
    });
}

export default {...globalComponents, install};
