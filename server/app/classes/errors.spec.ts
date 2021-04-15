import { expect } from 'chai';
import { DataNotCreated, DataNotDeleted, DataNotFound, FileNotFound, HttpException } from './errors';
import { HttpStatus } from './http-codes';

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
        const error = new HttpException(HttpStatus.SUCCESS, message);

        expect(error.name).to.equal('HttpException (200)');
        expect(error.message).to.equal(message);
    });

    it('should create FileNotFound error', () => {
        const error = new FileNotFound(message);

        expect(error.name).to.equal('FileNotFound');
        expect(error.message).to.equal(message);
    });
});
