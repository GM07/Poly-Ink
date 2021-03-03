import { Tag } from '@common/communication/tag';

export class DrawingData {
    name: string;
    tags: Tag[];

    constructor(name: string, tags: Tag[] = []) {
        this.name = name;
        this.tags = tags;
    }

    static fromAny(object: any): DrawingData {
        return new DrawingData(object.name, object.tags);
    }
}
