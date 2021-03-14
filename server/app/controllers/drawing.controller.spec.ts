import { expect } from 'chai';
import 'reflect-metadata';
import * as supertest from 'supertest';
import { DrawingData } from '../../../common/communication/drawing-data';
import { Tag } from '../../../common/communication/tag';
import { testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { BASE64_IMG } from '../classes/drawings.const';
import { TYPES } from '../types';

// tslint:disable:no-any
// const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;


describe('DrawingController', () => {
    const baseTags = [{
        name: 'tag1'
    } as Tag, {
        name: 'tag2'
    } as Tag];
    
    const baseDrawingDatas = [{
        "tags": [baseTags[0]],
        "name": "Tag 1"
    } as DrawingData, {
        "tags": [baseTags[1]],
        "name": "Tag 2"
    }];
    // const baseDrawing = [{
    //     "data": baseDrawingDatas[0],
    //     "image": BASE64_IMG
    // } as Drawing, {
    //     "data": baseDrawingDatas[1],
    //     "image": BASE64_IMG,
    // }];

    // let drawingService: Stubbed<DrawingService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            validateName: sandbox.stub().resolves(true),
            validateTags: sandbox.stub().resolves(true),
            storeDrawing: sandbox.stub().resolves(),
            getLocalDrawing: sandbox.stub().resolves(BASE64_IMG),
            getAllDrawingsData: sandbox.stub().resolves([baseDrawingDatas[0], baseDrawingDatas[1]]),
            getDrawingsDataFromTags: sandbox.stub().resolves(baseDrawingDatas[0]),
            getDrawingDataFromName: sandbox.stub().resolves(baseDrawingDatas[1]),
            createNewDrawingData: sandbox.stub().resolves('id1'),
            createNewDrawingDataFromName: sandbox.stub().resolves('id2'),
            deleteDrawingDataFromId: sandbox.stub().resolves(),
            deleteDrawingData: sandbox.stub().resolves(),
        });

        // drawingService = container.get(TYPES.DrawingService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return ', () => {
        return supertest(app)
            .get('/drawings/')
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseDrawingDatas);
            });
    });
});