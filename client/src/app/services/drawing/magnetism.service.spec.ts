import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';

import { MagnetismSelection, MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {
    let service: MagnetismService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should toggle with m', () => {
      const currentEnabled = service.isEnabled;
      service.onKeyDown({key: 'm', altKey: false, shiftKey: false } as KeyboardEvent);
      expect(service.isEnabled).not.toEqual(currentEnabled);
    });

    it('should not toggle magnetism with other key', () => {
      const event = {key: 'a' } as KeyboardEvent;
      const currentEnabled = service.isEnabled;
      service.onKeyDown(event);
      expect(service.isEnabled).toEqual(currentEnabled);
    });

    it('set distance vector should set min of x and y', () => {
      service.selection = MagnetismSelection.topLeft;
      const event = new Vec2(2,2);
      const endCoords = new Vec2(0,0);
      service.setDistanceVector(event, endCoords, new Vec2(0,0));
      expect(service.distance).toEqual(new Vec2(2,2));
    });

    it('set distance vector should set center of x and y', () => {
      service.selection = MagnetismSelection.center;
      const event = new Vec2(2,2);
      const endCoords = new Vec2(0,0);
      const size = new Vec2(4,4);
      service.setDistanceVector(event, endCoords, size);
      expect(service.distance).toEqual(new Vec2(0,0));
    });

    it('set distance vector should set max of x and y', () => {
      service.selection = MagnetismSelection.bottomRight;
      const event = new Vec2(2,2);
      const endCoords = new Vec2(0,0);
      const size = new Vec2(4,4);
      service.setDistanceVector(event, endCoords, size);
      expect(service.distance).toEqual(new Vec2(-2, -2));
    });

    it('getGridPosition should return currentPos is magnetism is not enabled', () => {
      expect(service.getGridPosition(new Vec2(5,5))).toEqual(new Vec2(5,5));
    });

    it('get grid position should return position of grid', () => {
      service.isEnabled = true;
      spyOn(service, 'getClosestIntersection');
      spyOn(service, 'getAjustement').and.returnValue(new Vec2(10,10));
      expect(service.getGridPosition(new Vec2(0,0))).toEqual(new Vec2(10, 10));
    });

    it('get closest intersection should return the closest intersection', () => {
      service.gridService.size = 25;
      expect(service.getClosestIntersection(new Vec2(22,22))).toEqual(new Vec2(25,25));
    });

    it('get closest intersection should return the closest intersection', () => {
      service.gridService.size = 25;
      expect(service.getClosestIntersection(new Vec2(12,12))).toEqual(new Vec2(0,0));
    });
});
