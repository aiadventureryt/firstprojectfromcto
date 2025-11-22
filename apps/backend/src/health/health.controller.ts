import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from '@workspace/shared';

@Controller()
export class HealthController {
  @Get('health')
  getHealth(): HealthCheckResponse {
    const startTime = Date.now();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '0.1.0',
    };
  }
}
