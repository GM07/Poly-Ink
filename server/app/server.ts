import * as http from 'http';
import { inject, injectable } from 'inversify';
import { Application } from './app';
import { TYPES } from './types';

@injectable()
export class Server {
    private readonly APP_PORT: string | number | boolean = this.normalizePort(process.env.PORT || '3000');
    private readonly BASE_DIX: number = 10;
    private server: http.Server;

    constructor(@inject(TYPES.Application) private application: Application) {}

    init(): void {
        this.application.app.set('port', this.APP_PORT);

        this.server = http.createServer(this.application.app);

        this.server.listen(this.APP_PORT);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.BASE_DIX) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof this.APP_PORT === 'string' ? 'Pipe ' + this.APP_PORT : 'Port ' + this.APP_PORT;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr = this.server.address();
        // tslint:disable-next-line:no-non-null-assertion
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
        // tslint:disable-next-line:no-console
        console.log(`Listening on ${bind}`);
    }
}
