import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
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
            const drawing: Drawing = req.body;
            this.drawingService.createNewDrawing(drawing.data);
            res.status(200).send('<h1>Created</h1>');
        });
    }
}
