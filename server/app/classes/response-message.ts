export class ResponseMessage {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    static get BodyBadlyFormated(): ResponseMessage {
        return new ResponseMessage('Body is not formated correctly');
    }

    static get TagsNotValid(): ResponseMessage {
        return new ResponseMessage('Tags are not valid');
    }

    static get NameNotValid(): ResponseMessage {
        return new ResponseMessage('Name is not valid');
    }

    static get IdsNotValid(): ResponseMessage {
        return new ResponseMessage('Ids are not valid');
    }

    static get CouldNotWriteOnDatabase(): ResponseMessage {
        return new ResponseMessage('Could not write on the database');
    }

    static get CouldNotWriteOnServer(): ResponseMessage {
        return new ResponseMessage('Could not write on server');
    }

    static get CouldNotDeleteOnDatabase(): ResponseMessage {
        return new ResponseMessage('Could not delete on the database');
    }

    static get CouldNotDeleteOnServer(): ResponseMessage {
        return new ResponseMessage('Could not delete on server');
    }

    static get SuccessfullyCreated(): ResponseMessage {
        return new ResponseMessage('Successfully created');
    }

    static get SuccessfullyDeleted(): ResponseMessage {
        return new ResponseMessage('Successfully deleted');
    }
}
