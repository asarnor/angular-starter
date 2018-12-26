import { TestBed } from '@angular/core/testing';

import { MapObjectsService } from './map-objects.service';

describe('MapObjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapObjectsService = TestBed.get(MapObjectsService);
    expect(service).toBeTruthy();
  });
});
