import { expect } from 'chai';
import { ResponseMessage } from './response-message';

describe('Response message', () => {
    it('should create BodyBadlyFormated respons', () => {
        expect(ResponseMessage.BodyBadlyFormated.message).to.eq('Body is not formated correctly');
    });

    it('should create TagsNotValid respons', () => {
        expect(ResponseMessage.TagsNotValid.message).to.eq('Tags are not valid');
    });

    it('should create NameNotValid respons', () => {
        expect(ResponseMessage.NameNotValid.message).to.eq('Name is not valid');
    });

    it('should create IdsNotValid respons', () => {
        expect(ResponseMessage.IdsNotValid.message).to.eq('Ids are not valid');
    });

    it('should create CouldNotWriteOnDatabase respons', () => {
        expect(ResponseMessage.CouldNotWriteOnDatabase.message).to.eq('Could not write on the database');
    });

    it('should create CouldNotWriteOnServer respons', () => {
        expect(ResponseMessage.CouldNotWriteOnServer.message).to.eq('Could not write on server');
    });

    it('should create CouldNotDeleteOnDatabase respons', () => {
        expect(ResponseMessage.CouldNotDeleteOnDatabase.message).to.eq('Could not delete on the database');
    });

    it('should create CouldNotDeleteOnServer respons', () => {
        expect(ResponseMessage.CouldNotDeleteOnServer.message).to.eq('Could not delete on server');
    });

    it('should create SuccessfullyCreated respons', () => {
        expect(ResponseMessage.SuccessfullyCreated.message).to.eq('Successfully created');
    });

    it('should create SuccessfullyDeleted respons', () => {
        expect(ResponseMessage.SuccessfullyDeleted.message).to.eq('Successfully deleted');
    });
});
