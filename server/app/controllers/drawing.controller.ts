import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_SUCCESS = 200;
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
            drawing.data._id = id;
            this.drawingService.storeDrawing(drawing);
            res.status(200).send('<h1>Created</h1>');
        });

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            const tags: string = req.query.tags;
            let drawingsData: DrawingData[];
            if (tags) {
                const tagArray: Tag[] = tags.split(',').map((name: string) => new Tag(name));
                drawingsData = await this.drawingService.getDrawingsDataFromTags(tagArray);
            } else {
                drawingsData = await this.drawingService.getAllDrawingsData();
            }

            let drawings: (Drawing | null)[] = drawingsData
                .map((data: DrawingData) => {
                    try {
                        let drawing = new Drawing(data);
                        drawing.image = this.drawingService.getLocalDrawing(drawing.data._id ?? '');
                        return drawing;
                    } catch (e) {
                        return null;
                    }
                })
                .filter((e) => e !== null);

            res.status(HTTP_STATUS_SUCCESS).json(drawings);
        });

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            const ids: string = req.query.id;
            if (ids) {
                const idArray: string[] = ids.split(',');
                idArray.forEach(async (id: string) => {
                    await this.drawingService.deleteDrawingDataFromId(id);
                });
            } else {
                const drawing: Drawing = req.body;
                this.drawingService.deleteDrawingData(drawing.data);
            }
        });
    }
}
