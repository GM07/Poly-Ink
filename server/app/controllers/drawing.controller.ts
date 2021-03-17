import { HttpStatus } from '@app/classes/http-codes';
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
        return body.hasOwnProperty('image') && body.hasOwnProperty('data') && body.data.hasOwnProperty('name') && body.data.hasOwnProperty('tags');
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const drawing: Drawing = req.body;

            if (!this.validateBody(drawing)) {
                res.status(HttpStatus.BAD_REQUEST).send(ResponseMessage.BodyBadlyFormated);
                return;
            }

            if (!this.drawingService.validateTags(drawing.data.tags)) {
                res.status(HttpStatus.BAD_REQUEST).send(ResponseMessage.TagsNotValid);
                return;
            }

            if (!this.drawingService.validateName(drawing.data.name)) {
                res.status(HttpStatus.BAD_REQUEST).send(ResponseMessage.NameNotValid);
                return;
            }

            try {
                drawing.data._id = await this.drawingService.createNewDrawingData(drawing.data);
                this.drawingService.storeDrawing(drawing);
                res.status(HttpStatus.CREATED).send(ResponseMessage.SuccessfullyCreated);
            } catch {
                res.status(HttpStatus.SERVICE_UNAVAILABLE).send(ResponseMessage.CouldNotWriteOnDatabase);
            }
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
            res.status(HttpStatus.SUCCESS).json(drawings);
        });

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            const ids: string = req.query.ids;
            let status = HttpStatus.SUCCESS;
            let response = ResponseMessage.SuccessfullyDeleted;
            if (ids) {
                const idArray: string[] = ids.split(',');
                for (const id of idArray) {
                    try {
                        await this.drawingService.deleteDrawingDataFromId(id);
                    } catch {
                        status = HttpStatus.NOT_FOUND;
                        response = ResponseMessage.CouldNotDeleteOnDatabase;
                        break;
                    }

                    try {
                        this.drawingService.deleteLocalDrawing(id);
                    } catch {
                        status = HttpStatus.NOT_FOUND;
                        response = ResponseMessage.CouldNotDeleteOnServer;
                        break;
                    }
                }
            } else {
                status = HttpStatus.BAD_REQUEST;
                response = ResponseMessage.IdsNotValid;
            }
            res.status(status).send(response);
        });
    }
}
