import { Drawing } from '@app/classes/drawing';
import { Tag } from "@app/classes/tag";
import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { inject, injectable } from 'inversify';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';

@injectable()
export class DrawingService {
    private static readonly COLLECTION = 'drawings';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        databaseService.start();
    }

    get collection(): Collection<Drawing> {
        return this.databaseService.db.collection(DrawingService.COLLECTION);
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            });
    }

    async getDrawingsFromTag(tag: Tag): Promise<Drawing[]> {
        return this.collection
            .find({ tags: { $all: [tag] } })
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            });
    }

    async getDrawingsFromTags(drawingTags: Tag[]): Promise<Drawing[]> {
        return this.collection
            .find({ tags: { $all: drawingTags } })
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            });
    }

    async getDrawingFromName(drawingName: string): Promise<Drawing[]> {
        return this.collection
            .find({ name: drawingName })
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            });
    }

    async createNewDrawing(drawing: Drawing): Promise<void> {
        await this.collection.insertOne(drawing).catch((error: Error) => {
            throw new Error('Erreur lors de la creation du dessin dans la base de donnee');
        });
    }

    async createNewDrawingFromTitle(title: string): Promise<void> {
        const drawing = new Drawing(title);
        await this.createNewDrawing(drawing);
    }

    async deleteDrawing(drawing: Drawing): Promise<void> {
        await this.collection
            .findOneAndDelete(drawing)
            .then((result: FindAndModifyWriteOpResultObject<Drawing>) => {
                if (!result.value) {
                    throw new Error("Le dessin n'a pas pu etre trouve");
                }
            })
            .catch(() => {
                throw new Error("Le dessin n'a pas pu etre supprime");
            });
    }
}
