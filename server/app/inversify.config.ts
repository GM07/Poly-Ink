import { Container } from 'inversify';
import { Application } from './app';
import { DrawingController } from './controllers/drawing.controller';
import { Server } from './server';
import { DatabaseService } from './services/database.service';
import { DrawingService } from './services/drawing.service';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DrawingController).to(DrawingController);
    container.bind(TYPES.DrawingService).to(DrawingService);

    container.bind(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

    return container;
};
