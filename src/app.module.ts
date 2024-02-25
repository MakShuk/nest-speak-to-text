import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from 'src/openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './record/record.module';

@Module({
	imports: [OpenaiModule, ConfigModule.forRoot(), RecordModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
