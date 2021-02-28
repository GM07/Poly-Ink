export interface Drawing {
    name: string;
    drawing64Str: string;
    tags: string[];
    id?: string;
}

export const ROOT_DIRECTORY:string = 'drawings';