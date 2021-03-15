import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';

export class DatabaseServiceMock extends DatabaseService {
    db: Db;
    private server: MongoMemoryServer;

    async start(url?: string): Promise<MongoClient | null> {
        if (!this.client) {
            this.server = new MongoMemoryServer();
            this.client = await MongoClient.connect(await this.server.getUri(), this.options);
            this.db = this.client.db(DatabaseServiceMock.DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            this.client.close();
        }
    }
}
