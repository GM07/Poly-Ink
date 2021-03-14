import { DataNotCreated, DataNotDeleted, DataNotFound } from '@app/classes/errors';
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
        return name !== undefined && name !== '';
    }

    validateTags(tags: Tag[]): boolean {
        let valid = true;
        tags.forEach((tag) => {
            if (!this.validateTag(tag)) {
                valid = false;
            }
        });
        return valid;
    }

    validateTag(tag: Tag): boolean {
        return tag !== undefined && tag.name !== undefined && tag.name !== '';
    }

    async storeDrawing(drawing: Drawing): Promise<void> {
        const drawingId = drawing.data._id ?? 'image';
        const drawingPath = `${ROOT_DIRECTORY}/${drawingId}.png`;
        if (!fs.existsSync(ROOT_DIRECTORY)) {
            fs.mkdirSync(ROOT_DIRECTORY);
        }
        fs.writeFile(drawingPath, drawing.image, 'base64', function (err) {
            console.log(err);
        });
    }

    getLocalDrawing(id: string): string {
        const drawingPath = `${ROOT_DIRECTORY}/${id}.png`;
        console.log(drawingPath);
        if (!fs.existsSync(drawingPath)) {
            throw Error("Dessin n'existe pas");
        }

        const buffer: Buffer = fs.readFileSync(drawingPath);
        return Buffer.from(buffer).toString('base64');
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
            .find({ tags: { $in: drawingTags } })
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
            return await (await this.collection.insertOne(drawing)).insertedId;
        } catch (e) {
            throw new DataNotCreated(drawing.toString());
        }
    }

    async createNewDrawingDataFromName(name: string): Promise<string> {
        const drawing = new DrawingData(name);
        return await this.createNewDrawingData(drawing);
    }

    async deleteDrawingDataFromId(id: string): Promise<void> {
        await this.collection
            .findOneAndDelete({ _id: id })
            .then((result: FindAndModifyWriteOpResultObject<DrawingData>) => {
                if (!result.value) {
                    throw new DataNotFound(id);
                }
            })
            .catch(() => {
                throw new DataNotDeleted(id);
            });
    }

    async deleteDrawingData(drawing: DrawingData): Promise<void> {
        await this.collection
            .findOneAndDelete(drawing)
            .then((result: FindAndModifyWriteOpResultObject<DrawingData>) => {
                if (!result.value) {
                    throw new DataNotFound(drawing.toString());
                }
            })
            .catch(() => {
                throw new DataNotDeleted(drawing.toString());
            });
    }
}
