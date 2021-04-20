export class ResizeConfig {
    width: number;
    height: number;

    clone(): ResizeConfig {
        const config = new ResizeConfig();
        config.width = this.width;
        config.height = this.height;
        return config;
    }
}
