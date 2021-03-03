import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';
import { inject, injectable } from 'inversify';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';

@injectable()
export class DrawingService {
    private static readonly COLLECTION = 'drawings';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        databaseService.start();
    }

    get collection(): Collection<DrawingData> {
        return this.databaseService.db.collection(DrawingService.COLLECTION);
    }

    async getAllDrawings(): Promise<DrawingData[]> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingsFromTag(tag: Tag): Promise<DrawingData[]> {
        return this.collection
            .find({ tags: { $all: [tag] } })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingsFromTags(drawingTags: Tag[]): Promise<DrawingData[]> {
        return this.collection
            .find({ tags: { $all: drawingTags } })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async getDrawingFromName(drawingName: string): Promise<DrawingData[]> {
        return this.collection
            .find({ name: drawingName })
            .toArray()
            .then((drawings: DrawingData[]) => {
                return drawings;
            });
    }

    async createNewDrawing(drawing: DrawingData): Promise<void> {
        await this.collection.insertOne(drawing).catch((error: Error) => {
            throw new Error('Erreur lors de la creation du dessin dans la base de donnee');
        });
    }

    async createNewDrawingFromTitle(title: string): Promise<void> {
        const drawing = new DrawingData(title);
        await this.createNewDrawing(drawing);
    }

    async deleteDrawing(drawing: DrawingData): Promise<void> {
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
