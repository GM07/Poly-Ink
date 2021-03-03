import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';

const ROOT_DIRECTORY = 'drawings';

@injectable()
export class DrawingService {
    private static readonly COLLECTION = 'drawings';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        databaseService.start();
    }

    get collection(): Collection<DrawingData> {
        return this.databaseService.db.collection(DrawingService.COLLECTION);
    }

    validateName(name: string): boolean {
        if (name) {
            return true;
        } else {
            return false;
        }
    }

    // TODO: Tag Validation
    validateTags(tags: Tag[]) {
        return true;
    }

    async storeDrawing(drawing: Drawing): Promise<void> {
        const drawingId = drawing.id ?? 'image';
        const drawingPath = `${ROOT_DIRECTORY}/${drawingId}.png`;
        if (!fs.existsSync(ROOT_DIRECTORY)) {
            fs.mkdirSync(ROOT_DIRECTORY);
        }
        console.log(drawing.image);
        fs.writeFile(drawingPath, drawing.image, 'base64', function (err) {
            console.log(err);
        });
    }

    async getAllDrawingsData(): Promise<DrawingData[]> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingsDataFromTag(tag: Tag): Promise<DrawingData[]> {
        return this.collection
            .find({ tags: { $all: [tag] } })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingsDataFromTags(drawingTags: Tag[]): Promise<DrawingData[]> {
        return this.collection
            .find({ tags: { $all: drawingTags } })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingDataFromName(drawingName: string): Promise<DrawingData[]> {
        return this.collection
            .find({ name: drawingName })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async createNewDrawingData(drawing: DrawingData): Promise<string> {
        try {
            return await (await this.collection.insertOne(drawing)).insertedId.toHexString();
        } catch (e) {
            throw new Error('Erreur lors de la creation du dessin dans la base de donnee');
        }
    }

    async createNewDrawingDataFromTitle(title: string): Promise<string> {
        const drawing = new DrawingData(title);
        return await this.createNewDrawingData(drawing);
    }

    async deleteDrawingData(drawing: DrawingData): Promise<void> {
        await this.collection
            .findOneAndDelete(drawing)
            .then((result: FindAndModifyWriteOpResultObject<DrawingData>) => {
                if (!result.value) {
                    throw new Error("Le dessin n'a pas pu etre trouve");
                }
            })
            .catch(() => {
                throw new Error("Le dessin n'a pas pu etre supprime");
            });
    }
}
