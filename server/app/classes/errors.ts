// tslint:disable:max-classes-per-file
// To not create multiple files with 6 lines each, we disable lint
export class DataNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataNotFound';
    }
}

export class DataNotDeleted extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataNotDeleted';
    }
}

export class DataNotCreated extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataNotCreated';
    }
}

export class HttpException extends Error {
    constructor(code: number, message: string) {
        super(message);
        this.name = 'HttpException (' + code + ')';
    }
}

export class FileNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileNotFound';
    }
}
