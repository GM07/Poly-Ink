import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class DatabaseServiceMock {
    private static readonly DATABASE_NAME = 'carrousel_mock';

    public db: Db;
    private client: MongoClient;
    private server: MongoMemoryServer;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url?: string): Promise<MongoClient | null> {
        if (!this.client) {
            try {
                this.server = new MongoMemoryServer();
                this.client = await MongoClient.connect(await this.server.getUri(), this.options);
                this.db = this.client.db(DatabaseServiceMock.DATABASE_NAME);
            } catch {
                throw new Error('Erreur de connection avec la base de donnee mock');
            }
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            this.client.close();
        }
    }

    get database(): Db {
        return this.db;
    }
}
