export class Filter {
    protected static readonly MAX_RBGA_VALUE = 255;

    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += 2 * 2) {
            image.data[i + 0] = this.changeRGBValue(image.data[i + 0]);
            image.data[i + 1] = this.changeRGBValue(image.data[i + 1]);
            image.data[i + 2] = this.changeRGBValue(image.data[i + 2]);
        }
    }
    changeRGBValue(value: number): number {
        return value;
    }
}
