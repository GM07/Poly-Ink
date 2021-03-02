import { Drawing } from '@app/classes/drawing';
import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DrawingController {
    router: Router;

    constructor(@inject(TYPES.DrawingService) private drawingService: DrawingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            this.drawingService.createNewDrawing(Drawing.fromAny(req.body));
            res.status(200).send('<h1>Created</h1>');
        });
    }
}
