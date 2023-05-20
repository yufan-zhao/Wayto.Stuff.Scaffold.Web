interface IMqttSettings
{
    /**
     * mqtt服务ip地址
     */
    readonly ip: string;
    /**
     * mqtt服务端口
     */
    readonly port: number;
}

export default IMqttSettings;
