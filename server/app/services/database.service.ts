import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

@injectable()
export class DatabaseService {
    private static DATABASE_URL: string =
        'mongodb+srv://admin:ugbOOh4owMDAoNOQ@polyink.moize.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

    protected static DATABASE_NAME: string = 'carrousel';

    public db: Db;
    protected client: MongoClient;

    protected options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url: string = DatabaseService.DATABASE_URL): Promise<MongoClient | null> {
        try {
            let client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DatabaseService.DATABASE_NAME);
        } catch {
            throw new Error('Erreur de connection avec la base de donnee');
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }
}
