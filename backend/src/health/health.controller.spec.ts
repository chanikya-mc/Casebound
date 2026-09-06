import { ServiceUnavailableException } from '@nestjs/common';
import type { Connection } from 'mongoose';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports a connected database', () => {
    const controller = new HealthController({ readyState: 1 } as Connection);

    expect(controller.check()).toEqual({ status: 'ok', database: 'connected' });
  });

  it('fails safely when the database is unavailable', () => {
    const controller = new HealthController({ readyState: 0 } as Connection);

    expect(() => controller.check()).toThrow(ServiceUnavailableException);
  });
});
