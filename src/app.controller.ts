import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
	onModuleInit() {
		this.appService.keyAction();
	}
	constructor(private readonly appService: AppService) {}

	@Get('record-and-convert-to-text')
	async recordAndConvertToText(): Promise<string> {
		return await this.appService.recordAndConvertToText();
	}
	@Get('key-action')
	keyAction(): void {
		this.appService.keyAction();
	}

	@Get('paste-key-action')
	async pasteKeyAction(): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, 1000));
		this.appService.pasteKeyAction();
	}
}
