export class Filter {
    protected static readonly MAX_RBGA_VALUE = 255;
    protected static readonly PIXEL_FORMAT_LENGTH = 4;

    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            image.data[i + 0] = this.changeRGBValue(image.data[i + 0]);
            image.data[i + 1] = this.changeRGBValue(image.data[i + 1]);
            image.data[i + 2] = this.changeRGBValue(image.data[i + 2]);
        }
    }
    changeRGBValue(value: number): number {
        return value;
    }
}
