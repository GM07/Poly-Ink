import { expect } from 'chai';
import { DataNotCreated, DataNotDeleted, DataNotFound, FileNotFound, HttpException } from './errors';

describe('Errors', () => {
    const message = 'This is a message';

    it('should create DataNotFound error', () => {
        const error = new DataNotFound(message);
        expect(error.name).to.equal('DataNotFound');
        expect(error.message).to.equal(message);
    });

    it('should create DataNotDeleted error', () => {
        const error = new DataNotDeleted(message);

        expect(error.name).to.equal('DataNotDeleted');
        expect(error.message).to.equal(message);
    });

    it('should create DataNotCreated error', () => {
        const error = new DataNotCreated(message);

        expect(error.name).to.equal('DataNotCreated');
        expect(error.message).to.equal(message);
    });

    it('should create HttpException error', () => {
        //tslint:disable:no-magic-numbers
        const error = new HttpException(200, message);

        expect(error.name).to.equal('HttpException (200)');
        expect(error.message).to.equal(message);
    });

    it('should create FileNotFound error', () => {
        const error = new FileNotFound(message);

        expect(error.name).to.equal('FileNotFound');
        expect(error.message).to.equal(message);
    });
});
