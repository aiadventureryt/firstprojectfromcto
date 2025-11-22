'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const common_1 = require('@nestjs/common');
const config_1 = require('@nestjs/config');
async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule);
  const configService = app.get(config_1.ConfigService);
  const port = configService.get('PORT') || 3001;
  app.useGlobalPipes(
    new common_1.ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  await app.listen(port);
  console.log(`Backend application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
