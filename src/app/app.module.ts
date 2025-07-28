import { Module } from '@nestjs/common';
import { FormsModule } from './forms/forms.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DelegatesModule } from './delegates/delegates.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    FormsModule,
    UsersModule,
    ConfigModule.forRoot(),
    AuthModule,
    DelegatesModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
