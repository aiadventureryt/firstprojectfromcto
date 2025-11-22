import { Module } from '@nestjs/common';
import { SavedItemsController } from './saved-items.controller';

@Module({
  controllers: [SavedItemsController],
})
export class SavedItemsModule {}