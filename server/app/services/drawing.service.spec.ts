import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { DrawingData } from '../../../common/communication/drawing-data';
import { Tag } from '../../../common/communication/tag';
import { DatabaseServiceMock } from './database.service.mock';
import { DrawingService } from './drawing.service';
// chai.use(chaiAsPromised);

describe('Drawing service', () => {
    let databaseService: DatabaseServiceMock;
    let drawingService: DrawingService;
    let client: MongoClient;

    // For tests
    let drawing: DrawingData;
    let drawing2: DrawingData;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = await databaseService.start();
        drawingService = new DrawingService(databaseService);

        drawing = {
            name: 'Test drawing',
            tags: [{ name: 'tag1' } as Tag, { name: 'tag2' } as Tag],
            _id: '1',
        } as DrawingData;

        drawing2 = {
            name: 'Pretty drawing',
            tags: [{ name: 'tag3' } as Tag, { name: 'tag4' } as Tag],
            _id: '2',
        } as DrawingData;

        await drawingService.createNewDrawingData(drawing);
        await drawingService.createNewDrawingData(drawing2);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all drawings', async () => {
        const drawings = await drawingService.getAllDrawingsData();
        expect(drawing).to.contain(drawing);
        expect(drawing).to.contain(drawing2);
    });

    it('should get drawings from tag', async () => {
        const drawings = await drawingService.getDrawingsDataFromTag('tag3');
        expect(drawings).to.contain(drawing2);
    });

    it('should get drawings from tags', async () => {
        const drawings = await drawingService.getDrawingsDataFromTag(['tag1', 'tag3']);
        expect(drawings).to.contain(drawing);
        expect(drawings).to.contain(drawing2);
    });

    it('should get drawings from name', async () => {
        const drawings = await drawingService.getDrawingDataFromName('Test drawing');
        expect(drawing).to.contain(drawing);
    });

    it('should create new drawing', async () => {
        expect(drawingService.collection.countDocuments).to.eq(2);
    });

    it('should create new drawing from name', async () => {
        await drawingService.createNewDrawingDataFromName('bob');
        expect(drawingService.collection.countDocuments).to.eq(3);
    });

    it('should delete drawing with id', async () => {
        await drawingService.deleteDrawingDataFromId('2');
        expect(drawingService.collection.countDocuments).to.eq(1);
        expect(await drawingService.getAllDrawingsData()).to.contain(drawing);
        expect(await drawingService.getAllDrawingsData()).not.to.contain(drawing2);
    });

    it('should delete drawing with drawing object', async () => {
        await drawingService.deleteDrawingData(drawing);
        expect(drawingService.collection.countDocuments).to.eq(1);
        expect(await drawingService.getAllDrawingsData()).not.to.contain(drawing);
        expect(await drawingService.getAllDrawingsData()).to.contain(drawing2);
    });
});
