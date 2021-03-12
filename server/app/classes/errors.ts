export class DataNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Data Not Found';
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
