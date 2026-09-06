import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check(): { status: 'ok'; database: 'connected' } {
    if (this.connection.readyState !== 1) {
      throw new ServiceUnavailableException('Database is unavailable');
    }

    return { status: 'ok', database: 'connected' };
  }
}
