import { Tag } from '@common/communication/tag';

export class DrawingData {
    title: string;
    tags: Tag[];

    constructor(title: string, tags: Tag[] = []) {
        this.title = title;
        this.tags = tags;
    }

    static fromAny(object: any): DrawingData {
        return new DrawingData(object.title, object.tags);
    }
}
