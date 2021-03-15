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
        // TODO : Remove create
        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            // TODO : Verify body
            const drawing: Drawing = req.body;
            if (!this.drawingService.validateTags(drawing.data.tags)) {
                res.sendStatus(HTTP_BAD_REQUEST);
                return;
            }

            if (!this.drawingService.validateName(drawing.data.name)) {
                res.sendStatus(HTTP_BAD_REQUEST);
                return;
            }
            // Verify drawing has been created
            const id = await this.drawingService.createNewDrawingData(drawing.data);
            drawing.data._id = id;
            this.drawingService.storeDrawing(drawing);
            res.status(HTTP_STATUS_CREATED).send({
                message: 'Success',
            });
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

            const drawings: (Drawing | null)[] = drawingsData
                .map((data: DrawingData) => {
                    try {
                        const drawing = new Drawing(data);
                        drawing.image = this.drawingService.getLocalDrawing(drawing.data._id);
                        return drawing;
                    } catch (e) {
                        return null;
                    }
                })
                .filter((e) => e !== null);

            res.status(HTTP_STATUS_SUCCESS).json(drawings);
        });

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            const ids: string = req.query.ids;
            if (ids) {
                const idArray: string[] = ids.split(',');
                idArray.forEach(async (id: string) => {
                    await this.drawingService.deleteDrawingDataFromId(id);
                });
                res.status(HTTP_STATUS_SUCCESS).send({
                    message: 'Success',
                });
            } else {
                res.status(HTTP_BAD_REQUEST).send({
                    message: 'Provide the ids to delete!',
                });
            }
        });
    }
}
