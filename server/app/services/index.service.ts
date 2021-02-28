import { TYPES } from '@app/types';
import { Drawing, ROOT_DIRECTORY } from '@common/communication/drawing';
import { Message } from '@common/communication/message';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DateService } from './date.service';

@injectable()
export class IndexService {
    validateName(name: string): boolean {
        if (name) {
            return true;
        } else{
            return false;
        }
    }

    // TODO: Tag Validation
    validateTags(tags: string[]) {
        return true;
    }

    clientMessages: Message[];
    constructor(@inject(TYPES.DateService) private dateService: DateService) {
        this.clientMessages = [];
    }

    about(): Message {
        return {
            title: 'Basic Server About Page',
            body: 'Try calling helloWorld to get the time',
        };
    }

    async helloWorld(): Promise<Message> {
        return this.dateService
            .currentTime()
            .then((timeMessage: Message) => {
                return {
                    title: 'Hello world',
                    body: 'Time is ' + timeMessage.body,
                };
            })
            .catch((error: unknown) => {
                console.error('There was an error!!!', error);

                return {
                    title: 'Error',
                    body: error as string,
                };
            });
    }

    // TODO : ceci est à titre d'exemple. À enlever pour la remise
    storeMessage(message: Message): void {
        console.log(message);
        this.clientMessages.push(message);
    }

    async storeDrawing(drawing: Drawing): Promise<void> {
        const drawingId = Math.ceil(Math.random() * 1000);
        const drawingPath =  `${ROOT_DIRECTORY}/${drawingId}.png`;
        if(!fs.existsSync(ROOT_DIRECTORY)) {
            fs.mkdirSync(ROOT_DIRECTORY);
        }
        console.log(drawing.drawing64Str);
        fs.writeFile(drawingPath, drawing.drawing64Str, 'base64', function(err) {
            console.log(err);
        });
    }

    getAllMessages(): Message[] {
        return this.clientMessages;
    }
}
