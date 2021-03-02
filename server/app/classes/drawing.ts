export class Drawing {
    title: string;
    tags: string[];

    constructor(title: string, tags: string[] = []) {
        this.title = title;
        this.tags = tags;
    }

    static fromAny(object: any): Drawing {
        return new Drawing(object.title, object.tags);
    }
}
