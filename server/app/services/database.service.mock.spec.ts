import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import 'reflect-metadata';
import { DatabaseServiceMock } from './database.service.mock';

describe('Database Service mock', () => {
    let database: DatabaseServiceMock;

    beforeEach(() => {
        database = new DatabaseServiceMock();
    });

    it('should not start if client is not null', async () => {
        let client = { connect: () => {} } as MongoClient;
        database['client'] = client;
        database.start();
        expect(client).to.eq(client);
    });

    it('should not close connection if not started', async () => {
        await database.closeConnection();
        expect(database['client']).to.eq(undefined);
    });
});
