import { Tag } from './tag';

/* tslint:disable:variable-name */
/* tslint:disable:no-any */
export class DrawingData {
    name: string;
    tags: Tag[];
    _id: string;

    constructor(name: string, tags: Tag[] = [], id: string = '') {
        this.name = name;
        this.tags = tags;
        this._id = id;
    }

    static fromAny(object: any): DrawingData {
        return new DrawingData(object.name, object.tags);
    }

    toString(): string {
        return '[' + this._id + '] : ' + this.name + ' - ' + this.tags.toString();
    }
}
