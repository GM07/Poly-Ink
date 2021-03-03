import { Tag } from "@app/classes/tag";

export class Drawing {
    title: string;
    tags: Tag[];

    constructor(title: string, tags: Tag[] = []) {
        this.title = title;
        this.tags = tags;
    }

    static fromAny(object: any): Drawing {
        return new Drawing(object.title, object.tags);
    }
}
