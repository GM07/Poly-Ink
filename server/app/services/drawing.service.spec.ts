import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/drawing';
import { DrawingData } from '../../../common/communication/drawing-data';
import { Tag } from '../../../common/communication/tag';
import { BASE64_IMG } from '../classes/drawings.const';
import { DatabaseServiceMock } from './database.service.mock';
import { DrawingService } from './drawing.service';

describe('Drawing service', () => {
    let databaseService: DatabaseServiceMock;
    let drawingService: DrawingService;

    // For tests
    let drawing: DrawingData;
    let drawing2: DrawingData;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        // TODO : Change to test
        databaseService = new DatabaseServiceMock();
        drawingService = new DrawingService(databaseService);
        await databaseService.start();

        drawing = {
            _id: '1',
            name: 'Test drawing',
            tags: [new Tag('tag1'), new Tag('tag2')],
        } as DrawingData;

        drawing2 = {
            _id: '2',
            name: 'Pretty drawing',
            tags: [new Tag('tag3'), new Tag('tag4')],
        } as DrawingData;

        await drawingService.createNewDrawingData(drawing);
        await drawingService.createNewDrawingData(drawing2);

        DrawingService['ROOT_DIRECTORY'] = 'drawings_test';
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all drawings', async () => {
        const drawings = await drawingService.getAllDrawingsData();
        expect(drawings).to.deep.contain(drawing);
        expect(drawings).to.deep.contain(drawing2);
    });

    it('should get drawings from tag', async () => {
        const drawings = await drawingService.getDrawingsDataFromTag({ name: 'tag3' } as Tag);
        expect(drawings).to.deep.contain(drawing2);
    });

    it('should get drawings from tags', async () => {
        const tag1 = new Tag('tag1');
        const tag2 = new Tag('tag3');
        const drawings = await drawingService.getDrawingsDataFromTags([tag1, tag2]);
        expect(drawings).to.deep.contain(drawing);
        expect(drawings).to.deep.contain(drawing2);
    });

    it('should get drawings from name', async () => {
        const drawings = await drawingService.getDrawingDataFromName('Test drawing');
        expect(drawings).to.deep.contain(drawing);
    });

    it('should create new drawing', async () => {
        const drawings = await drawingService.getAllDrawingsData();
        expect(drawings.length).to.eq(2);
    });

    it('should create new drawing from name', async () => {
        await drawingService.createNewDrawingDataFromName('bob');
        const drawings = await drawingService.getAllDrawingsData();
        expect(drawings.length).to.eq(3);
    });

    it('should delete drawing with id', async () => {
        await drawingService.deleteDrawingDataFromId('2');
        expect(await drawingService.getAllDrawingsData()).to.deep.contain(drawing);
        expect(await drawingService.getAllDrawingsData()).not.to.deep.contain(drawing2);
    });

    it('should delete drawing with drawing object', async () => {
        await drawingService.deleteDrawingData(drawing);
        expect(await drawingService.getAllDrawingsData()).not.to.deep.contain(drawing);
        expect(await drawingService.getAllDrawingsData()).to.deep.contain(drawing2);
    });

    it("should throw error on delete drawing with object that doesn't exist", async () => {
        drawingService.deleteDrawingData({ name: 'test' } as DrawingData).catch((e) => {
            expect(e.type).to.eq('DataNotFound');
        });
    });

    it("should throw error on delete drawing with id that doesn't exist", async () => {
        drawingService.deleteDrawingDataFromId('testid').catch((e) => {
            expect(e.type).to.eq('DataNotFound');
        });
    });

    it('should not accept undefined name', () => {
        expect(drawingService.validateName((undefined as unknown) as string)).to.eq(false);
    });

    it('should not accept empty name', () => {
        expect(drawingService.validateName('')).to.eq(false);
    });

    it('should accept valid name', () => {
        expect(drawingService.validateName('test')).to.eq(true);
    });

    it('should not accept undefined tags', () => {
        const tags: Tag[] = [{ name: 'valid' } as Tag, (undefined as unknown) as Tag, ({ name: undefined } as unknown) as Tag];
        expect(drawingService.validateTags(tags)).to.eq(false);
    });

    it('should not accept empty tags', () => {
        const tags: Tag[] = [{ name: 'valid' } as Tag, { name: '' } as Tag];
        expect(drawingService.validateTags(tags)).to.eq(false);
    });

    it("should throw error when drawing can't be created", async () => {
        drawingService['collection'].insertOne = (a: any): Promise<any> => {
            throw new Error('test');
        };
        drawingService.createNewDrawingDataFromName('test').catch((e) => {
            expect(e.type).to.eq('DataNotCreated');
        });

        drawingService.createNewDrawingData({} as DrawingData).catch((e) => {
            expect(e.type).to.eq('DataNotCreated');
        });
    });

    it('should store drawing and create directory if it does not exist', async () => {
        const drawing: Drawing = new Drawing(new DrawingData('test', [], '2'));
        drawing.image = BASE64_IMG;

        if (fs.existsSync(DrawingService['ROOT_DIRECTORY'])) {
            await fs.rmdir(DrawingService['ROOT_DIRECTORY'], () => {});
        }

        await drawingService.storeDrawing(drawing);
        const path = DrawingService['ROOT_DIRECTORY'] + '/' + '2.png';
        expect(fs.existsSync(path)).to.eq(true);

        fs.unlinkSync(path);
        fs.rmdirSync(DrawingService['ROOT_DIRECTORY']);
    });

    it('should store drawing and not create directory if it exists', async () => {
        const drawing: Drawing = new Drawing(new DrawingData('test', [], '2'));
        drawing.image = BASE64_IMG;

        fs.mkdirSync(DrawingService['ROOT_DIRECTORY']);

        await drawingService.storeDrawing(drawing);
        const path = DrawingService['ROOT_DIRECTORY'] + '/' + '2.png';
        expect(fs.existsSync(path)).to.eq(true);

        fs.unlinkSync(path);
        fs.rmdirSync(DrawingService['ROOT_DIRECTORY']);
    });

    it('should get local drawing if file exists', async () => {
        const drawing: Drawing = new Drawing(new DrawingData('test', [], '2'));
        drawing.image = BASE64_IMG;
        const path = DrawingService['ROOT_DIRECTORY'] + '/' + '2.png';
        fs.mkdirSync(DrawingService['ROOT_DIRECTORY']);
        fs.writeFileSync(path, drawing.image, 'base64');

        const image = drawingService.getLocalDrawing(drawing.data._id);

        expect(image).to.eq(BASE64_IMG);

        fs.unlinkSync(path);
        fs.rmdirSync(DrawingService['ROOT_DIRECTORY']);
    });

    it('should not get local drawing if file doest not exist', async () => {
        const drawing: Drawing = new Drawing(new DrawingData('test', [], '2'));
        drawing.image = BASE64_IMG;
        try {
            drawingService.getLocalDrawing('2');
        } catch (e) {
            expect(e.name).to.eq('FileNotFound');
        }
    });
});
