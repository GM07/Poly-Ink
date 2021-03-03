import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_BAD_REQUEST = 400;

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
            if (!this.drawingService.validateTags(drawing.data.tags)) {
                res.sendStatus(HTTP_BAD_REQUEST);
            }

            if (!this.drawingService.validateName(drawing.data.name)) {
                res.sendStatus(HTTP_BAD_REQUEST);
            }
            res.sendStatus(HTTP_STATUS_CREATED);

            const id = await this.drawingService.createNewDrawingData(drawing.data);
            drawing.id = id;
            this.drawingService.storeDrawing(drawing);
            res.status(200).send('<h1>Created</h1>');
        });
    }
}
