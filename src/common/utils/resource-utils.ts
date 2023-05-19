/**
 * 加载外部css
 * @param url 
 */
function loadCss(url: string)
{
    // TODO 1 加载之前判断是否是css链接
    // TODO 2 加载之前判断是否已经加载过
    const ele = document.createElement("link");
    ele.setAttribute("rel", "stylesheet");
    ele.setAttribute("type", "text/css");
    ele.setAttribute("href", url);
    document.head.appendChild(ele);
}

/**
 * 加载外部js
 * @param src 
 * @param callback 
 */
function loadJS(src: string, callback: EventListenerOrEventListenerObject)
{
    // TODO 1 加载之前判断是否是js链接
    // TODO 2 加载之前判断是否已经加载过
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.addEventListener("laod", callback, false);
    document.head.appendChild(script);
}

function requireJS(src: string)
{
    return require(src);
}

export
{
    loadCss,
    loadJS,
    requireJS
};
export default {loadCss, loadJS, requireJS};
