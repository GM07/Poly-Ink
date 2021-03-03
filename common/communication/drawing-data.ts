import { Tag } from '@common/communication/tag';

export class DrawingData {
    name: string;
    tags: Tag[];
    _id: string;

    constructor(name: string, tags: Tag[] = [], id = '') {
        this.name = name;
        this.tags = tags;
        this._id = id;
    }

    static fromAny(object: any): DrawingData {
        return new DrawingData(object.name, object.tags);
    }
}
