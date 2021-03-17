import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'reflect-metadata';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;

    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    it('should connect to database on start', async () => {
        const uri = await mongoServer.getUri();
        await databaseService.start(uri);

        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService.db.databaseName).to.equal(DatabaseService['DATABASE_NAME']);
    });

    it('should connect to database on start with default url when none is provided', async () => {
        Object.defineProperty(DatabaseService, 'DATABASE_URL', { value: await mongoServer.getUri() });
        await databaseService.start();

        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService.db.databaseName).to.equal(DatabaseService['DATABASE_NAME']);
    });

    it('should not connect to database on start with wrong url', async () => {
        try {
            await databaseService.start('TEST');
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
    });

    it('should close connection', async () => {
        const uri = await mongoServer.getUri();
        await databaseService.start(uri);

        await databaseService.closeConnection();
        expect(databaseService['client'].isConnected()).to.be.false;
    });
});
