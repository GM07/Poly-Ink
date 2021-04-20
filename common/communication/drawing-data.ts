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
}
