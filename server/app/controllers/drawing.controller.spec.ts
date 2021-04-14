import { expect } from 'chai';
import { Container } from 'inversify';
import { SinonSandbox } from 'sinon';
import * as supertest from 'supertest';
import { Drawing } from '../../../common/communication/drawing';
import { DrawingData } from '../../../common/communication/drawing-data';
import { Tag } from '../../../common/communication/tag';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { BASE64_IMG } from '../classes/drawings.const';
import { HttpStatus } from '../classes/http-codes';
import { ResponseMessage } from '../classes/response-message';
import { DrawingService } from '../services/drawing.service';
import { TYPES } from '../types';

// The response's type expected when using supertest() is any
// tslint:disable:no-any

describe('DrawingController', () => {
    const baseTags = [
        {
            name: 'tag1',
        } as Tag,
        {
            name: 'tag2',
        } as Tag,
    ];

    const baseDrawingDatas = [
        {
            _id: 'id1',
            tags: [baseTags[0]],
            name: 'Tag 1',
        } as DrawingData,
        {
            _id: 'id2',
            tags: [baseTags[1]],
            name: 'Tag 2',
        },
    ];
    const baseDrawings = [
        {
            data: baseDrawingDatas[0],
            image: BASE64_IMG,
        } as Drawing,
        {
            data: baseDrawingDatas[1],
            image: BASE64_IMG,
        },
    ];

    let drawingService: Stubbed<DrawingService>;
    let app: Express.Application;
    let container: Container;
    let sandbox: SinonSandbox;

    beforeEach(async () => {
        const [cont, sand] = await testingContainer();

        cont.rebind(TYPES.DrawingService).toConstantValue({
            databaseValid: true,
            tryConnection: sand.stub().resolves(),
            validateName: sand.stub().resolves(true),
            validateTags: sand.stub().resolves(true),
            storeDrawing: sand.stub().resolves(),
            getLocalDrawing: sand.stub().returns(BASE64_IMG),
            deleteLocalDrawing: sand.stub(),
            getAllDrawingsData: sand.stub().resolves([baseDrawingDatas[0], baseDrawingDatas[1]]),
            getDrawingsDataFromTags: sand.stub().resolves([baseDrawingDatas[0]]),
            getDrawingDataFromName: sand.stub().resolves([baseDrawingDatas[1]]),
            createNewDrawingData: sand.stub().resolves('id1'),
            createNewDrawingDataFromName: sand.stub().resolves('id2'),
            deleteDrawingDataFromId: sand.stub().resolves(),
            deleteDrawingData: sand.stub().resolves(),
        });

        container = cont;
        sandbox = sand;

        drawingService = container.get(TYPES.DrawingService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it("should return unavailable connection if database doesn't connect", () => {
        sandbox.stub(drawingService, 'databaseValid').value(false);

        return supertest(app)
            .get('/drawings/')
            .expect(HttpStatus.SERVICE_UNAVAILABLE)
            .then((response: any) => {
                expect(response.body).to.deep.equal(ResponseMessage.DatabaseNotValid);
            });
    });

    it('should return all the drawings on valid request', () => {
        return supertest(app)
            .get('/drawings/')
            .expect(HttpStatus.SUCCESS)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseDrawings);
            });
    });

    it('should return all the drawings with tag1 on valid request', () => {
        return supertest(app)
            .get('/drawings?tags=tag1')
            .expect(HttpStatus.SUCCESS)
            .then((response: any) => {
                expect(response.body).to.deep.equal([baseDrawings[0]]);
            });
    });

    it('should return bad request if the body is not valid', () => {
        const badBody = ({ title: 'test' } as unknown) as Drawing;
        return supertest(app).post('/drawings/').set('content-type', 'application/json').send(badBody).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return bad request if the name is not valid', () => {
        drawingService.validateTags.returns(false);
        return supertest(app).post('/drawings/').set('content-type', 'application/json').send(baseDrawings[0]).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return bad request if the name is not valid', () => {
        drawingService.validateName.returns(false);
        return supertest(app).post('/drawings/').set('content-type', 'application/json').send(baseDrawings[0]).expect(HttpStatus.BAD_REQUEST);
    });

    it('should not return drawings if they were not found on the server', () => {
        drawingService.getLocalDrawing.throws(new Error());
        return supertest(app)
            .get('/drawings/')
            .expect(HttpStatus.SUCCESS)
            .then((response: any) => {
                expect(response.body).to.be.empty;
            });
    });

    it('should return created message on a valid request', () => {
        return supertest(app)
            .post('/drawings/')
            .set('content-type', 'application/json')
            .send(baseDrawings[0])
            .expect(HttpStatus.CREATED)
            .then((response: any) => {
                expect(response.body).to.deep.equal(ResponseMessage.SuccessfullyCreated);
            });
    });

    it('should return service unavailable when error with database', () => {
        drawingService.createNewDrawingData.throws('Error');
        return supertest(app)
            .post('/drawings/')
            .set('content-type', 'application/json')
            .send(baseDrawings[0])
            .expect(HttpStatus.SERVICE_UNAVAILABLE)
            .then((response: any) => {
                expect(response.body).to.deep.equal(ResponseMessage.CouldNotWriteOnDatabase);
            });
    });

    it('should return bad request function without ids', () => {
        return supertest(app)
            .delete('/drawings')
            .expect(HttpStatus.BAD_REQUEST)
            .then((response: any) => {
                expect(drawingService.deleteDrawingDataFromId.called).to.be.false;
                expect(response.body).to.deep.equal(ResponseMessage.IdsNotValid);
            });
    });

    it('should call the delete function with ids on valid request', () => {
        return supertest(app)
            .delete('/drawings?ids=id1')
            .expect(HttpStatus.SUCCESS)
            .then((response: any) => {
                expect(drawingService.deleteDrawingDataFromId.called).to.be.true;
                expect(response.body).to.deep.equal(ResponseMessage.SuccessfullyDeleted);
            });
    });

    it('should return not found when deleting an invalid id', () => {
        drawingService.deleteDrawingDataFromId.throws('Test');
        return supertest(app)
            .delete('/drawings?ids=1')
            .expect(HttpStatus.NOT_FOUND)
            .then((response: any) => {
                expect(response.body).to.deep.equal(ResponseMessage.CouldNotDeleteOnDatabase);
            });
    });

    it('should return not found when deleting a non existant local drawing', () => {
        drawingService.deleteLocalDrawing.throws('Error');
        return supertest(app)
            .delete('/drawings?ids=id1')
            .expect(HttpStatus.NOT_FOUND)
            .then((response: any) => {
                expect(response.body).to.deep.equal(ResponseMessage.CouldNotDeleteOnServer);
            });
    });
});
