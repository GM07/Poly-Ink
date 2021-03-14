import { expect } from 'chai';
import * as supertest from 'supertest';
import { Drawing } from '../../../common/communication/drawing';
import { DrawingData } from '../../../common/communication/drawing-data';
import { Tag } from '../../../common/communication/tag';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { BASE64_IMG } from '../classes/drawings.const';
import { DrawingService } from '../services/drawing.service';
import { TYPES } from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_BAD_REQUEST = 400;

describe.only('DrawingController', () => {
    const baseTags = [{
        name: 'tag1'
    } as Tag, {
        name: 'tag2'
    } as Tag];
    
    const baseDrawingDatas = [
    {
        "_id": "id1",
        "tags": [baseTags[0]],
        "name": "Tag 1"
    } as DrawingData, {
        "_id": "id2",
        "tags": [baseTags[1]],
        "name": "Tag 2"
    }];
    const baseDrawings = [{
        "data": baseDrawingDatas[0],
        "image": BASE64_IMG
    } as Drawing, {
        "data": baseDrawingDatas[1],
        "image": BASE64_IMG,
    }];

    let drawingService: Stubbed<DrawingService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            validateName: sandbox.stub().resolves(true),
            validateTags: sandbox.stub().resolves(true),
            storeDrawing: sandbox.stub().resolves(),
            getLocalDrawing: sandbox.stub().returns(BASE64_IMG),
            getAllDrawingsData: sandbox.stub().resolves([baseDrawingDatas[0], baseDrawingDatas[1]]),
            getDrawingsDataFromTags: sandbox.stub().resolves([baseDrawingDatas[0]]),
            getDrawingDataFromName: sandbox.stub().resolves([baseDrawingDatas[1]]),
            createNewDrawingData: sandbox.stub().resolves('id1'),
            createNewDrawingDataFromName: sandbox.stub().resolves('id2'),
            deleteDrawingDataFromId: sandbox.stub().resolves(),
            deleteDrawingData: sandbox.stub().resolves(),
        });

        drawingService = container.get(TYPES.DrawingService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return all the drawings on valid request', () => {
        return supertest(app)
            .get('/drawings/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseDrawings);
            });
    });
    
    it('should return all the drawings with tag1 on valid request', () => {
        return supertest(app)
            .get('/drawings?tags=tag1')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([baseDrawings[0]]);
            });
    });
    
    it('should return bad request if the name is not valid', () => {
        drawingService.validateTags.returns(false);
        return supertest(app)
                    .post('/drawings/create/')
                    .set('content-type', 'application/json')
                    .send(baseDrawings[0])
                    .expect(HTTP_BAD_REQUEST)
    });

    it('should return bad request if the name is not valid', () => {
        drawingService.validateName.returns(false);
        return supertest(app)
                    .post('/drawings/create/')
                    .set('content-type', 'application/json')
                    .send(baseDrawings[0])
                    .expect(HTTP_BAD_REQUEST)
    });

    it('should not return drawings if they were not found on the server', () => {
        drawingService.getLocalDrawing.throws(new Error());
        return supertest(app)
            .get('/drawings/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.be.empty;
            });
    });

    it('should return created message on a valid request', () => {
        return supertest(app)
            .post('/drawings/create/')
            .set('content-type', 'application/json')
            .send(baseDrawings[0])
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body.message).to.equal('Success');
            });
    });

    it('should call the delete function without ids on valid request', () => {
        return supertest(app)
            .delete('/drawings')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(drawingService.deleteDrawingData.called).to.be.true;
                expect(response.body.message).to.equal('Success');
            });
    });

    it('should call the delete function with ids on valid request', () => {
        return supertest(app)
            .delete('/drawings?ids=id1')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(drawingService.deleteDrawingDataFromId.called).to.be.true;
                expect(response.body.message).to.equal('Success');
            });
    });
});