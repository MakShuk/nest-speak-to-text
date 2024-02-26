import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const PORT = 3066;
	const app = await NestFactory.create(AppModule);

	await app.listen(PORT);
	console.log(`Сервер работает на http://localhost:${PORT}`);
}
bootstrap();
