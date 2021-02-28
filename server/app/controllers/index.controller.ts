import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IndexService } from '../services/index.service';

const HTTP_STATUS_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(TYPES.IndexService) private indexService: IndexService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Index
         *     description: Default cadriciel endpoint
         *   - name: Message
         *     description: Messages functions
         */

        /**
         * @swagger
         *
         * /api/index:
         *   get:
         *     description: Return current time with hello world
         *     tags:
         *       - Index
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            const time: Message = await this.indexService.helloWorld();
            res.json(time);
        });

        /**
         * @swagger
         *
         * /api/index/about:
         *   get:
         *     description: Return information about http api
         *     tags:
         *       - Index
         *       - Time
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/about', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            res.json(this.indexService.about());
        });

        /**
         * @swagger
         *
         * /api/index/send:
         *   post:
         *     description: Send a message
         *     tags:
         *       - Index
         *       - Message
         *     requestBody:
         *         description: message object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Message'
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const drawing: Drawing = req.body;
            if (!this.indexService.validateTags(drawing.tags)) {
                res.sendStatus(HTTP_BAD_REQUEST);
            };

            if(!this.indexService.validateName(drawing.name)) {
                res.sendStatus(HTTP_BAD_REQUEST);
            }
            this.indexService.storeDrawing(drawing);
            res.sendStatus(HTTP_STATUS_CREATED);
        });

        /**
         * @swagger
         *
         * /api/index/all:
         *   get:
         *     description: Return all messages
         *     tags:
         *       - Index
         *       - Message
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: messages
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/all', (req: Request, res: Response, next: NextFunction) => {
            res.json(this.indexService.getAllMessages());
        });
    }
}
