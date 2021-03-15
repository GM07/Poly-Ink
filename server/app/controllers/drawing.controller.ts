import { HTTP_STATUS } from '@app/classes/http-codes';
import { ResponseMessage } from '@app/classes/response-message';
import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DrawingController {
    router: Router;

    constructor(@inject(TYPES.DrawingService) private drawingService: DrawingService) {
        this.configureRouter();
    }

    private validateBody(body: Drawing): boolean {
        return (
            body.hasOwnProperty('image') &&
            body.hasOwnProperty('data') &&
            body.data.hasOwnProperty('_id') &&
            body.data.hasOwnProperty('name') &&
            body.data.hasOwnProperty('tags')
        );
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            let drawing: Drawing = req.body;

            if (!this.validateBody(drawing)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send(ResponseMessage.BodyBadlyFormated);
                return;
            }

            if (!this.drawingService.validateTags(drawing.data.tags)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send(ResponseMessage.TagsNotValid);
                return;
            }

            if (!this.drawingService.validateName(drawing.data.name)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send(ResponseMessage.NameNotValid);
                return;
            }

            let id = '';
            try {
                id = await this.drawingService.createNewDrawingData(drawing.data);
            } catch {
                res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).send(ResponseMessage.CouldNotWriteOnDatabase);
                return;
            }

            drawing.data._id = id;
            this.drawingService.storeDrawing(drawing);
            res.status(HTTP_STATUS.CREATED).send(ResponseMessage.SuccessfullyCreated);
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
            res.status(HTTP_STATUS.SUCCESS).json(drawings);
        });

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            const ids: string = req.query.ids;
            if (ids) {
                const idArray: string[] = ids.split(',');
                idArray.forEach(async (id: string) => {
                    this.drawingService
                        .deleteDrawingDataFromId(id)
                        .then()
                        .catch(() => {
                            res.status(HTTP_STATUS.NOT_FOUND).send(ResponseMessage.CouldNotDeleteOnDatabase);
                        });

                    try {
                        this.drawingService.deleteLocalDrawing(id);
                    } catch {
                        res.status(HTTP_STATUS.NOT_FOUND).send(ResponseMessage.CouldNotDeleteOnServer);
                    }
                });

                res.status(HTTP_STATUS.SUCCESS).send(ResponseMessage.SuccessfullyDeleted);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send(ResponseMessage.IdsNotValid);
            }
        });
    }
}
