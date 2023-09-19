import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FairyModule } from './fairy/fairy.module';

@Module({
  imports: [UsersModule, FairyModule],
})
export class ContextModule {}
