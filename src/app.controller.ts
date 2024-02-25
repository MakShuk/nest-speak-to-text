import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('record-and-convert-to-text')
	async recordAndConvertToText(): Promise<string> {
		return await this.appService.recordAndConvertToText();
	}
	@Get('key-action')
	keyAction(): void {
		this.appService.keyAction();
	}
}
