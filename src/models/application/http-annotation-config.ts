interface IHttpAnnotationConfig
{
    /**
     * 请求方式，其中upload请求好像是特殊的post请求，专门处理文件上传的情况
     */
    method?: "GET" | "POST" | "PUT" | "UPLOAD";

    /**
     * 请求相对路径
     * @property
     */
    url: string;

    schema?: string;
}

export default IHttpAnnotationConfig;
